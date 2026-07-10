import React from 'react';
import { SKILL_CATEGORIES, TECH_RADAR } from '../data';
import { SectionHeading, Reveal } from './ui';
import { motion, useInView } from 'motion/react';
import { DynIcon as Icon } from './iconMap';

interface SkillBarProps { name: string; level: number; delay: number }
function SkillBar({ name, level, delay }: SkillBarProps) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text)]">{name}</span>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">{level}%</span>
      </div>
      <div className="skill-bar-track h-1.5 w-full overflow-hidden rounded-full">
        <motion.div
          className="skill-bar-fill h-full rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

/* Radar visualization */
function TechRadar() {
  const rings = [
    { name: 'Adopt', r: 55, ring: 'adopt' },
    { name: 'Trial', r: 95, ring: 'trial' },
    { name: 'Assess', r: 135, ring: 'assess' },
  ];
  const cx = 160, cy = 160;
  const items = TECH_RADAR.map((t, i) => {
    const ringR = rings.find((r) => r.ring === t.ring)?.r ?? 90;
    const angle = (i / TECH_RADAR.length) * Math.PI * 2;
    const jitter = (i % 2 === 0 ? -18 : 12);
    const rr = ringR + jitter;
    return { ...t, x: cx + Math.cos(angle) * rr, y: cy + Math.sin(angle) * rr };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 320 320" className="w-full max-w-sm" role="img" aria-label="Technology radar">
        {rings.map((r) => (
          <circle key={r.name} cx={cx} cy={cy} r={r.r} fill="none" stroke="rgb(var(--border)/0.12)" strokeWidth="1" className="dark:opacity-30" />
        ))}
        {/* sweep */}
        <g className="radar-sweep" style={{ transformOrigin: '160px 160px' }}>
          <path d={`M ${cx} ${cy} L ${cx + 135} ${cy} A 135 135 0 0 1 ${cx + 95} ${cy + 95} Z`} fill="rgb(var(--accent-1)/0.08)" />
        </g>
        {rings.map((r) => (
          <text key={r.name} x={cx} y={cy - r.r + 12} textAnchor="middle" className="fill-[var(--text-muted)]" style={{ fontSize: 8, fontFamily: 'JetBrains Mono' }}>{r.name}</text>
        ))}
        {items.map((it) => (
          <g key={it.name}>
            <circle cx={it.x} cy={it.y} r="4" fill="rgb(var(--accent-1))" />
            <text x={it.x + 7} y={it.y + 3} className="fill-[var(--text)]" style={{ fontSize: 8, fontFamily: 'JetBrains Mono' }}>{it.name}</text>
          </g>
        ))}
      </svg>
      <div className="mt-3 flex gap-4 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
        <span>◉ Adopt</span><span>◎ Trial</span><span>○ Assess</span>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Technical Arsenal"
        title={<>The <span className="text-gradient">full AI stack</span></>}
        subtitle="Deep expertise across the modern AI toolchain — from model internals to cloud-scale deployment."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* skill categories */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {SKILL_CATEGORIES.map((cat, ci) => (
            <Reveal key={cat.title} delay={(ci % 2) * 0.05}>
              <div className="h-full rounded-2xl glass p-6 glow-hover">
                <div className="mb-5 flex items-center gap-2.5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(var(--accent-1)/0.12)] text-accent">
                    <Icon name={cat.icon || 'Sparkles'} />
                  </span>
                  <h3 className="font-display text-sm font-bold text-[var(--text)]">{cat.title}</h3>
                </div>
                <div className="space-y-3">
                  {cat.skills.map((s, si) => (
                    <SkillBar key={s.name} name={s.name} level={s.level} delay={si * 0.06} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* radar */}
        <Reveal delay={0.1}>
          <div className="sticky top-24 rounded-2xl glass p-6">
            <h3 className="mb-4 text-center font-display text-sm font-bold text-[var(--text)]">Technology Radar</h3>
            <TechRadar />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
