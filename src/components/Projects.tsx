import React from 'react';
import { GITHUB_REPOS } from '../data';
import { SectionHeading, Reveal, TiltCard } from './ui';
import { Github, Star, GitFork, ArrowUpRight, ExternalLink } from 'lucide-react';

const LANG_COLOR: Record<string, string> = {
  Go: '#00ADD8', TypeScript: '#3178C6', Python: '#3776AB', Markdown: '#8b949e', JavaScript: '#F7DF1E',
};

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Featured Work"
        title={<>Open-source &amp; <span className="text-gradient">production projects</span></>}
        subtitle="A selection of AI systems and tools I've built — from agent benchmarks to generative studios. Full code on GitHub."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {GITHUB_REPOS.map((r, i) => (
          <Reveal key={r.name} delay={(i % 2) * 0.06}>
            <TiltCard intensity={5} className="h-full">
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                 className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass p-6 glow-hover gradient-border">
                {/* animated preview strip */}
                <div className="mb-5 flex h-28 items-center justify-center overflow-hidden rounded-xl bg-[rgb(var(--accent-1)/0.06)]">
                  <div className="mesh-conic absolute inset-0 opacity-40 transition group-hover:opacity-70" />
                  <span className="relative font-mono text-4xl font-extrabold text-gradient opacity-60 transition group-hover:scale-110">
                    {'{ }'}
                  </span>
                  <div className="animate-shimmer absolute inset-0" />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Github size={18} className="text-[var(--text)]" />
                    <h3 className="font-display text-lg font-bold text-[var(--text)] transition group-hover:text-accent">{r.name}</h3>
                  </div>
                  <ArrowUpRight size={18} className="text-[var(--text-muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>

                <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-[var(--text-muted)]">{r.description}</p>

                {r.metrics && (
                  <div className="mt-4 flex gap-3">
                    {r.metrics.map((m) => (
                      <div key={m.label} className="rounded-lg bg-[rgb(var(--border)/0.06)] px-3 py-1.5">
                        <div className="text-sm font-bold text-accent">{m.value}</div>
                        <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {r.topics.map((t) => (
                    <span key={t} className="rounded-md bg-[rgb(var(--accent-1)/0.08)] px-2 py-0.5 text-[10px] font-mono text-accent">{t}</span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-4 border-t border-[rgb(var(--border)/0.06)] pt-4 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLOR[r.language] || '#888' }} /> {r.language}
                  </span>
                  <span className="flex items-center gap-1"><Star size={13} /> {r.stars}</span>
                  <span className="flex items-center gap-1"><GitFork size={13} /> {r.forks}</span>
                  <span className="ml-auto flex items-center gap-1 text-accent"><ExternalLink size={12} /> View</span>
                </div>
              </a>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 text-center">
          <a href="https://github.com/karimosman89" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-bold text-[var(--text)] transition hover:text-accent glow-hover">
            <Github size={16} /> Explore all repositories <ArrowUpRight size={15} />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
