'use client';

import { useState, useRef, useEffect } from 'react';

interface MusicPlayerProps {
  autoPlay?: boolean;
}

export default function MusicPlayer({ autoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log("Audio autoplay blocked:", e));
    }
  }, [autoPlay, volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log("Audio play blocked:", e));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      {/* Audio Element - Elegant instrumental music */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
      >
        {/* 
          CATATAN: Ganti URL di bawah dengan file musik Anda sendiri!
          
          Opsi untuk mendapatkan musik Happy Birthday yang elegant:
          1. Download dari: https://pixabay.com/music/search/happy%20birthday/
          2. Atau dari: https://www.bensound.com/
          3. Simpan file ke folder /public sebagai music.mp3
          4. Ubah src menjadi "/music.mp3"
          
          Contoh musik gratis yang bisa didownload:
          - Pixabay: "Happy Birthday" instrumental piano
          - Bensound: Birthday celebration music
        */}
        <source src="/music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Floating Music Control */}
      <div 
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center gap-2"
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
      >
        {/* Volume Slider */}
        <div className={`flex items-center bg-black/80 backdrop-blur-sm rounded-full px-3 py-2 transition-all duration-300 ${showVolume ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
          <svg className="w-4 h-4 text-white/60 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
          />
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#D4AF37]/80 to-pink-500/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? (
            // Pause Icon with animation
            <div className="flex items-center justify-center gap-1">
              <span className="w-1 h-4 sm:h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 sm:h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-4 sm:h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            // Play Icon
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Music Note Animation when playing */}
        {isPlaying && (
          <div className="absolute -top-2 left-1/2 pointer-events-none">
            <span className="text-lg animate-bounce text-[#D4AF37]">♪</span>
          </div>
        )}
      </div>

      {/* Subtle hint text */}
      {!isPlaying && (
        <div className="fixed bottom-20 left-4 sm:bottom-24 sm:left-6 z-40 text-xs text-white/40 animate-pulse">
          Klik untuk musik 🎵
        </div>
      )}
    </>
  );
}
