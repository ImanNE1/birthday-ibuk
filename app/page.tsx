'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Particles from './components/Particles';
import Typewriter from './components/Typewriter';
import ProgressIndicator from './components/ProgressIndicator';
import NavigationDots from './components/NavigationDots';
import Confetti from './components/Confetti';
import ShareButton from './components/ShareButton';
import AgeCounter from './components/AgeCounter';
import PhotoGallery from './components/PhotoGallery';
import MusicPlayer from './components/MusicPlayer';

gsap.registerPlugin(ScrollTrigger);

export default function DeepMeaningPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [titleComplete, setTitleComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const motherBirthDate = new Date(1974, 11, 24);

  const galleryPhotos = [
    { src: '/photo1.jpeg', alt: 'Kenangan 1' },
    { src: '/photo2.jpeg', alt: 'Kenangan 2' },
    { src: '/photo3.jpeg', alt: 'Kenangan 3' },
    { src: '/photo4.jpeg', alt: 'Kenangan 4' },
    { src: '/photo5.jpeg', alt: 'Kenangan 5' },
    { src: '/photo7.jpeg', alt: 'Kenangan 7' },
    { src: '/photo8.jpeg', alt: 'Kenangan 8' },
    { src: '/photo9.jpeg', alt: 'Kenangan 9' },
    { src: '/photo10.jpeg', alt: 'Kenangan 10' },
    { src: '/photo11.jpeg', alt: 'Kenangan 11'  },
    { src: '/photo12.jpeg', alt: 'Kenangan 12'  },
    { src: '/photo13.jpeg', alt: 'Kenangan 13'  },
    { src: '/photo14.jpeg', alt: 'Kenangan 14'  },
    { src: '/photo15.jpeg', alt: 'Kenangan 15' },
  ];

  const startExperience = () => {
    setIsStarted(true);
    setTimeout(() => {
      const chapter1 = document.getElementById('chapter1');
      if (chapter1) {
        chapter1.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  };

  // Trigger confetti 
  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    const lenis = new Lenis({ duration: 2.0, smoothWheel: true });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // AUTO SCROLL
    const sections = document.querySelectorAll('.story-chapter');
    let currentSection = 0;
    const autoScrollDuration = 12000;

    const autoScrollInterval = setInterval(() => {
      if (currentSection < sections.length) {
        const targetSection = sections[currentSection] as HTMLElement;
        lenis.scrollTo(targetSection, {
          duration: 2.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        currentSection++;
        
        // Trigger confetti saat mencapai section terakhir
        if (currentSection === sections.length) {
          setTimeout(triggerConfetti, 10000);
        }
      } else {
        clearInterval(autoScrollInterval);
      }
    }, autoScrollDuration);

    const handleUserScroll = () => {
      clearInterval(autoScrollInterval);
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchstart', handleUserScroll);
    };
    window.addEventListener('wheel', handleUserScroll);
    window.addEventListener('touchstart', handleUserScroll);

    const ctx = gsap.context(() => {
      
      // 1. INTRO FADE OUT
      gsap.to('.intro-overlay', {
        opacity: 0,
        pointerEvents: 'none',
        duration: 2,
        ease: 'power2.inOut'
      });

      // 2. THE GOLDEN THREAD
      gsap.fromTo('.golden-path', 
        { strokeDasharray: 2000, strokeDashoffset: 2000 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.story-container',
            start: 'top center',
            end: 'bottom bottom',
            scrub: 1,
          }
        }
      );

      // CHAPTER TEXT ANIMATIONS
      const sectionElements = gsap.utils.toArray<HTMLElement>('.story-chapter');
      
      sectionElements.forEach((section) => {
        gsap.from(section.querySelector('.chapter-text'), {
          opacity: 0,
          y: 50,
          duration: 1.5,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'top 30%',
            scrub: true
          }
        });
      });

      // 4. PHOTO REVEAL 
      gsap.utils.toArray<HTMLElement>('.memory-img').forEach((img) => {
        gsap.to(img, {
          filter: 'grayscale(0%)',
          scale: 1.05,
          scrollTrigger: {
            trigger: img,
            start: 'top 70%',
            end: 'bottom center',
            scrub: 2
          }
        });
      });

      // 5. PARALLAX EFFECT
      gsap.utils.toArray<HTMLElement>('.parallax-container').forEach((container) => {
        const img = container.querySelector('.parallax-img');
        if (img) {
          gsap.to(img, {
            y: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      });

      // 6. TRIGGER CONFETTI AT END
      ScrollTrigger.create({
        trigger: '.final-section',
        start: 'top center',
        onEnter: () => triggerConfetti(),
        once: true
      });

    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchstart', handleUserScroll);
    };
  }, [isStarted, triggerConfetti]);

  return (
    <main ref={containerRef} className="bg-[#0a0a0a] text-[#e0e0e0] min-h-screen relative overflow-hidden font-serif selection:bg-gold-500 selection:text-black">
      
      {/* KOMPONEN GLOBAL */}
      {isStarted && <Particles />}
      {isStarted && <ProgressIndicator />}
      {isStarted && <NavigationDots totalSections={3} sectionIds={['chapter1', 'chapter2', 'chapter3']} />}
      {/* {isStarted && <ShareButton />} */}
      {isStarted && <MusicPlayer autoPlay={true} />}
      <Confetti isActive={showConfetti} />

      {/* --- OPENING SCREEN (Cinematic Start) --- */}
      <div className={`intro-overlay fixed inset-0 z-50 bg-black flex flex-col items-center justify-center transition-opacity duration-1000 px-6 ${isStarted ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="text-center">
          <p className="text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.5em] text-[#D4AF37] mb-4">✨ UNTUK IBU TERHEBAT ✨</p>
          <h1 className="text-xl sm:text-2xl md:text-4xl tracking-[0.2em] sm:tracking-[0.3em] mb-4 font-light text-gray-400">SEBUAH PERSEMBAHAN</h1>
          <p className="text-gray-500 mb-6 sm:mb-8 text-xs sm:text-sm">Siapkan hati ibuk untuk sebuah perjalanan...</p>
        </div>
        
        {/* Heart Icon */}
        {/* <div className="mb-6 sm:mb-8">
          <svg width="50" height="50" viewBox="0 0 24 24" className="text-[#D4AF37] sm:w-[60px] sm:h-[60px]">
            <defs>
              <linearGradient id="heartGradientIntro" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#FF69B4" />
              </linearGradient>
            </defs>
            <path
              fill="url(#heartGradientIntro)"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </div> */}

        <button 
          onClick={startExperience}
          className="group px-8 sm:px-10 py-3 sm:py-4 border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black active:bg-[#D4AF37] active:text-black transition-all duration-500 tracking-widest text-xs uppercase rounded-full relative overflow-hidden"
        >
          <span className="relative z-10">Mulai Perjalanan</span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
      </div>


      {/* --- Hidden on mobile --- */}
      <div className="hidden md:block absolute md:left-1/2 top-0 bottom-0 w-[2px] z-0 h-full">
         <svg className="h-full w-[100px] overflow-visible" preserveAspectRatio="none">
           <path 
             className="golden-path stroke-[#D4AF37]" 
             d="M 0 0 V 5000"
             strokeWidth="2" 
             fill="none" 
           />
         </svg>
      </div>


      {/* --- CONTENT CONTAINER --- */}
      <div className="story-container relative z-10 pt-[20vh] sm:pt-[50vh] pb-[20vh] sm:pb-[50vh]">

        {/* CHAPTER 1 */}
        <section id="chapter1" className="story-chapter min-h-screen flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 px-4 sm:px-6 md:px-20 py-10 md:py-0 relative">
          <div className="w-full md:w-1/2 text-center md:text-right pr-0 md:pr-10 order-2 md:order-1">
             <div className="chapter-text">
               <span className="text-gold-500 text-xs sm:text-sm tracking-widest block mb-3 sm:mb-4">BAB I — AWAL KISAH</span>
               <h2 className="text-3xl sm:text-4xl md:text-6xl mb-4 sm:mb-6 gradient-text">
                 {isStarted && !titleComplete ? (
                   <Typewriter 
                     text="Sebelum Aku Ada" 
                     speed={80} 
                     delay={2000}
                     onComplete={() => setTitleComplete(true)}
                   />
                 ) : (
                   'Sebelum Aku Ada'
                 )}
               </h2>
               <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-sans font-light">
                 Dulu, Ibu adalah gadis dengan sejuta mimpi. Sebelum tangannya menjadi kasar karena telah merawatku, sebelum rambutnya memutih karena memikirkanku, sebelum senyumnya pudar karena lelah, dia adalah pahlawan tanpa tanda jasa, yang selalu ada untukku.
               </p>
             </div>
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-10 border-l-0 md:border-l border-white/10 order-1 md:order-2">
             <div className="parallax-container relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl glass max-w-[400px] sm:max-w-[380px] md:max-w-[420px] mx-auto">
                <Image 
                  src="/photo.jpeg" 
                  alt="Ibu masa muda" 
                  fill 
                  className="memory-img parallax-img object-cover grayscale brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
             </div>
          </div>
        </section>


        {/* CHAPTER 2 */}
        <section id="chapter2" className="story-chapter min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-10 px-4 sm:px-6 md:px-20 py-10 md:py-0 relative">
          <div className="w-full max-w-4xl text-center">
             <div className="chapter-text">
               <span className="text-gold-500 text-xs sm:text-sm tracking-widest block mb-3 sm:mb-4">BAB II — KENANGAN BERSAMA</span>
               <h2 className="text-3xl sm:text-4xl md:text-6xl mb-4 sm:mb-6 gradient-text">Momen Indah Kita</h2>
               <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-sans font-light max-w-2xl mx-auto">
                 Setiap foto menyimpan sejuta cerita, setiap momen adalah harta yang tak ternilai. Terima kasih telah mengisi hidupku dengan kenangan indah yang tak akan pernah kulupakan.
               </p>
               
               {/* Photo Gallery */}
               <div className="mt-6 sm:mt-8 max-w-md sm:max-w-lg mx-auto">
                 <PhotoGallery photos={galleryPhotos} />
               </div>
             </div>
          </div>
        </section>


        {/* CHAPTER 3 */}
        <section id="chapter3" className="story-chapter final-section min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 py-10 md:py-0 relative">
          <div className="w-full max-w-3xl chapter-text glass p-6 sm:p-10 rounded-2xl sm:rounded-3xl relative mx-4">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-10 sm:w-16 h-10 sm:h-16 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-2xl sm:rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-10 sm:w-16 h-10 sm:h-16 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-2xl sm:rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-10 sm:w-16 h-10 sm:h-16 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-2xl sm:rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-10 sm:w-16 h-10 sm:h-16 border-b-2 border-r-2 border-[#D4AF37] rounded-br-2xl sm:rounded-br-3xl" />
            
            <span className="text-gold-500 text-xs sm:text-sm tracking-widest block mb-4 sm:mb-6">BAB III — KEABADIAN</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl mb-6 sm:mb-8 italic text-shimmer">Selamat Ulang Tahun, Ibuk</h2>
            <p className="text-base sm:text-xl text-gray-300 leading-relaxed font-sans font-light mb-6 sm:mb-10">
              Ulang tahun ini hanyalah penanda waktu. Tapi cintamu menembus batas waktu. Semoga sisa usiamu dipenuhi kedamaian, sebagaimana Ibu memberikan kedamaian di hatiku.
            </p>
            
            {/* Age Counter */}
            <div className="my-8 sm:my-12 py-6 sm:py-8 border-t border-b border-white/10">
              <AgeCounter birthDate={motherBirthDate} />
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-6 sm:mt-10">
              <p className="text-xs tracking-[0.3em] sm:tracking-[0.5em] text-gold-500 uppercase">Aku Mencintaimu Selamanya</p>
            </div>
          </div>
          
          {/* Background Image Samar */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <Image 
               src="/photo5.jpeg" 
               alt="Background Blur" 
               fill 
               className="object-cover blur-md"
            />
          </div>
        </section>

      </div>

      {/* --- FOOTER --- */}
      <footer className="py-10 text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <span className="text-[#D4AF37]">✨</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>
        <p className="text-white/20 text-xs tracking-widest">DIBUAT DENGAN HATI</p>
        <p className="text-white/10 text-xs mt-2">Untuk Ibu Tercinta • {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}