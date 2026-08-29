import React from 'react';
import { motion } from 'motion/react';
import { Quote, BadgeCheck, Building2, Star } from 'lucide-react';
import { TESTIMONIALS, TRUST_LOGOS } from '../data';
import { useLanguage } from '../i18n/LanguageContext';
import { useSpotlight } from '../hooks/useScrollReveal';

/** i18n helper with safe fallback before keys exist. */
function useT() {
  const { t } = useLanguage();
  return (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };
}

function TestimonialCard({ item, index }: { item: (typeof TESTIMONIALS)[number]; index: number }) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        className="spotlight border-beam group relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-500/40 dark:hover:shadow-none"
      >
        <div className="mb-3 flex items-center justify-between">
          <Quote size={22} className="text-indigo-500/40 dark:text-indigo-400/40" />
          <div className="flex gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
          </div>
        </div>

        <p className="flex-1 text-sm font-light leading-relaxed text-zinc-700 dark:text-zinc-300">
          “{item.quote}”
        </p>

        {item.metric && (
          <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded bg-emerald-50/70 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30">
            <BadgeCheck size={11} />
            {item.metric}
          </div>
        )}

        <div className="mt-5 flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800/70">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
            {item.initials}
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-bold text-zinc-900 dark:text-white">{item.name}</div>
            <div className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
              {item.role} · {item.company}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const T = useT();

  return (
    <section
      id="testimonials"
      className="mx-auto max-w-7xl border-t border-zinc-200/80 px-6 py-16 dark:border-zinc-800 md:px-8"
    >
      {/* ===== Client & technology trust strip ===== */}
      <div className="mb-12">
        <p className="mb-5 text-center text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {T('trust.strip.title', 'Trusted delivering production AI with & for')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {TRUST_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="group flex items-center gap-1.5 text-sm font-bold tracking-tight text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300"
            >
              {logo.kind === 'client' && (
                <Building2 size={13} className="text-indigo-500/60 group-hover:text-indigo-500" />
              )}
              <span className={logo.kind === 'client' ? 'font-display' : 'font-mono text-[13px] font-medium'}>
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Named testimonials ===== */}
      <div className="mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-800">
          <BadgeCheck size={11} />
          <span>{T('testimonials.eyebrow', 'Social proof')}</span>
        </div>
        <h2 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {T('testimonials.title.lead', 'Hired on')}{' '}
          <span className="text-gradient-animated font-serif italic font-light">
            {T('testimonials.title.accent', 'evidence,')}
          </span>{' '}
          {T('testimonials.title.rest', 'not slides.')}
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T(
            'testimonials.subtitle',
            'What decision-makers say after their AI systems went into production and stayed there.'
          )}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((item, i) => (
          <TestimonialCard key={item.company + i} item={item} index={i} />
        ))}
      </div>

      <p className="mt-6 text-center text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
        {T('testimonials.disclaimer', 'Roles anonymized on request · verbatim references available on a call')}
      </p>
    </section>
  );
}
