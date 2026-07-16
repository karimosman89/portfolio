import React, { useState, useMemo } from 'react';
import { TECHNICAL_BLOGS, PERSONAL_INFO } from '../data';
import { SectionHeading, Reveal } from './ui';
import { Clock, Search, X, ArrowUpRight, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Blog() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [active, setActive] = useState<typeof TECHNICAL_BLOGS[0] | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const categories = useMemo(() => ['All', ...Array.from(new Set(TECHNICAL_BLOGS.map((b) => b.category)))], []);
  const filtered = useMemo(() => TECHNICAL_BLOGS.filter((b) => {
    const mc = cat === 'All' || b.category === cat;
    const mq = !q || (b.title + b.summary + b.tags.join(' ')).toLowerCase().includes(q.toLowerCase());
    return mc && mq;
  }), [q, cat]);

  return (
    <section id="blog" className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="AI Insights"
        title={<>Engineering <span className="text-gradient">deep dives</span></>}
        subtitle="Practical write-ups on LLMOps, RAG, agents and production AI — lessons from real deployments."
      />

      {/* controls */}
      <Reveal>
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${cat === c ? 'gradient-accent text-white' : 'glass text-[var(--text-muted)] hover:text-accent'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…"
              className="w-full rounded-xl glass py-2.5 pl-9 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 ring-accent" />
          </div>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-3">
        {filtered.map((b, i) => (
          <Reveal key={b.id} delay={(i % 3) * 0.06}>
            <button onClick={() => setActive(b)} className="group flex h-full flex-col rounded-2xl glass p-6 text-left glow-hover gradient-border">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-md bg-[rgb(var(--accent-1)/0.1)] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-accent">{b.category}</span>
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]"><Clock size={11} /> {b.readTime}</span>
              </div>
              <h3 className="font-display text-base font-bold leading-snug text-[var(--text)] transition group-hover:text-accent">{b.title}</h3>
              <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-[var(--text-muted)]">{b.summary}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[rgb(var(--border)/0.06)] pt-3">
                <span className="text-[11px] text-[var(--text-muted)]">{b.date}</span>
                <span className="flex items-center gap-1 text-xs font-bold text-accent">Read <ArrowUpRight size={13} /></span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && <p className="py-12 text-center text-[var(--text-muted)]">No articles match your search.</p>}

      {/* Newsletter */}
      <Reveal delay={0.1}>
        <div className="relative mt-14 overflow-hidden rounded-2xl glass-strong p-8 text-center md:p-10">
          <div className="mesh-conic pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-lg">
            <h3 className="font-display text-xl font-bold text-[var(--text)] md:text-2xl">Get AI engineering insights</h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Occasional deep dives on production AI. No spam, unsubscribe anytime.</p>
            <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="mt-5 flex flex-col gap-2 sm:flex-row">
              <input type="email" required placeholder="you@company.com"
                className="flex-1 rounded-xl glass px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 ring-accent" />
              <button type="submit" className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold">
                {subscribed ? 'Subscribed ✓' : <>Subscribe <Send size={14} /></>}
              </button>
            </form>
          </div>
        </div>
      </Reveal>

      {/* Article modal */}
      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setActive(null)} />
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.97 }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl glass-strong p-8">
              <button onClick={() => setActive(null)} className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg glass text-[var(--text-muted)] hover:text-accent"><X size={18} /></button>
              <span className="rounded-md bg-[rgb(var(--accent-1)/0.1)] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-accent">{active.category}</span>
              <h2 className="mt-4 font-display text-2xl font-extrabold text-[var(--text)]">{active.title}</h2>
              <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-muted)]"><span>{active.date}</span><span className="flex items-center gap-1"><Clock size={11} /> {active.readTime}</span></div>
              <div className="prose mt-6 max-w-none text-sm leading-relaxed text-[var(--text-muted)]">
                {active.content.split('\n\n').map((p, i) => {
                  if (p.startsWith('### ')) return <h3 key={i} className="mt-5 font-display text-base font-bold text-[var(--text)]">{p.replace('### ', '')}</h3>;
                  return <p key={i} className="mt-3" dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--text)]">$1</strong>') }} />;
                })}
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {active.tags.map((t) => <span key={t} className="rounded-md bg-[rgb(var(--border)/0.06)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)]">{t}</span>)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
