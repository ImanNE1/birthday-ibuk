'use client';

import { useEffect, useState } from 'react';

export default function FloatingElements() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const elements = [
    { icon: '✨', size: 20, left: '5%', delay: 0 },
    { icon: '💫', size: 16, left: '15%', delay: 2 },
    { icon: '🌸', size: 24, left: '25%', delay: 4 },
    { icon: '✨', size: 18, left: '35%', delay: 1 },
    { icon: '💖', size: 20, left: '45%', delay: 3 },
    { icon: '🌺', size: 22, left: '55%', delay: 5 },
    { icon: '✨', size: 14, left: '65%', delay: 2.5 },
    { icon: '💫', size: 18, left: '75%', delay: 1.5 },
    { icon: '🌸', size: 20, left: '85%', delay: 4.5 },
    { icon: '💖', size: 16, left: '95%', delay: 0.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {elements.map((el, index) => (
        <div
          key={index}
          className="absolute animate-float"
          style={{
            left: el.left,
            fontSize: el.size,
            animationDelay: `${el.delay}s`,
            top: `${Math.random() * 100}%`,
          }}
        >
          {el.icon}
        </div>
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
    </div>
  );
}
