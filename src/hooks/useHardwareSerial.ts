import { useState } from 'react';

export interface HardwareData {
  node_id: string;
  ambient_temp: number;
  wbgt: number;
  token: string;
}

export const useHardwareSerial = (onDataReceived: (data: HardwareData) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectHardware = async () => {
    try {
      if (!('serial' in navigator)) {
        throw new Error('Web Serial API not supported in this browser. Please use Chrome or Edge.');
      }

      // Request access to the ESP32 USB port
      const port = await (navigator as unknown as { serial: { requestPort: () => Promise<SerialPortLike> } }).serial.requestPort();
      await port.open({ baudRate: 115200 });
      setIsConnected(true);
      setError(null);

      const textDecoder = new TextDecoderStream();
      if (port.readable) {
        (port.readable as unknown as { pipeTo: (w: unknown) => Promise<void> })
          .pipeTo(textDecoder.writable)
          .catch(() => {
            // Stream cancelled or closed
          });
      }
      const reader = textDecoder.readable.getReader();

      let buffer = '';

      // Continuous stream execution loop
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        if (value) {
          buffer += value;
          const lines = buffer.split('\n');
          // Preserve the last uncompleted chunk in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine.startsWith('{') && cleanLine.endsWith('}')) {
              try {
                const parsed: HardwareData = JSON.parse(cleanLine);
                onDataReceived(parsed);
              } catch {
                // Ignore half-formed serial telemetry streams safely
              }
            }
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection failed';
      setError(message);
      setIsConnected(false);
    }
  };

  // Optional simulation utility for testing without physical USB hardware connected
  const simulateLivePacket = (overrides?: Partial<HardwareData>) => {
    const defaultData: HardwareData = {
      node_id: 'ESP32_DEV_C3_09',
      ambient_temp: 48.6,
      wbgt: 37.2,
      token: 'un_hw_secure_8f9c1a0e88c03521fd94a8f9c1a0e88c',
      ...overrides,
    };
    onDataReceived(defaultData);
    setIsConnected(true);
  };

  return { connectHardware, simulateLivePacket, isConnected, error };
};

interface SerialPortLike {
  open: (options: { baudRate: number }) => Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
}
