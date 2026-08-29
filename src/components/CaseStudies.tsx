import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers, AlertTriangle, Wrench, TrendingUp, ChevronDown, Factory, ArrowUpRight
} from 'lucide-react';
import { CASE_STUDIES } from '../data';
import { useLanguage } from '../i18n/LanguageContext';
import { useSpotlight } from '../hooks/useScrollReveal';

function useT() {
  const { t } = useLanguage();
  return (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };
}

function CaseStudyCard({ item, index, defaultOpen }: { item: (typeof CASE_STUDIES)[number]; index: number; defaultOpen: boolean }) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  const [open, setOpen] = useState(defaultOpen);
  const T = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        className="spotlight border-beam group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-500/40 dark:hover:shadow-none"
      >
        {/* Accent bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${item.accent}`} />

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left cursor-pointer"
        >
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <Factory size={10} /> {item.vertical}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {item.client}
              </span>
            </div>
            <h3 className="font-display text-lg font-extrabold leading-snug tracking-tight text-zinc-900 dark:text-white">
              {item.title}
            </h3>

            {/* Metric chips (always visible) */}
            <div className="mt-3 flex flex-wrap gap-2">
              {item.metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex items-baseline gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">{m.value}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <ChevronDown
            size={18}
            className={`mt-1 shrink-0 text-zinc-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-4 px-6 pb-6">
                {/* Problem */}
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800/70 dark:bg-zinc-900/40">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                    <AlertTriangle size={12} /> {T('case.problem', 'Problem')}
                  </div>
                  <p className="text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300">{item.problem}</p>
                </div>

                {/* Action */}
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800/70 dark:bg-zinc-900/40">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    <Wrench size={12} /> {T('case.action', 'Action')}
                  </div>
                  <p className="text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300">{item.action}</p>
                </div>

                {/* Result */}
                <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                    <TrendingUp size={12} /> {T('case.result', 'Result')}
                  </div>
                  <p className="text-sm font-light leading-relaxed text-zinc-700 dark:text-zinc-200">{item.result}</p>
                </div>

                {/* Stack */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-mono text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function CaseStudies() {
  const T = useT();

  const goContact = () => {
    window.dispatchEvent(new CustomEvent('switch-tab', { detail: { id: 'contact', scrollToTop: true } }));
  };

  return (
    <section
      id="case-studies"
      className="mx-auto max-w-7xl border-t border-zinc-200/80 px-6 py-16 dark:border-zinc-800 md:px-8"
    >
      <div className="mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-800">
          <Layers size={11} />
          <span>{T('case.eyebrow', 'Proof of work')}</span>
        </div>
        <h2 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {T('case.title.lead', 'Case')}{' '}
          <span className="text-gradient-animated font-serif italic font-light">
            {T('case.title.accent', 'studies')}
          </span>
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T(
            'case.subtitle',
            'Real engagements in Problem → Action → Result format — the numbers, the approach, and the outcome that shipped.'
          )}
        </p>
      </div>

      <div className="grid gap-5">
        {CASE_STUDIES.map((item, i) => (
          <CaseStudyCard key={item.id} item={item} index={i} defaultOpen={i === 0} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-200/60 bg-gradient-to-r from-indigo-50 to-violet-50 p-6 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-violet-950/20">
        <p className="max-w-xl text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
          {T('case.cta.text', 'Want a walkthrough of any of these — architecture, trade-offs and what it would take for your context?')}
        </p>
        <button
          onClick={goContact}
          className="shine-hover inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          {T('case.cta.button', 'Book a walkthrough')} <ArrowUpRight size={13} />
        </button>
      </div>
    </section>
  );
}
