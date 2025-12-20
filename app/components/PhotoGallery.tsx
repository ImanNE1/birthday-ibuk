'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Photo {
  src: string;
  alt: string;
  caption?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
}

export default function PhotoGallery({ photos, className = '' }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (!isAutoPlay || photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, photos.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  if (photos.length === 0) {
    return (
      <div className={`bg-white/5 rounded-2xl p-10 text-center ${className}`}>
        <p className="text-gray-500">Belum ada foto</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`relative ${className}`}
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Image Container */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/20 cursor-pointer group"
          onClick={() => setIsLightboxOpen(true)}
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ${
                index === currentIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
              }`}
            >
              <Image
                src={photo.src || '/placeholder.jpg'}
                alt={photo.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </div>
          ))}

          {/* Caption */}
          {photos[currentIndex]?.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-sm text-center">{photos[currentIndex].caption}</p>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {photos.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-6 bg-[#D4AF37]'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? 'ring-2 ring-[#D4AF37] scale-105'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                <Image
                  src={photo.src || '/placeholder.jpg'}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full h-full max-w-4xl max-h-[80vh] m-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[currentIndex]?.src || '/placeholder.jpg'}
              alt={photos[currentIndex]?.alt || ''}
              fill
              className="object-contain"
            />
          </div>

          {/* Lightbox Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Caption in Lightbox */}
          {photos[currentIndex]?.caption && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-lg">{photos[currentIndex].caption}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
