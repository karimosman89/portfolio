import React from 'react';
import { motion } from 'motion/react';
import { Tag, Check, Sparkles, ArrowUpRight } from 'lucide-react';
import { PRICING_TIERS } from '../data';
import { useLanguage } from '../i18n/LanguageContext';
import { useSpotlight } from '../hooks/useScrollReveal';

function useT() {
  const { t } = useLanguage();
  return (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };
}

function PriceCard({ item, index }: { item: (typeof PRICING_TIERS)[number]; index: number }) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  const T = useT();

  const goContact = () => {
    window.dispatchEvent(new CustomEvent('switch-tab', { detail: { id: 'contact', scrollToTop: true } }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        className={`spotlight border-beam group relative flex h-full flex-col rounded-2xl border p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none ${
          item.highlighted
            ? 'border-indigo-400/70 bg-white ring-1 ring-indigo-500/20 dark:border-indigo-500/50 dark:bg-zinc-950'
            : 'border-zinc-200 bg-white hover:border-indigo-500/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-500/40'
        }`}
      >
        {item.highlighted && (
          <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest text-white">
            <Sparkles size={9} /> {T('pricing.popular', 'Most requested')}
          </span>
        )}

        <h3 className="font-display text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {item.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-white">{item.price}</span>
        </div>
        <div className="mt-0.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {item.cadence}
        </div>

        <p className="mt-3 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {item.description}
        </p>

        <ul className="mt-5 flex-1 space-y-2.5">
          {item.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
              <Check size={15} className="mt-0.5 shrink-0 text-emerald-500" />
              <span className="font-light">{f}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={goContact}
          className={`shine-hover mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider transition hover:-translate-y-0.5 ${
            item.highlighted
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
          }`}
        >
          {T('pricing.cta', 'Discuss scope')} <ArrowUpRight size={13} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  const T = useT();

  return (
    <section
      id="pricing"
      className="mx-auto max-w-7xl border-t border-zinc-200/80 px-6 py-16 dark:border-zinc-800 md:px-8"
    >
      <div className="mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:bg-zinc-900 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-800">
          <Tag size={11} />
          <span>{T('pricing.eyebrow', 'Transparent engagement')}</span>
        </div>
        <h2 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {T('pricing.title.lead', 'Know the')}{' '}
          <span className="text-gradient-animated font-serif italic font-light">
            {T('pricing.title.accent', 'investment')}
          </span>{' '}
          {T('pricing.title.rest', 'before the call.')}
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T(
            'pricing.subtitle',
            'Indicative starting points so you can self-qualify. Final scope and price are agreed together — no surprises, no lock-in.'
          )}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {PRICING_TIERS.map((item, i) => (
          <PriceCard key={item.id} item={item} index={i} />
        ))}
      </div>

      <p className="mt-6 text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
        {T('pricing.note', 'Prices exclude VAT · EU invoicing · fixed-price or retainer available')}
      </p>
    </section>
  );
}
