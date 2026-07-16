import React from 'react';
import { AGENT_CAPABILITIES } from '../data';
import { SectionHeading, Reveal } from './ui';
import { DynIcon as Icon } from './iconMap';

/* Animated agentic workflow diagram (SVG with flowing data lines) */
function WorkflowDiagram() {
  const nodes = [
    { id: 'user', label: 'User Goal', x: 60, y: 90, icon: 'User' },
    { id: 'orch', label: 'Orchestrator', x: 250, y: 90, icon: 'BrainCircuit' },
    { id: 'plan', label: 'Planner', x: 440, y: 30, icon: 'ListChecks' },
    { id: 'tools', label: 'Tool / MCP', x: 440, y: 90, icon: 'Wrench' },
    { id: 'mem', label: 'Memory', x: 440, y: 150, icon: 'Database' },
    { id: 'out', label: 'Result', x: 630, y: 90, icon: 'CheckCircle2' },
  ];
  const edges = [
    ['user', 'orch'], ['orch', 'plan'], ['orch', 'tools'], ['orch', 'mem'],
    ['plan', 'out'], ['tools', 'out'], ['mem', 'out'],
  ];
  const byId = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="overflow-x-auto rounded-2xl glass p-6">
      <svg viewBox="0 0 700 200" className="mx-auto w-full min-w-[640px]" role="img" aria-label="Agentic workflow diagram">
        <defs>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(var(--accent-1))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgb(var(--accent-2))" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* Static schematic traces drawn in on load (anime.js line-drawing feel) */}
        {edges.map(([a, b], i) => {
          const na = byId(a), nb = byId(b);
          const d = `M ${na.x + 34} ${na.y} C ${(na.x + nb.x) / 2} ${na.y}, ${(na.x + nb.x) / 2} ${nb.y}, ${nb.x - 34} ${nb.y}`;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="rgb(var(--accent-1)/0.18)" strokeWidth="1.5"
                className="draw-line" style={{ ['--dash' as any]: 260, animationDelay: `${i * 0.12}s` }} />
              <path d={d} fill="none" stroke="url(#edgeGrad)" strokeWidth="1.5" className="flow-line" />
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="26" fill="rgb(var(--surface))" stroke="rgb(var(--accent-1)/0.4)" strokeWidth="1.5" />
            <foreignObject x={n.x - 13} y={n.y - 13} width="26" height="26">
              <div className="flex h-full w-full items-center justify-center text-accent">
                <Icon name={n.icon} size={16} />
              </div>
            </foreignObject>
            <text x={n.x} y={n.y + 44} textAnchor="middle" className="fill-[var(--text-muted)]" style={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}>{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function AgentsShowcase() {
  return (
    <section id="agents" className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Agentic AI"
        title={<>Autonomous <span className="text-gradient">multi-agent</span> systems</>}
        subtitle="I build agents that reason, plan, call tools and complete real work — grounded, observable and safe for the enterprise."
      />

      <Reveal>
        <WorkflowDiagram />
      </Reveal>

      {/* OriginKit-style interlocking hairline grid — seamless, aligned, dev-tool crisp */}
      <Reveal>
        <div className="card-grid mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [&>*:last-child]:border-r-0">
          {AGENT_CAPABILITIES.map((c) => (
            <div key={c.id} className="group top-sheen flex items-start gap-4 p-6">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgb(var(--accent-1)/0.12)] text-accent transition group-hover:gradient-accent group-hover:text-white">
                <Icon name={c.icon} />
              </div>
              <div>
                <h3 className="font-display font-bold text-[var(--text)]">{c.title}</h3>
                <p className="mt-1 text-sm font-light leading-relaxed text-[var(--text-muted)]">{c.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="kbd text-[var(--text-muted)]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
