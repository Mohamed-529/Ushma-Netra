import React, { useEffect, useRef, useState } from 'react';

export const CustomFloatingCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState<boolean>(false);

  useEffect(() => {
    // Skip custom cursor on touch-only devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { x: mouse.x, y: mouse.y };
    const ringPos = { x: mouse.x, y: mouse.y };
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!isVisible) {
        dotPos.x = mouse.x;
        dotPos.y = mouse.y;
        ringPos.x = mouse.x;
        ringPos.y = mouse.y;
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('a, button, [role="button"], input, select, textarea');
      setIsHoveringInteractive(Boolean(interactive));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const animateCursor = () => {
      // Fast response for inner dot, smooth spring-like lag for outer ring
      dotPos.x += (mouse.x - dotPos.x) * 0.35;
      dotPos.y += (mouse.y - dotPos.y) * 0.35;

      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        const scale = isHoveringInteractive ? 1.45 : 1;
        ringRef.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      rafId = requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible, isHoveringInteractive]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Outer Floating Ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full border transition-[border-color,background-color] duration-200 will-change-transform ${
          isHoveringInteractive
            ? 'border-[#a8321a] bg-[#a8321a]/10'
            : 'border-[#0b1b2d]/45 bg-[#0b1b2d]/[0.03]'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed top-0 left-0 w-2 h-2 rounded-full transition-colors duration-200 will-change-transform ${
          isHoveringInteractive ? 'bg-[#a8321a]' : 'bg-[#0b1b2d]'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </div>
  );
};
