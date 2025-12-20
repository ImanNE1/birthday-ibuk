'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ConfettiProps {
  isActive: boolean;
}

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'square' | 'circle' | 'heart' | 'star';
}

export default function Confetti({ isActive }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const animationRef = useRef<number | null>(null);

  const colors = ['#D4AF37', '#FFB7C5', '#FF69B4', '#FFD700', '#FF91A4', '#FFC0CB', '#E6E6FA'];

  const createConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pieces: ConfettiPiece[] = [];
    const pieceCount = 150;

    for (let i = 0; i < pieceCount; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 300,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 4 - 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        shape: ['square', 'circle', 'heart', 'star'][Math.floor(Math.random() * 4)] as ConfettiPiece['shape'],
      });
    }

    confettiRef.current = pieces;
  }, []);

  const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.beginPath();
    ctx.moveTo(0, -size / 4);
    ctx.bezierCurveTo(size / 2, -size, size, -size / 4, 0, size / 2);
    ctx.bezierCurveTo(-size, -size / 4, -size / 2, -size, 0, -size / 4);
    ctx.fill();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
    const spikes = 5;
    const outerRadius = size / 2;
    const innerRadius = size / 4;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    if (!isActive) {
      confettiRef.current = [];
      return;
    }

    createConfetti();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiRef.current.forEach((piece) => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;

        switch (piece.shape) {
          case 'square':
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'heart':
            drawHeart(ctx, piece.size);
            break;
          case 'star':
            drawStar(ctx, piece.size);
            break;
        }

        ctx.restore();

        // Update position
        piece.y += piece.speedY;
        piece.x += piece.speedX + Math.sin(piece.y * 0.02) * 0.5;
        piece.rotation += piece.rotationSpeed;
        piece.speedY += 0.05; // Gravity

        // Slow down horizontal movement
        piece.speedX *= 0.99;
      });

      // Remove pieces that are off screen
      confettiRef.current = confettiRef.current.filter(
        (piece) => piece.y < canvas.height + 50
      );

      if (confettiRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, createConfetti]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[200]"
    />
  );
}
