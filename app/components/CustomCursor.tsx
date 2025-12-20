'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Add trail particle
      trailId++;
      setTrail((prev) => [
        ...prev.slice(-8), // Keep last 8 trail particles
        { x: e.clientX, y: e.clientY, id: trailId },
      ]);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handlePointerCheck = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      if (hoveredElement) {
        const computedStyle = window.getComputedStyle(hoveredElement);
        setIsPointer(
          computedStyle.cursor === 'pointer' ||
          hoveredElement.tagName === 'BUTTON' ||
          hoveredElement.tagName === 'A'
        );
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    const pointerInterval = setInterval(handlePointerCheck, 100);

    // Clear old trail particles
    const trailInterval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(pointerInterval);
      clearInterval(trailInterval);
    };
  }, [position.x, position.y]);

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null; // Don't show on mobile
  }

  return (
    <>
      {/* Trail particles */}
      {trail.map((t, index) => (
        <div
          key={t.id}
          className="fixed pointer-events-none z-[9999] transition-opacity duration-300"
          style={{
            left: t.x - 4,
            top: t.y - 4,
            opacity: (index + 1) / trail.length * 0.5,
          }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="#D4AF37">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}

      {/* Main cursor */}
      <div
        className={`fixed pointer-events-none z-[9999] transition-all duration-150 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: position.x - (isPointer ? 16 : 12),
          top: position.y - (isPointer ? 16 : 12),
          transform: isPointer ? 'scale(1.5)' : 'scale(1)',
        }}
      >
        <svg
          width={isPointer ? '32' : '24'}
          height={isPointer ? '32' : '24'}
          viewBox="0 0 24 24"
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB7C5" />
              <stop offset="50%" stopColor="#FF69B4" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#heartGradient)"
          />
        </svg>
      </div>

      {/* Outer ring */}
      <div
        className={`fixed pointer-events-none z-[9998] border-2 border-[#D4AF37]/30 rounded-full transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: position.x - 20,
          top: position.y - 20,
          width: 40,
          height: 40,
          transform: isPointer ? 'scale(1.5)' : 'scale(1)',
        }}
      />

      {/* Hide default cursor globally */}
      <style jsx global>{`
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
