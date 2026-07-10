import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react';

/* ---------- Scroll reveal wrapper ---------- */
interface RevealProps { children: React.ReactNode; delay?: number; y?: number; className?: string; }
export function Reveal({ children, delay = 0, y = 24, className = '' }: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Section eyebrow + heading ---------- */
export function SectionHeading({ eyebrow, title, subtitle, id, align = 'center' }: {
  eyebrow: string; title: React.ReactNode; subtitle?: string; id?: string; align?: 'center' | 'left';
}) {
  return (
    <div id={id} className={`mx-auto mb-14 max-w-3xl ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <Reveal>
        <div className={`mb-4 inline-flex items-center gap-2 rounded-full border border-accent bg-[rgb(var(--accent-1)/0.08)] px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent ${align === 'center' ? 'mx-auto' : ''}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-[var(--text)] md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Animated count-up number ---------- */
export function CountUp({ to, duration = 2, suffix = '', prefix = '' }: {
  to: number; duration?: number; suffix?: string; prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVal(to); return; }
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  const fmt = val >= 1000 ? val.toLocaleString() : String(val);
  return <span ref={ref}>{prefix}{fmt}{suffix}</span>;
}

/* ---------- Magnetic 3D tilt card ---------- */
export function TiltCard({ children, className = '', intensity = 8 }: {
  children: React.ReactNode; className?: string; intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`tilt-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Desktop cursor glow ---------- */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current; if (!el) return;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
      cx += (x - cx) * 0.15; cy += (y - cy) * 0.15;
      el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="cursor-glow no-print hidden md:block" aria-hidden="true" />;
}
