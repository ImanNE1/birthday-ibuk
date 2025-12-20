'use client';

import { useEffect, useState } from 'react';

export default function ProgressIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-[100]">
        <div
          className="h-full bg-gradient-to-r from-pink-500 via-[#D4AF37] to-pink-500 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Side progress indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col items-center gap-2">
        <div className="w-[3px] h-40 bg-white/10 rounded-full overflow-hidden">
          <div
            className="w-full bg-gradient-to-b from-[#D4AF37] to-pink-500 rounded-full transition-all duration-150 ease-out"
            style={{ height: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-[#D4AF37] font-mono">{Math.round(progress)}%</span>
      </div>
    </>
  );
}
