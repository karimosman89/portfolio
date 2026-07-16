import React from 'react';
import { PERSONAL_INFO } from '../data';
import { Github, Linkedin, Mail, ArrowUp, Twitter, Youtube, FileText, Sparkles } from 'lucide-react';

const SOCIALS = [
  { icon: Github, href: PERSONAL_INFO.github, label: 'GitHub' },
  { icon: Linkedin, href: PERSONAL_INFO.linkedin, label: 'LinkedIn' },
  { icon: Twitter, href: PERSONAL_INFO.x, label: 'X' },
  { icon: Youtube, href: PERSONAL_INFO.youtube, label: 'YouTube' },
  { icon: Mail, href: `mailto:${PERSONAL_INFO.email}`, label: 'Email' },
];

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#agents', label: 'AI Agents' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#blog', label: 'Insights' },
  { href: '#contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[rgb(var(--border)/0.08)] no-print">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={PERSONAL_INFO.portrait} alt={PERSONAL_INFO.name} className="h-10 w-10 rounded-xl object-cover" />
              <div>
                <div className="font-display font-bold text-[var(--text)]">{PERSONAL_INFO.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-accent">Senior AI Engineer</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-[var(--text-muted)]">
              Building production-grade LLM, RAG and multi-agent systems for enterprise clients across Europe &amp; North America.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className="inline-flex h-9 w-9 items-center justify-center rounded-lg glass text-[var(--text-muted)] transition hover:text-accent glow-hover">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">Navigate</div>
            <div className="grid grid-cols-2 gap-2">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} className="text-sm text-[var(--text-muted)] transition hover:text-accent">{l.label}</a>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">Work with me</div>
            <a href="#contact" className="btn-primary mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold">
              <Sparkles size={15} /> Start a Project
            </a>
            <button onClick={() => window.print()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl glass py-3 text-sm font-bold text-[var(--text)] transition hover:text-accent">
              <FileText size={15} /> Download Resume (PDF)
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgb(var(--border)/0.08)] pt-6 md:flex-row">
          <p className="font-mono text-[11px] text-[var(--text-muted)]">© {new Date().getFullYear()} {PERSONAL_INFO.name}. Available for EU &amp; global remote engagements.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] transition hover:text-accent">
            Back to top <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
