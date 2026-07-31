import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical, Sparkles, ArrowUpRight, Github, X, Cpu, Eye,
  Boxes, Radio, ScanSearch, Layers, Activity, TrendingUp, CircleDot
} from 'lucide-react';
import { POC_PROJECTS } from '../data';
import { PocProject } from '../types';
import LazyImage from './LazyImage';
import { useSpotlight } from '../hooks/useScrollReveal';

// Bundle the hero assets through Vite so they resolve in dev & production.
import imgVlm from '../assets/images/poc/vlm-inspector.webp';
import imgSplat from '../assets/images/poc/gaussian-splat.webp';
import imgEgo from '../assets/images/poc/egocentric-video.webp';
import imgEdge from '../assets/images/poc/edge-vision.webp';
import imgMed from '../assets/images/poc/medical-imaging.webp';
import imgAgent from '../assets/images/poc/multi-agent-rag.webp';

const IMAGE_MAP: Record<string, string> = {
  '/poc/vlm-inspector.png': imgVlm,
  '/poc/gaussian-splat.png': imgSplat,
  '/poc/egocentric-video.png': imgEgo,
  '/poc/edge-vision.png': imgEdge,
  '/poc/medical-imaging.png': imgMed,
  '/poc/multi-agent-rag.png': imgAgent,
};

const DOMAIN_ICON: Record<string, any> = {
  vision: ScanSearch,
  genai: Sparkles,
  agents: Boxes,
  multimodal: Layers,
  edge: Radio,
};

const STATUS_STYLE: Record<string, string> = {
  'Live Demo': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40',
  'Production': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/40',
  'Prototype': 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40',
  'Research': 'bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200/60 dark:border-fuchsia-800/40',
};

const FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'All POCs' },
  { id: 'vision', label: 'Computer Vision' },
  { id: 'multimodal', label: 'Vision-Language' },
  { id: 'agents', label: 'Agentic AI' },
  { id: 'edge', label: 'Edge AI' },
];

function PocCard({ project, onOpen, index }: { project: PocProject; onOpen: () => void; index: number }) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  const DomainIcon = DOMAIN_ICON[project.domain] || Cpu;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onClick={onOpen}
        className="spotlight border-beam relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/30 dark:hover:border-indigo-500/40 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none"
      >
        {/* Image header */}
        <div className="shine-hover relative aspect-[16/9] w-full overflow-hidden border-b border-zinc-100 dark:border-zinc-900">
          <LazyImage
            src={IMAGE_MAP[project.image] || project.image}
            alt={project.title}
            className="h-full w-full"
            imgClassName="group-hover:scale-[1.06] transition-transform duration-[900ms] ease-out"
          />
          {/* Gradient wash */}
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${project.accent} opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-30`} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Top-left badges */}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-sm ${STATUS_STYLE[project.status]}`}>
              <CircleDot size={8} className="animate-pulse" />
              {project.status}
            </span>
            {project.trending && (
              <span className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                <TrendingUp size={9} className="text-emerald-400" />
                2026 Trend
              </span>
            )}
          </div>

          {/* Domain chip bottom-left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/90">
            <DomainIcon size={12} />
            <span>{project.domainLabel}</span>
          </div>
        </div>

        {/* Body */}
        <div className="relative z-[2] flex flex-1 flex-col p-5">
          <h3 className="font-display text-base font-extrabold tracking-tight text-zinc-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {project.title}
          </h3>
          <p className="mt-1 text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {project.tagline}
          </p>
          <p className="mt-3 line-clamp-3 text-xs font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
            {project.description}
          </p>

          {/* Metrics strip */}
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-900">
            {project.metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className={`font-mono text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${project.accent}`}>
                  {m.value}
                </div>
                <div className="mt-0.5 text-[8px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 leading-tight">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {project.stack.slice(0, 3).map((s) => (
                <span key={s} className="rounded bg-zinc-50 px-1.5 py-0.5 text-[9px] font-mono text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                  {s}
                </span>
              ))}
              {project.stack.length > 3 && (
                <span className="rounded px-1.5 py-0.5 text-[9px] font-mono text-zinc-400 dark:text-zinc-600">
                  +{project.stack.length - 3}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Inspect <Eye size={11} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PocModal({ project, onClose }: { project: PocProject; onClose: () => void }) {
  const DomainIcon = DOMAIN_ICON[project.domain] || Cpu;
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
      >
        {/* Hero */}
        <div className="relative aspect-[16/8] w-full overflow-hidden">
          <LazyImage src={IMAGE_MAP[project.image] || project.image} alt={project.title} className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-zinc-950 dark:via-zinc-950/40" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/90">
              <DomainIcon size={13} />
              <span>{project.domainLabel}</span>
              <span className="opacity-50">/</span>
              <span>{project.year}</span>
            </div>
            <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6 md:p-8">
          <p className="text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
            {project.description}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className={`font-mono text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${project.accent}`}>
                  {m.value}
                </div>
                <div className="mt-1 text-[9px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Problem / Approach / Outcome */}
          <div className="space-y-4">
            {[
              { icon: Activity, label: 'The Problem', text: project.problem, tone: 'text-rose-500' },
              { icon: FlaskConical, label: 'The Approach', text: project.approach, tone: 'text-indigo-500' },
              { icon: TrendingUp, label: 'The Outcome', text: project.outcome, tone: 'text-emerald-500' },
            ].map((row) => {
              const RowIcon = row.icon;
              return (
                <div key={row.label} className="flex gap-3">
                  <span className={`mt-0.5 shrink-0 ${row.tone}`}><RowIcon size={16} /></span>
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                      {row.label}
                    </div>
                    <p className="mt-1 text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {row.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stack */}
          <div>
            <div className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Technology Stack
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span key={s} className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-mono text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-900">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white transition hover:bg-indigo-700"
              >
                <Eye size={14} /> View Demo <ArrowUpRight size={12} />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                <Github size={14} /> Source
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PocShowcase() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<PocProject | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return POC_PROJECTS;
    return POC_PROJECTS.filter((p) => p.domain === filter);
  }, [filter]);

  return (
    <section id="poc-showcase" className="mx-auto max-w-7xl border-t border-zinc-200/80 px-6 py-16 dark:border-zinc-800 md:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400 border border-zinc-200 dark:border-zinc-800">
            <FlaskConical size={11} className="animate-pulse" />
            <span>03 / Proof-of-Concept Lab</span>
          </div>
          <h2 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Flagship{' '}
            <span className="text-gradient-animated font-serif italic font-light">POC Projects</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400">
            A curated lab of production-grade proof-of-concepts spanning the 2026 frontier of applied
            Computer Vision & AI — Vision-Language models, 3D Gaussian Splatting, egocentric video
            understanding, on-device edge perception, and agentic multimodal pipelines. Click any card
            for the full problem → approach → outcome breakdown.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-1.5 border-b border-zinc-100 pb-5 dark:border-zinc-900">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`cursor-pointer rounded border px-4 py-2 text-[10px] font-mono uppercase tracking-wider transition-all ${
              filter === f.id
                ? 'border-indigo-600 bg-indigo-600 font-bold text-white shadow-md shadow-indigo-500/10'
                : 'border-zinc-200 bg-zinc-50/50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <PocCard key={project.id} project={project} index={i} onOpen={() => setSelected(project)} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <PocModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
