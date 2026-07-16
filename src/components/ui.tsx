import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, type Variants } from 'motion/react';

/* Respect the user's reduced-motion preference across JS-driven animations. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

/* ---------- anime.js-style letter-by-letter reveal ---------- */
/* Words split into characters that rise + rotate in with a springy stagger. */
export function StaggerText({
  text,
  className = '',
  delay = 0,
  stagger = 0.03,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'span' | 'h1' | 'h2' | 'p';
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = usePrefersReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    const R = Tag as any;
    return <R ref={ref} className={className}>{text}</R>;
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child: Variants = {
    hidden: { y: '0.55em', opacity: 0, rotateX: -55 },
    show: {
      y: 0, opacity: 1, rotateX: 0,
      transition: { type: 'spring', damping: 12, stiffness: 220, mass: 0.6 },
    },
  };

  const MTag = motion[Tag as 'span'];
  return (
    <MTag
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      style={{ display: 'inline-block', perspective: 600 }}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }} aria-hidden="true">
          {word.split('').map((ch, ci) => (
            <motion.span key={ci} variants={child} style={{ display: 'inline-block', transformOrigin: 'bottom' }}>
              {ch}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </MTag>
  );
}

/* ---------- anime.js signature: staggered grid radial wave ---------- */
/* A grid of dots that pop in as waves radiating from the centre, then breathe. */
export function StaggerGrid({
  cols = 14,
  rows = 8,
  className = '',
}: { cols?: number; rows?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const cx = (cols - 1) / 2;
  const cy = (rows - 1) / 2;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dist = Math.hypot(c - cx, r - cy);
      cells.push({ key: `${r}-${c}`, delay: dist * 0.06 });
    }
  }
  return (
    <div
      className={`grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '0.55rem' }}
      aria-hidden="true"
    >
      {cells.map((cell) => (
        <span
          key={cell.key}
          className={reduced ? '' : 'stagger-dot'}
          style={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: '9999px',
            background: 'rgb(var(--accent-1) / 0.55)',
            boxShadow: '0 0 8px rgb(var(--glow-1) / 0.5)',
            animationDelay: reduced ? undefined : `${cell.delay}s, ${cell.delay + 0.7}s`,
            opacity: reduced ? 0.4 : undefined,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- anime.js-style technical oscilloscope dial ---------- */
/* Concentric neon arcs + a live animated waveform inside a calibration ring. */
export function OscilloscopeDial({ size = 120, className = '' }: { size?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const r = size / 2;
  const ticks = Array.from({ length: 48 });
  // Build a smooth waveform path
  const pts: string[] = [];
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * (size * 0.7) + size * 0.15;
    const y = r + Math.sin(i * 0.7) * (size * 0.12) * Math.sin(i * 0.2 + 1);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} role="img" aria-label="Signal dial">
      <defs>
        <linearGradient id="oscArc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--accent-3))" />
          <stop offset="50%" stopColor="rgb(var(--accent-1))" />
          <stop offset="100%" stopColor="rgb(var(--accent-2))" />
        </linearGradient>
      </defs>
      {/* outer glowing arc ring */}
      <g className={reduced ? '' : 'animate-ring'} style={{ transformOrigin: 'center' }}>
        <circle cx={r} cy={r} r={r - 4} fill="none" stroke="url(#oscArc)" strokeWidth="2"
          strokeDasharray={`${(size * 2)} ${size}`} strokeLinecap="round" opacity="0.9" />
      </g>
      {/* calibration ticks */}
      {ticks.map((_, i) => {
        const a = (i / ticks.length) * Math.PI * 2;
        const inner = r - 12, outer = r - 8;
        return (
          <line key={i}
            x1={r + Math.cos(a) * inner} y1={r + Math.sin(a) * inner}
            x2={r + Math.cos(a) * outer} y2={r + Math.sin(a) * outer}
            stroke="rgb(var(--accent-1)/0.4)" strokeWidth="1" />
        );
      })}
      {/* inner disc */}
      <circle cx={r} cy={r} r={r - 18} fill="rgb(var(--surface)/0.6)" stroke="rgb(var(--accent-1)/0.2)" />
      {/* live waveform */}
      <polyline points={pts.join(' ')} fill="none" stroke="rgb(var(--accent-1))" strokeWidth="1.6"
        strokeLinecap="round" className={reduced ? '' : 'draw-line'} style={{ ['--dash' as any]: 400 }} />
      <circle cx={r} cy={r} r="2.5" fill="rgb(var(--accent-2))" />
    </svg>
  );
}

/* ---------- Magnetic button (springy pull toward cursor) ---------- */
export function MagneticButton({
  children,
  className = '',
  href,
  strength = 0.4,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  strength?: number;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };

  const Comp: any = href ? 'a' : 'button';
  return (
    <Comp
      ref={ref as any}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`magnetic ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}

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
      transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 0.7, delay }}
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
        <div className={`dot-label mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
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
