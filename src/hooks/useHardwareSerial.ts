import { useState, useRef, useEffect, useCallback } from 'react';

export interface HardwareData {
  node_id: string;
  ambient_temp: number;
  wbgt: number;
  token: string;
}

export type HardwareErrorType =
  | 'IFRAME_BLOCKED'
  | 'PORT_NOT_FOUND'
  | 'PORT_BUSY'
  | 'UNSUPPORTED_BROWSER'
  | 'PARSER_WARN'
  | 'UNKNOWN'
  | null;

export interface SerialLogEntry {
  id: string;
  timestamp: string;
  direction: 'RX' | 'TX' | 'SYS';
  message: string;
}

/**
 * Robust parser for various ESP32 serial output formats:
 * 1. Ushma-Netra JSON: {"node_id":"ESP32_01","ambient_temp":53.6,"wbgt":36.8,"token":"..."}
 * 2. Generic JSON: {"temp":53.6,"wbgt":36.8} or {"temperature":53.6}
 * 3. Comma-separated floats: 53.6, 36.8
 * 4. Key-Value pairs: TEMP=53.6 WBGT=36.8 or T:53.6 W:36.8
 * 5. Single float reading: 53.6
 */
export function parseSerialLine(line: string): HardwareData | null {
  const clean = line.trim();
  if (!clean) return null;

  // 1. JSON parsing
  if (clean.startsWith('{') && clean.endsWith('}')) {
    try {
      const obj = JSON.parse(clean);
      const tempVal = obj.ambient_temp ?? obj.temp ?? obj.temperature ?? obj.ambient ?? obj.t;
      const wbgtVal = obj.wbgt ?? obj.w;
      const nodeId = String(obj.node_id ?? obj.id ?? obj.sensor_id ?? 'ESP32_S3_COM5');
      const token = String(obj.token ?? 'un_hw_secure_ecc_p256_active');

      const ambient_temp = Number(tempVal);
      if (!Number.isNaN(ambient_temp)) {
        const wbgt = wbgtVal !== undefined && !Number.isNaN(Number(wbgtVal))
          ? Number(wbgtVal)
          : +(ambient_temp * 0.686).toFixed(1);
        return {
          node_id: nodeId,
          ambient_temp: +ambient_temp.toFixed(1),
          wbgt: +wbgt.toFixed(1),
          token,
        };
      }
    } catch {
      // Fall through to regex
    }
  }

  // 2. Comma-separated numbers: "53.6, 36.8" or "53.6,36.8"
  const commaMatches = clean.match(/([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)/);
  if (commaMatches) {
    const temp = parseFloat(commaMatches[1]);
    const wbgt = parseFloat(commaMatches[2]);
    if (!Number.isNaN(temp) && temp > -10 && temp < 90) {
      return {
        node_id: 'ESP32_S3_COM5',
        ambient_temp: +temp.toFixed(1),
        wbgt: !Number.isNaN(wbgt) ? +wbgt.toFixed(1) : +(temp * 0.686).toFixed(1),
        token: 'un_hw_secure_ecc_p256_active',
      };
    }
  }

  // 3. Key-Value pairs: "TEMP=53.6 WBGT=36.8" or "T: 53.6 W: 36.8"
  const tempMatch = clean.match(/(?:temp|ambient|temperature|t)[:=\s]+([-+]?[0-9]*\.?[0-9]+)/i);
  const wbgtMatch = clean.match(/(?:wbgt|w)[:=\s]+([-+]?[0-9]*\.?[0-9]+)/i);
  if (tempMatch) {
    const temp = parseFloat(tempMatch[1]);
    if (!Number.isNaN(temp) && temp > -10 && temp < 90) {
      const wbgt = wbgtMatch ? parseFloat(wbgtMatch[1]) : +(temp * 0.686).toFixed(1);
      return {
        node_id: 'ESP32_S3_COM5',
        ambient_temp: +temp.toFixed(1),
        wbgt: +wbgt.toFixed(1),
        token: 'un_hw_secure_ecc_p256_active',
      };
    }
  }

  // 4. Single float number reading (e.g., "53.6")
  const singleFloat = clean.match(/^[-+]?[0-9]*\.?[0-9]+$/);
  if (singleFloat) {
    const temp = parseFloat(singleFloat[0]);
    if (temp > 10 && temp < 85) {
      return {
        node_id: 'ESP32_S3_COM5',
        ambient_temp: +temp.toFixed(1),
        wbgt: +(temp * 0.686).toFixed(1),
        token: 'un_hw_secure_ecc_p256_active',
      };
    }
  }

  return null;
}

interface SerialPortLike {
  open: (options: { baudRate: number }) => Promise<void>;
  close?: () => Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable?: WritableStream<Uint8Array> | null;
}

export const useHardwareSerial = (onDataReceived: (data: HardwareData) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isVirtual, setIsVirtual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<HardwareErrorType>(null);
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [logs, setLogs] = useState<SerialLogEntry[]>([]);

  const fallbackTimerRef = useRef<number | null>(null);
  const activePortRef = useRef<SerialPortLike | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);

  const addLog = useCallback((direction: 'RX' | 'TX' | 'SYS', message: string) => {
    const entry: SerialLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 2 }),
      direction,
      message,
    };
    setLogs((prev) => [entry, ...prev.slice(0, 99)]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) {
        window.clearInterval(fallbackTimerRef.current);
      }
      if (readerRef.current) {
        readerRef.current.cancel().catch(() => {});
      }
      if (activePortRef.current?.close) {
        activePortRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Virtual ESP32 Bridge fallback streamer
  const connectVirtualBridge = useCallback(() => {
    if (fallbackTimerRef.current) {
      window.clearInterval(fallbackTimerRef.current);
    }

    setIsVirtual(true);
    setIsConnected(true);
    setError(null);
    setErrorType(null);

    addLog('SYS', 'Virtual ESP32-S3 Bridge activated (115200 bps COM5 Emulation)');
    addLog('RX', '{"node_id":"ESP32_S3_COM5","ambient_temp":53.6,"wbgt":36.8,"token":"un_hw_secure_ecc_p256_active"}');

    // Immediate initial payload
    onDataReceived({
      node_id: 'ESP32_S3_COM5',
      ambient_temp: 53.6,
      wbgt: 36.8,
      token: 'un_hw_secure_ecc_p256_active',
    });

    // Realistic micro-fluctuation continuous telemetry loop
    fallbackTimerRef.current = window.setInterval(() => {
      const jitter = +((Math.random() - 0.5) * 0.6).toFixed(1);
      const nextTemp = +(53.6 + jitter).toFixed(1);
      const nextWbgt = +(36.8 + jitter * 0.45).toFixed(1);

      addLog('RX', `{"node_id":"ESP32_S3_COM5","ambient_temp":${nextTemp},"wbgt":${nextWbgt},"token":"active"}`);

      onDataReceived({
        node_id: 'ESP32_S3_COM5',
        ambient_temp: nextTemp,
        wbgt: nextWbgt,
        token: 'un_hw_secure_ecc_p256_active',
      });
    }, 3500);
  }, [addLog, onDataReceived]);

  // Attempt real physical Web Serial connection
  const connectHardware = async () => {
    // Clean up previous virtual timer if any
    if (fallbackTimerRef.current) {
      window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    addLog('SYS', `Requesting Web Serial port access (${baudRate} Baud)...`);

    // Check 1: Web Serial API presence in browser
    if (!('serial' in navigator)) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
      const browserName = isSafari ? 'Safari' : isFirefox ? 'Firefox' : 'this browser';

      const msg = `Web Serial API is not supported in ${browserName}. Chromium browsers (Google Chrome, Microsoft Edge, Brave, Opera) support physical USB connections.`;
      addLog('SYS', `Error: ${msg}`);
      setError(msg);
      setErrorType('UNSUPPORTED_BROWSER');
      setIsConnected(false);
      return;
    }

    try {
      const serialApi = (navigator as unknown as {
        serial: {
          requestPort: (options?: unknown) => Promise<SerialPortLike>;
          getPorts?: () => Promise<SerialPortLike[]>;
        };
      }).serial;

      let port: SerialPortLike;
      try {
        port = await serialApi.requestPort();
      } catch (reqErr: unknown) {
        const errObj = reqErr as Error;
        const errMsg = errObj?.message || '';
        const errName = errObj?.name || '';

        // Check if disallowed by iframe permissions policy
        if (
          errName === 'SecurityError' ||
          errMsg.toLowerCase().includes('permissions policy') ||
          errMsg.toLowerCase().includes('disallowed') ||
          errMsg.toLowerCase().includes('iframe')
        ) {
          const iframeMsg =
            'USB Serial access is blocked inside this preview frame. Open this app directly in a full browser tab for direct USB port access, or switch to the Virtual ESP32 Bridge.';
          addLog('SYS', `Security Error: ${iframeMsg}`);
          setError(iframeMsg);
          setErrorType('IFRAME_BLOCKED');
          setIsConnected(false);
          return;
        }

        // Check if user cancelled or no device was visible
        if (errName === 'NotFoundError' || errMsg.toLowerCase().includes('no port selected')) {
          const cancelMsg =
            'No serial port was selected. If your ESP32 did not appear in the device list: 1) Ensure you are using a USB DATA cable (not a charge-only cable), 2) Check if CP2102/CH340 drivers are installed.';
          addLog('SYS', `Notice: ${cancelMsg}`);
          setError(cancelMsg);
          setErrorType('PORT_NOT_FOUND');
          setIsConnected(false);
          return;
        }

        throw reqErr;
      }

      activePortRef.current = port;
      addLog('SYS', `Port acquired. Opening at ${baudRate} 8N1...`);

      try {
        await port.open({ baudRate });
      } catch (openErr: unknown) {
        const openErrObj = openErr as Error;
        const msg = openErrObj?.message || '';

        if (msg.toLowerCase().includes('already open') || msg.toLowerCase().includes('busy') || openErrObj?.name === 'NetworkError') {
          const busyMsg =
            'Serial port is busy or already in use. Please close the Arduino IDE Serial Monitor, PlatformIO, PuTTY, or other terminal apps using this COM port.';
          addLog('SYS', `Port Busy: ${busyMsg}`);
          setError(busyMsg);
          setErrorType('PORT_BUSY');
          setIsConnected(false);
          return;
        }

        // If port opening had another non-fatal issue, log it
        addLog('SYS', `Port open warning: ${msg}`);
      }

      setIsConnected(true);
      setIsVirtual(false);
      setError(null);
      setErrorType(null);
      addLog('SYS', `Connected successfully to ESP32 over physical USB (${baudRate} Baud)!`);

      // Read from stream
      if (port.readable) {
        const textDecoder = new TextDecoderStream();
        (port.readable as unknown as { pipeTo: (w: unknown) => Promise<void> })
          .pipeTo(textDecoder.writable)
          .catch((pipeErr) => {
            addLog('SYS', `Stream pipe ended: ${pipeErr?.message || 'closed'}`);
          });

        const reader = textDecoder.readable.getReader();
        readerRef.current = reader;
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            addLog('SYS', 'Serial stream finished by device.');
            reader.releaseLock();
            break;
          }

          if (value) {
            buffer += value;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const cleanLine = line.trim();
              if (!cleanLine) continue;

              addLog('RX', cleanLine);

              const parsed = parseSerialLine(cleanLine);
              if (parsed) {
                onDataReceived(parsed);
              }
            }
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      addLog('SYS', `Error: ${message}`);
      setError(message);
      setErrorType('UNKNOWN');
      setIsConnected(false);
    }
  };

  const disconnectHardware = async () => {
    if (fallbackTimerRef.current) {
      window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (readerRef.current) {
      try {
        await readerRef.current.cancel();
      } catch {
        // ignore
      }
      readerRef.current = null;
    }
    if (activePortRef.current?.close) {
      try {
        await activePortRef.current.close();
      } catch {
        // ignore
      }
      activePortRef.current = null;
    }

    addLog('SYS', 'Hardware connection closed.');
    setIsConnected(false);
    setIsVirtual(false);
    setError(null);
    setErrorType(null);
  };

  // One-click live packet injector
  const simulateLivePacket = (overrides?: Partial<HardwareData>) => {
    const defaultData: HardwareData = {
      node_id: 'ESP32_S3_COM5',
      ambient_temp: 53.6,
      wbgt: 36.8,
      token: 'un_hw_secure_ecc_p256_active',
      ...overrides,
    };
    addLog('TX', `Simulated Packet Injection -> ${defaultData.ambient_temp}°C / ${defaultData.wbgt}°C WBGT`);
    onDataReceived(defaultData);
    setIsConnected(true);
    setIsVirtual(true);
    setError(null);
    setErrorType(null);
  };

  return {
    connectHardware,
    disconnectHardware,
    connectVirtualBridge,
    simulateLivePacket,
    isConnected,
    isVirtual,
    error,
    errorType,
    baudRate,
    setBaudRate,
    logs,
    clearLogs,
    addLog,
  };
};
