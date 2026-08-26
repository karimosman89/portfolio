import React from 'react';
import { motion } from 'motion/react';
import {
  Compass, Database, HelpCircle, RefreshCw,
  Rocket, Wrench, Server, Plug, Lightbulb, ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSpotlight } from '../hooks/useScrollReveal';

/** Small helper so copy can be i18n-driven but still safe before keys exist. */
function useT() {
  const { t } = useLanguage();
  return (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };
}

const PAIN_POINTS = [
  {
    icon: Rocket,
    tone: 'text-indigo-500',
    titleKey: 'value.pain.1.title',
    titleFallback: "Your team built a promising prototype. Months later it's still not in production.",
    bodyKey: 'value.pain.1.body',
    bodyFallback:
      'Most AI projects stall between demo and deployment. I bridge that gap — the architecture, integration and reliability work that turns a prototype into a maintainable, revenue-ready system.',
  },
  {
    icon: Database,
    tone: 'text-emerald-500',
    titleKey: 'value.pain.2.title',
    titleFallback: "You're sitting on years of operational data. Nothing is extracting real value from it.",
    bodyKey: 'value.pain.2.body',
    bodyFallback:
      'Documents, sensor readings, logs, unstructured text — valuable data with no pipeline turning it into insight. I build the RAG, search and analytics systems that change that.',
  },
  {
    icon: HelpCircle,
    tone: 'text-amber-500',
    titleKey: 'value.pain.3.title',
    titleFallback: 'Everyone says "add AI" but nobody can tell you where it actually pays off.',
    bodyKey: 'value.pain.3.body',
    bodyFallback:
      "You don't need a roadmap full of buzzwords. You need someone to look at your real operations and tell you honestly where AI creates measurable value — then build it properly.",
  },
  {
    icon: RefreshCw,
    tone: 'text-fuchsia-500',
    titleKey: 'value.pain.4.title',
    titleFallback: "You've tried before, and it didn't work.",
    bodyKey: 'value.pain.4.body',
    bodyFallback:
      'A templated agency build that never fit your context, a throwaway pilot, or a vendor who disappeared. I work differently: direct, custom, and with a clean full handover every time.',
  },
];

const VALUE_PROPS = [
  {
    icon: Lightbulb,
    accent: 'from-indigo-500 to-violet-500',
    titleKey: 'value.prop.1.title',
    titleFallback: 'Proof of Concept',
    bodyKey: 'value.prop.1.body',
    bodyFallback: 'Fast, focused validation of your AI idea. You leave knowing if it works and exactly what it takes to scale.',
  },
  {
    icon: Wrench,
    accent: 'from-emerald-500 to-teal-500',
    titleKey: 'value.prop.2.title',
    titleFallback: 'Internal Tools & Automation',
    bodyKey: 'value.prop.2.body',
    bodyFallback: 'Document processing, smart search and workflow automation your team will actually use — built around how the business really operates.',
  },
  {
    icon: Server,
    accent: 'from-cyan-500 to-blue-600',
    titleKey: 'value.prop.3.title',
    titleFallback: 'Production AI Systems',
    bodyKey: 'value.prop.3.body',
    bodyFallback: 'End-to-end systems for real load, real data and real users — integrated into your stack, tested, documented, handed over clean.',
  },
  {
    icon: Plug,
    accent: 'from-fuchsia-500 to-purple-600',
    titleKey: 'value.prop.4.title',
    titleFallback: 'AI Integration & Advisory',
    bodyKey: 'value.prop.4.body',
    bodyFallback: 'Connect AI to your CRMs, ERPs, databases and APIs — no rip-and-replace. Plus senior architecture review before you commit to a build.',
  },
];

function PainCard({ item, index }: { item: (typeof PAIN_POINTS)[number]; index: number }) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  const T = useT();
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        className="spotlight border-beam group relative h-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-500/40 dark:hover:shadow-none"
      >
        <span className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 ${item.tone} transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-zinc-900`}>
          <Icon size={18} />
        </span>
        <h3 className="font-display text-base font-bold leading-snug tracking-tight text-zinc-900 dark:text-white">
          {T(item.titleKey, item.titleFallback)}
        </h3>
        <p className="mt-2.5 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T(item.bodyKey, item.bodyFallback)}
        </p>
      </div>
    </motion.div>
  );
}

function ValueCard({ item, index }: { item: (typeof VALUE_PROPS)[number]; index: number }) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  const T = useT();
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        className="spotlight border-beam shine-hover group relative h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/30 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-500/40 dark:hover:shadow-none"
      >
        <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-md`}>
          <Icon size={19} />
        </div>
        <h3 className="font-display text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {T(item.titleKey, item.titleFallback)}
        </h3>
        <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T(item.bodyKey, item.bodyFallback)}
        </p>
      </div>
    </motion.div>
  );
}

export default function BusinessValue() {
  const T = useT();

  const goContact = () => {
    window.dispatchEvent(new CustomEvent('switch-tab', { detail: { id: 'contact', scrollToTop: true } }));
  };

  return (
    <section
      id="business-value"
      className="mx-auto max-w-7xl border-t border-zinc-200/80 px-6 py-16 dark:border-zinc-800 md:px-8"
    >
      {/* ===== Pain points — the non-technical, business-owner entry point ===== */}
      <div className="mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-800">
          <Compass size={11} className="animate-pulse" />
          <span>{T('value.eyebrow', '01 / Where I come in')}</span>
        </div>
        <h2 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {T('value.title.lead', 'Sound')}{' '}
          <span className="text-gradient-animated font-serif italic font-light">
            {T('value.title.accent', 'familiar?')}
          </span>
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T(
            'value.subtitle',
            'These are the conversations that usually lead to working together — spoken in business outcomes, delivered in production-grade engineering.'
          )}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {PAIN_POINTS.map((p, i) => (
          <PainCard key={p.titleKey} item={p} index={i} />
        ))}
      </div>

      {/* ===== Value / outcomes — what the client actually gets ===== */}
      <div className="mt-16 mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:bg-zinc-900 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-800">
          <Rocket size={11} />
          <span>{T('value.deliver.eyebrow', 'What I deliver')}</span>
        </div>
        <h2 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {T('value.deliver.title.lead', 'Outcomes,')}{' '}
          <span className="text-gradient-animated font-serif italic font-light">
            {T('value.deliver.title.accent', 'not just systems.')}
          </span>
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T(
            'value.deliver.subtitle',
            'Every engagement is scoped around a measurable business result — validated fast, built to production standard, and fully owned by your team.'
          )}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VALUE_PROPS.map((v, i) => (
          <ValueCard key={v.titleKey} item={v} index={i} />
        ))}
      </div>

      {/* CTA bridge */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-200/60 bg-gradient-to-r from-indigo-50 to-violet-50 p-6 dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-violet-950/20">
        <p className="max-w-xl text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
          {T(
            'value.cta.text',
            'Have a real problem worth solving — or a partnership, sponsorship or investment in mind? Let’s have an honest, no-pitch conversation.'
          )}
        </p>
        <button
          onClick={goContact}
          className="shine-hover inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          {T('value.cta.button', 'Start a conversation')} <ArrowUpRight size={13} />
        </button>
      </div>
    </section>
  );
}
