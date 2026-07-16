import React, { useState, useEffect } from 'react';
import { TESTIMONIALS } from '../data';
import { SectionHeading, Reveal } from './ui';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const n = TESTIMONIALS.length;

  const go = (d: number) => { setDir(d); setIdx((p) => (p + d + n) % n); };

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => { setDir(1); setIdx((p) => (p + 1) % n); }, 6000);
    return () => clearInterval(t);
  }, [n]);

  const t = TESTIMONIALS[idx];

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Client Voices"
        title={<>Trusted by <span className="text-gradient">teams that ship</span></>}
        subtitle="Outcomes over output. Here's what partners say about working with me."
      />

      <div className="relative">
        <div className="relative min-h-[280px] overflow-hidden rounded-3xl glass-strong p-8 md:p-12">
          <div className="mesh-conic pointer-events-none absolute inset-0 opacity-30" />
          <Quote className="relative mb-6 text-accent opacity-60" size={40} />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={t.id}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -dir * 40 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <p className="font-serif text-xl font-light italic leading-relaxed text-[var(--text)] md:text-2xl">
                "{t.quote}"
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="mt-2 font-display font-bold text-[var(--text)]">{t.role}</div>
                  <div className="text-sm text-[var(--text-muted)]">{t.company}</div>
                </div>
                <div className="rounded-xl bg-[rgb(var(--accent-1)/0.12)] px-4 py-2 text-sm font-bold text-accent">
                  {t.metric}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} aria-label="Previous testimonial" className="inline-flex h-10 w-10 items-center justify-center rounded-full glass text-[var(--text)] transition hover:text-accent glow-hover">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} aria-label={`Go to testimonial ${i + 1}`} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-accent' : 'w-2 bg-[rgb(var(--border)/0.2)]'}`} />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next testimonial" className="inline-flex h-10 w-10 items-center justify-center rounded-full glass text-[var(--text)] transition hover:text-accent glow-hover">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
