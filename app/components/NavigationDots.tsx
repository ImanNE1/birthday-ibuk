'use client';

import { useEffect, useState } from 'react';

interface NavigationDotsProps {
  totalSections: number;
  sectionIds: string[];
}

export default function NavigationDots({ totalSections, sectionIds }: NavigationDotsProps) {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.story-chapter');
      let current = 0;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          current = index;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll('.story-chapter');
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const labels = ['Awal Mula', 'Kenangan Bersama', 'Keabadian'];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col items-start gap-6">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => scrollToSection(index)}
          className="group flex items-center gap-3 transition-all duration-300"
        >
          {/* Dot */}
          <div
            className={`relative w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              activeSection === index
                ? 'border-[#D4AF37] bg-[#D4AF37] scale-125'
                : 'border-white/30 bg-transparent hover:border-white/60'
            }`}
          >
            {/* Pulse effect for active */}
            {activeSection === index && (
              <div className="absolute inset-0 rounded-full bg-[#D4AF37] animate-ping opacity-50" />
            )}
          </div>

          {/* Label */}
          <span
            className={`text-xs tracking-wider uppercase transition-all duration-300 ${
              activeSection === index
                ? 'text-[#D4AF37] opacity-100 translate-x-0'
                : 'text-white/50 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
            }`}
          >
            {labels[index] || `Bab ${index + 1}`}
          </span>
        </button>
      ))}
    </div>
  );
}
