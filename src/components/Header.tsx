import React, { useState, useEffect, useRef } from 'react';
import { PERSONAL_INFO, KEY_METRICS } from '../data';
import {
  Mail, Linkedin, Github, MapPin, ArrowUpRight, Calendar, FileText,
  Sun, Moon, Palette, Menu, X, Sparkles, ChevronRight, Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, ACCENTS, Accent } from '../theme';
import { StaggerText, StaggerGrid, MagneticButton } from './ui';

const NAV = [
  { href: '#services', label: 'Services' },
  { href: '#agents', label: 'AI Agents' },
  { href: '#playground', label: 'Live Demos' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#blog', label: 'Insights' },
  { href: '#contact', label: 'Contact' },
];

/* Typing animation for rotating role titles */
function TypeRoles() {
  const roles = PERSONAL_INFO.roles;
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState('');
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = roles[i % roles.length];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setTxt(current); return; }
    const speed = del ? 35 : 75;
    const t = setTimeout(() => {
      if (!del) {
        setTxt(current.slice(0, txt.length + 1));
        if (txt === current) setTimeout(() => setDel(true), 1400);
      } else {
        setTxt(current.slice(0, txt.length - 1));
        if (txt === '') { setDel(false); setI((p) => p + 1); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [txt, del, i, roles]);

  return (
    <span className="text-gradient-animated">
      {txt}<span className="type-cursor h-[0.9em] align-middle" />
    </span>
  );
}

function ThemeMenu() {
  const { isDark, toggleDark, accent, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg glass text-[var(--text-muted)] transition hover:text-accent"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Change theme color"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg glass text-[var(--text-muted)] transition hover:text-accent"
        >
          <Palette size={15} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-11 z-50 w-52 rounded-xl glass-strong p-2 shadow-2xl"
          >
            <div className="px-2 pb-2 pt-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Accent Theme</div>
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAccent(a.id as Accent)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-xs text-[var(--text)] transition hover:bg-[rgb(var(--accent-1)/0.1)]"
              >
                <span className="h-5 w-5 rounded-md" style={{ background: a.swatch }} />
                <span className="flex-1">{a.label}</span>
                {accent === a.id && <Check size={14} className="text-accent" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div className="relative w-full">
      {/* ---------- NAVBAR ---------- */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 no-print ${scrolled ? 'glass-strong border-b border-[rgb(var(--border)/0.08)] py-3' : 'py-5'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-lg">
              <img src={PERSONAL_INFO.portrait} alt="Karim Osman" className="h-full w-full object-cover" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg)] bg-emerald-400" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font-bold text-[var(--text)]">{PERSONAL_INFO.name}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-accent">Senior AI Engineer</div>
            </div>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-[13px] font-medium text-[var(--text-muted)] transition hover:text-accent">
                {n.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeMenu />
            <a
              href={PERSONAL_INFO.calendly} target="_blank" rel="noopener noreferrer"
              className="btn-primary hidden items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold sm:inline-flex"
            >
              <Calendar size={13} /> Book a Call
            </a>
            <button onClick={() => setMobileOpen(true)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg glass text-[var(--text)] lg:hidden" aria-label="Open menu">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-72 glass-strong p-6"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display font-bold text-[var(--text)]">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-[var(--text-muted)]"><X size={20} /></button>
              </div>
              <div className="flex flex-col gap-1">
                {NAV.map((n) => (
                  <a key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                     className="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-[var(--text)] transition hover:bg-[rgb(var(--accent-1)/0.1)]">
                    {n.label} <ChevronRight size={15} className="text-[var(--text-muted)]" />
                  </a>
                ))}
              </div>
              <a href={PERSONAL_INFO.calendly} target="_blank" rel="noopener noreferrer"
                 className="btn-primary mt-6 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold">
                <Calendar size={15} /> Book a Call
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- HERO ---------- */}
      <section id="top" className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-16 pt-32 md:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12">
          {/* Left copy */}
          <motion.div
            initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="lg:col-span-7"
          >
            <motion.div variants={fade} className="animate-elastic-in mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available · Freelance · B2B · Enterprise
            </motion.div>

            <motion.h1 variants={fade} className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--text)] md:text-6xl lg:text-[4.2rem]">
              <StaggerText text="I build" delay={0.15} stagger={0.04} />
              <br />
              <TypeRoles />
              <br />
              <span className="text-[var(--text-muted)] font-light">
                <StaggerText text="into production." delay={0.5} stagger={0.03} />
              </span>
            </motion.h1>

            <motion.p variants={fade} className="mt-7 max-w-xl text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
              Senior AI Engineer with <span className="font-semibold text-[var(--text)]">5+ years shipping production AI</span>.
              I design LLM & RAG platforms, autonomous multi-agent systems, and computer vision pipelines that deliver
              <span className="text-accent font-medium"> measurable enterprise ROI</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fade} className="mt-9 flex flex-wrap items-center gap-3">
              <MagneticButton href="#contact" strength={0.35}
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold">
                <Sparkles size={16} /> Hire Me
              </MagneticButton>
              <MagneticButton href={PERSONAL_INFO.calendly} strength={0.3} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-bold text-[var(--text)] transition hover:text-accent glow-hover">
                <Calendar size={16} /> Book a Call
              </MagneticButton>
              <button onClick={() => window.print()}
                 className="magnetic inline-flex items-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-bold text-[var(--text)] transition hover:text-accent glow-hover">
                <FileText size={16} /> Resume
              </button>
            </motion.div>

            {/* Social + location */}
            <motion.div variants={fade} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-accent" /> {PERSONAL_INFO.location}</span>
              <div className="flex items-center gap-2">
                {[
                  { icon: Github, href: PERSONAL_INFO.github, label: 'GitHub' },
                  { icon: Linkedin, href: PERSONAL_INFO.linkedin, label: 'LinkedIn' },
                  { icon: Mail, href: `mailto:${PERSONAL_INFO.email}`, label: 'Email' },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                     className="inline-flex h-8 w-8 items-center justify-center rounded-lg glass transition hover:text-accent glow-hover">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: holographic AI avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-5"
          >
            {/* anime.js-style staggered grid wave (radiates from centre) */}
            <div className="pointer-events-none absolute -inset-6 -z-10 opacity-[0.35]">
              <StaggerGrid cols={12} rows={12} className="h-full w-full" />
            </div>
            <div className="relative mx-auto aspect-square max-w-md">
              {/* rotating rings */}
              <div className="absolute inset-0 animate-spin-slow rounded-full border border-[rgb(var(--accent-1)/0.25)]" />
              <div className="absolute inset-6 animate-spin-slow rounded-full border border-dashed border-[rgb(var(--accent-2)/0.25)]" style={{ animationDirection: 'reverse', animationDuration: '36s' }} />
              {/* glow */}
              <div className="absolute inset-8 rounded-full blur-2xl" style={{ background: 'radial-gradient(circle, rgb(var(--glow-1)/0.4), transparent 70%)' }} />
              {/* portrait */}
              <div className="animate-float absolute inset-10 overflow-hidden rounded-[2rem] gradient-border glass-strong">
                <img src={PERSONAL_INFO.portrait} alt="Karim Osman, Senior AI Engineer" className="h-full w-full object-cover" />
                {/* holographic sheen */}
                <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(120deg, transparent 40%, rgb(var(--accent-1)/0.15) 50%, transparent 60%)' }} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* status chip */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl glass-strong px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text)]">Online · Open to work</span>
                  </div>
                  <span className="text-[10px] font-mono text-accent">AI</span>
                </div>
              </div>
              {/* floating metric chips */}
              {[
                { t: '99.9%', s: 'Uptime', pos: '-left-4 top-10' },
                { t: '-40%', s: 'Latency', pos: '-right-2 top-1/3' },
                { t: '€2M+', s: 'Impact', pos: 'bottom-6 -left-2' },
              ].map((c, idx) => (
                <motion.div key={c.s}
                  initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.15 }}
                  className={`animate-float absolute ${c.pos} rounded-xl glass-strong px-3 py-2 shadow-xl`} style={{ animationDelay: `${idx}s` }}>
                  <div className="text-sm font-bold text-gradient">{c.t}</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.s}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[var(--text-muted)] md:flex">
          <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
          <div className="h-8 w-5 rounded-full border border-[rgb(var(--border)/0.2)] p-1">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="h-1.5 w-full rounded-full bg-accent" />
          </div>
        </div>
      </section>

      {/* KEY METRICS STRIP */}
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl glass md:grid-cols-4">
          {KEY_METRICS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="border-r border-[rgb(var(--border)/0.06)] p-6 text-center last:border-r-0"
            >
              <div className="font-display text-2xl font-extrabold text-gradient md:text-3xl">{m.value}</div>
              <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text)]">{m.label}</div>
              <div className="mt-0.5 text-[10px] text-[var(--text-muted)]">{m.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } },
};
