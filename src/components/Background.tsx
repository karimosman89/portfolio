import React, { useRef, useEffect } from 'react';

/**
 * Neural network particle field rendered on canvas.
 * Floating nodes connected by fading edges + subtle drift = "AI-native" ambiance.
 * Respects prefers-reduced-motion.
 */
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const accent = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--accent-1').trim();
      return v || '99 102 241';
    };

    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor((w * h) / 22000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const a = accent();
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      // edges
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(${a} / ${0.12 * (1 - dist / 130)})`.replace('rgba(', 'rgba(').replace(' / ', ',');
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      // nodes
      for (const p of pts) {
        ctx.fillStyle = `rgba(${a.split(' ').join(',')},0.55)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/** Global animated background layer used behind the whole app. */
export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* base tint */}
      <div className="absolute inset-0 bg-[var(--bg)]" />

      {/* grid */}
      <div className="absolute inset-0 bg-grid bg-grid-mask opacity-70" />

      {/* aurora blobs */}
      <div className="aurora-blob animate-aurora-1 -top-40 -left-32 h-[46rem] w-[46rem]"
           style={{ background: 'radial-gradient(circle, rgb(var(--glow-1)/0.55), transparent 65%)' }} />
      <div className="aurora-blob animate-aurora-2 top-1/3 -right-40 h-[42rem] w-[42rem]"
           style={{ background: 'radial-gradient(circle, rgb(var(--glow-2)/0.5), transparent 65%)' }} />
      <div className="aurora-blob animate-aurora-1 bottom-0 left-1/3 h-[40rem] w-[40rem]"
           style={{ background: 'radial-gradient(circle, rgb(var(--accent-3)/0.4), transparent 65%)', animationDelay: '-8s' }} />

      {/* neural particle field */}
      <div className="absolute inset-0 opacity-70">
        <NeuralCanvas />
      </div>

      {/* film grain */}
      <div className="noise-overlay absolute inset-0" />

      {/* vignette for depth */}
      <div className="absolute inset-0"
           style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, rgb(var(--accent-1)/0.05))' }} />
    </div>
  );
}
