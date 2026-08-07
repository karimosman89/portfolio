import React from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare, Hammer, PackageCheck, ShieldCheck,
  Clock, CheckCircle2, PhoneCall, FileSignature, PlayCircle, Server
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSpotlight } from '../hooks/useScrollReveal';

function useT() {
  const { t } = useLanguage();
  return (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };
}

const STEPS = [
  {
    num: '01',
    icon: MessageSquare,
    titleKey: 'proc.step.1.title',
    titleFallback: 'Discovery',
    subKey: 'proc.step.1.sub',
    subFallback: 'Understand the problem',
    bodyKey: 'proc.step.1.body',
    bodyFallback:
      'We talk through your challenge, existing systems, constraints, and what success actually looks like. No commitment — just an honest conversation.',
  },
  {
    num: '02',
    icon: Hammer,
    titleKey: 'proc.step.2.title',
    titleFallback: 'Build',
    subKey: 'proc.step.2.sub',
    subFallback: 'Design and build it right',
    bodyKey: 'proc.step.2.body',
    bodyFallback:
      'Clear scope, realistic timeline, iterative delivery. You stay involved at the right moments — without drowning in technical detail.',
  },
  {
    num: '03',
    icon: PackageCheck,
    titleKey: 'proc.step.3.title',
    titleFallback: 'Deploy & hand over',
    subKey: 'proc.step.3.sub',
    subFallback: 'Ship it and hand it over clean',
    bodyKey: 'proc.step.3.body',
    bodyFallback:
      'Production deployment, documentation that makes sense, and a clean handover. No lock-in. No black boxes. Your team owns everything.',
  },
];

const MODELS = [
  {
    icon: PlayCircle,
    accent: 'from-indigo-500 to-violet-500',
    titleKey: 'proc.model.1.title',
    titleFallback: 'POC & Validation',
    durationKey: 'proc.model.1.duration',
    durationFallback: '2 – 4 weeks',
    bodyKey: 'proc.model.1.body',
    bodyFallback: 'Fast, focused exploration to validate the idea and define what a real build requires.',
  },
  {
    icon: Hammer,
    accent: 'from-emerald-500 to-teal-500',
    titleKey: 'proc.model.2.title',
    titleFallback: 'Targeted Production Build',
    durationKey: 'proc.model.2.duration',
    durationFallback: '2 – 3 months',
    bodyKey: 'proc.model.2.body',
    bodyFallback: 'A scoped, well-defined system built and deployed to production standard.',
  },
  {
    icon: Server,
    accent: 'from-cyan-500 to-blue-600',
    titleKey: 'proc.model.3.title',
    titleFallback: 'Full-Scale System',
    durationKey: 'proc.model.3.duration',
    durationFallback: '4 – 6 months',
    bodyKey: 'proc.model.3.body',
    bodyFallback: 'End-to-end delivery with integrations, infrastructure, and complete handover.',
  },
];

const FINAL_STEPS = [
  {
    num: '01',
    icon: PhoneCall,
    titleKey: 'proc.book.1.title',
    titleFallback: 'Book a free call',
    bodyKey: 'proc.book.1.body',
    bodyFallback: 'A 30-minute conversation to understand your problem and whether there is a genuine fit.',
  },
  {
    num: '02',
    icon: FileSignature,
    titleKey: 'proc.book.2.title',
    titleFallback: 'Get a clear proposal',
    bodyKey: 'proc.book.2.body',
    bodyFallback: 'If there is a fit, you receive a scoped proposal with timeline, acceptance criteria, and a fixed engagement structure.',
  },
  {
    num: '03',
    icon: PlayCircle,
    titleKey: 'proc.book.3.title',
    titleFallback: 'We start',
    bodyKey: 'proc.book.3.body',
    bodyFallback: 'Once aligned, work begins — with full transparency from day one.',
  },
];

function StepCard({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  const T = useT();
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        className="spotlight border-beam group relative h-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-500/40"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-4xl font-black text-zinc-100 transition-colors group-hover:text-indigo-100 dark:text-zinc-900 dark:group-hover:text-indigo-950">
            {step.num}
          </span>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-indigo-500 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-zinc-900">
            <Icon size={18} />
          </span>
        </div>
        <div className="mt-4 text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          {T(step.titleKey, step.titleFallback)}
        </div>
        <h3 className="mt-1 font-display text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {T(step.subKey, step.subFallback)}
        </h3>
        <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T(step.bodyKey, step.bodyFallback)}
        </p>
      </div>
    </motion.div>
  );
}

export default function EngagementProcess() {
  const T = useT();

  const bookCall = () => {
    window.dispatchEvent(new CustomEvent('switch-tab', { detail: { id: 'contact', scrollToTop: true } }));
  };

  return (
    <section
      id="engagement-process"
      className="mx-auto max-w-7xl border-t border-zinc-200/80 px-6 py-16 dark:border-zinc-800 md:px-8"
    >
      {/* ===== The process ===== */}
      <div className="mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-800">
          <CheckCircle2 size={11} />
          <span>{T('proc.eyebrow', 'The process')}</span>
        </div>
        <h2 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {T('proc.title.lead', 'Simple.')}{' '}
          <span className="text-gradient-animated font-serif italic font-light">
            {T('proc.title.accent', 'No surprises.')}
          </span>
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T('proc.subtitle', 'A transparent, senior-led delivery path — from first conversation to a system your team fully owns.')}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <StepCard key={s.num} step={s} index={i} />
        ))}
      </div>

      {/* ===== Engagement models / honest timelines ===== */}
      <div className="mt-16 mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:bg-zinc-900 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-800">
          <Clock size={11} />
          <span>{T('proc.models.eyebrow', 'Engagement models')}</span>
        </div>
        <h2 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {T('proc.models.title.lead', 'Scoped honestly,')}{' '}
          <span className="text-gradient-animated font-serif italic font-light">
            {T('proc.models.title.accent', 'from day one.')}
          </span>
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T('proc.models.subtitle', 'Clear timelines and regular check-ins throughout, so you are never in the dark about progress.')}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {MODELS.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.titleKey}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="shine-hover group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:hover:shadow-none"
            >
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${m.accent} text-white shadow-md`}>
                <Icon size={19} />
              </div>
              <h3 className="mt-4 font-display text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {T(m.titleKey, m.titleFallback)}
              </h3>
              <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Clock size={11} /> {T(m.durationKey, m.durationFallback)}
              </div>
              <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                {T(m.bodyKey, m.bodyFallback)}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ===== Risk-reversal commitment ===== */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-16 overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-xl md:p-10 dark:border-indigo-900/40"
      >
        <div className="animate-aurora pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded bg-white/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest backdrop-blur-sm">
            <ShieldCheck size={11} />
            <span>{T('proc.commit.eyebrow', 'The commitment')}</span>
          </div>
          <h2 className="mt-3 max-w-3xl font-display text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
            {T('proc.commit.title', 'If the delivered system does not meet the agreed acceptance criteria, you do not pay.')}
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-indigo-100">
            {T(
              'proc.commit.body',
              'Before work begins we define together what success looks like — functionality, performance benchmarks, integration requirements. That definition becomes the contract: no ambiguity, no moving goalposts. All work is covered by NDA and GDPR-compliant by default; every system, model and codebase built for you is yours.'
            )}
          </p>
        </div>
      </motion.div>

      {/* ===== How it works / first step CTA ===== */}
      <div className="mt-16 mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-800">
          <PhoneCall size={11} />
          <span>{T('proc.book.eyebrow', 'How it works')}</span>
        </div>
        <h2 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {T('proc.book.title.lead', 'The first step is a')}{' '}
          <span className="text-gradient-animated font-serif italic font-light">
            {T('proc.book.title.accent', 'free discovery call.')}
          </span>
        </h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
          {T('proc.book.subtitle', 'No commitment, no pitch. If it is not the right fit, you will know that too — honestly.')}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {FINAL_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-500/40"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Icon size={16} />
                </span>
                <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-600">{s.num}</span>
              </div>
              <h3 className="mt-3 font-display text-base font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {T(s.titleKey, s.titleFallback)}
              </h3>
              <p className="mt-1.5 text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
                {T(s.bodyKey, s.bodyFallback)}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={bookCall}
          className="shine-hover inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 text-sm font-mono font-bold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          <PhoneCall size={15} /> {T('proc.book.cta', 'Book a free discovery call')}
        </button>
      </div>
    </section>
  );
}
