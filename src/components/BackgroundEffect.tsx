import React, { useEffect, useRef } from 'react';

export const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for cyber/networking aesthetic
    const particlesCount = Math.min(Math.floor(width / 18), 70);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections (network graph)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p1.alpha})`;
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 8;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 140) * 0.15;
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background High-Tech Abstract Server/Cyber Video Overlay simulation with SVG / HTML5 loops */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Cyber ambient glow Orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[160px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '4s' }} />

      {/* Subtle Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25" />

      {/* Canvas for dynamic particles network */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />

      {/* Vignette & Vignette gradients to preserve high text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/90 via-transparent to-[#030712]/95" />
    </div>
  );
};
