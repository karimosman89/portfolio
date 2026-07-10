import React from 'react';
import { SERVICES, PERSONAL_INFO } from '../data';
import { SectionHeading, Reveal, TiltCard } from './ui';
import { Check, Calendar, ArrowUpRight } from 'lucide-react';
import { DynIcon as Icon } from './iconMap';

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="What I Deliver"
        title={<>Enterprise AI, <span className="text-gradient">end-to-end</span></>}
        subtitle="From strategy to production. I own the full lifecycle — architecture, model tuning, deployment, observability and hand-off — so your AI investment ships and scales."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={(i % 4) * 0.06}>
            <TiltCard className="h-full">
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass p-6 glow-hover gradient-border">
                {s.tag && (
                  <span className="absolute right-4 top-4 rounded-full bg-[rgb(var(--accent-1)/0.15)] px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-accent">
                    {s.tag}
                  </span>
                )}
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-accent text-white shadow-lg" style={{ boxShadow: '0 8px 24px -8px rgb(var(--glow-1)/0.6)' }}>
                  <Icon name={s.icon} />
                </div>
                <h3 className="font-display text-lg font-bold text-[var(--text)]">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-[var(--text-muted)]">{s.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                      <Check size={13} className="mt-0.5 shrink-0 text-accent" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* CTA band */}
      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl glass-strong p-8 md:flex-row md:p-10">
          <div className="mesh-conic pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <h3 className="font-display text-xl font-bold text-[var(--text)] md:text-2xl">Have an AI project in mind?</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Book a free 30-minute discovery call — no obligation, just clarity.</p>
          </div>
          <div className="relative flex gap-3">
            <a href={PERSONAL_INFO.calendly} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold">
              <Calendar size={16} /> Book a Call
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-bold text-[var(--text)] hover:text-accent">
              Get a Quote <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
