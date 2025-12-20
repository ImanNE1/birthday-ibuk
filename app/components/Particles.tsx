'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles (flower petals)
    const particles: Particle[] = [];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 15 + 8,
        speedY: Math.random() * 1 + 0.5,
        speedX: Math.random() * 2 - 1,
        opacity: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
      });
    }

    // Draw petal shape
    const drawPetal = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      // Gradient for petal
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      gradient.addColorStop(0, '#FFB7C5'); // Pink sakura
      gradient.addColorStop(0.5, '#FF91A4');
      gradient.addColorStop(1, '#FF69B4');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      // Petal shape
      ctx.moveTo(0, -p.size / 2);
      ctx.bezierCurveTo(
        p.size / 2, -p.size / 2,
        p.size / 2, p.size / 2,
        0, p.size
      );
      ctx.bezierCurveTo(
        -p.size / 2, p.size / 2,
        -p.size / 2, -p.size / 2,
        0, -p.size / 2
      );
      
      ctx.fill();
      ctx.restore();
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        drawPetal(p);

        // Update position
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
        p.rotation += p.rotationSpeed;

        // Reset particle when it goes off screen
        if (p.y > canvas.height + p.size) {
          p.y = -p.size;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + p.size) {
          p.x = -p.size;
        }
        if (p.x < -p.size) {
          p.x = canvas.width + p.size;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
