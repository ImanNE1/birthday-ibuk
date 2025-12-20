'use client';

import { useEffect, useState, useRef } from 'react';

interface AgeCounterProps {
  birthDate: Date;
  className?: string;
}

export default function AgeCounter({ birthDate, className = '' }: AgeCounterProps) {
  const [age, setAge] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateAge = () => {
      const now = new Date();
      const birth = new Date(birthDate);

      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();
      let hours = now.getHours() - birth.getHours();
      let minutes = now.getMinutes() - birth.getMinutes();
      let seconds = now.getSeconds() - birth.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      setAge({ years, months, days, hours, minutes, seconds });
    };

    calculateAge();
    const interval = setInterval(calculateAge, 1000);

    return () => clearInterval(interval);
  }, [birthDate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const TimeUnit = ({ value, label, delay }: { value: number; label: string; delay: number }) => (
    <div
      className={`flex flex-col items-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative">
        <span className="text-2xl sm:text-4xl md:text-6xl font-bold text-[#D4AF37] font-mono tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
        <div className="absolute -inset-2 bg-[#D4AF37]/10 blur-xl -z-10 rounded-full" />
      </div>
      <span className="text-[10px] sm:text-xs md:text-sm text-gray-400 uppercase tracking-wider sm:tracking-widest mt-1 sm:mt-2">{label}</span>
    </div>
  );

  return (
    <div ref={counterRef} className={`${className}`}>
      <div className="text-center mb-4 sm:mb-8">
        <p className="text-xs sm:text-sm text-gray-500 tracking-wider sm:tracking-widest uppercase mb-2">Ibu Telah Menjaga Ku Selama</p>
      </div>
      
      <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-4 md:gap-8">
        <TimeUnit value={age.years} label="Tahun" delay={0} />
        <TimeUnit value={age.months} label="Bulan" delay={100} />
        <TimeUnit value={age.days} label="Hari" delay={200} />
        <TimeUnit value={age.hours} label="Jam" delay={300} />
        <TimeUnit value={age.minutes} label="Menit" delay={400} />
        <TimeUnit value={age.seconds} label="Detik" delay={500} />
      </div>

      <div className="text-center mt-4 sm:mt-8">
        <p className="text-sm sm:text-lg text-[#D4AF37] italic">...dan masih terus bertambah dengan cinta</p>
      </div>
    </div>
  );
}
