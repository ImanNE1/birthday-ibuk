'use client';

import { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export default function Typewriter({
  text,
  speed = 50,
  delay = 0,
  className = '',
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
      // Keep cursor blinking for a while then hide
      const hideCursor = setTimeout(() => {
        setShowCursor(false);
      }, 2000);
      return () => clearTimeout(hideCursor);
    }
  }, [displayedText, isStarted, text, speed, onComplete]);

  // Blinking cursor effect
  const [cursorVisible, setCursorVisible] = useState(true);
  useEffect(() => {
    if (!showCursor) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, [showCursor]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span
          className={`inline-block w-[2px] h-[1em] bg-[#D4AF37] ml-1 align-middle transition-opacity ${
            cursorVisible ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </span>
  );
}
