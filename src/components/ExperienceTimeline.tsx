import React, { useState } from 'react';
import { EXPERIENCES, CERTIFICATIONS, EDUCATION, LANGUAGES } from '../data';
import { SectionHeading, Reveal } from './ui';
import {
  Briefcase, MapPin, ChevronDown, Target, Lightbulb, TrendingUp,
  GraduationCap, Award, Languages as LangIcon, CheckCircle2, Clock,
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'motion/react';

function ExperienceCard({ exp, index }: { exp: typeof EXPERIENCES[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="relative pl-8 md:pl-10">
      {/* timeline dot + line */}
      <span className="absolute left-0 top-2 h-3 w-3 rounded-full gradient-accent ring-4 ring-[rgb(var(--accent-1)/0.15)]" />
      <div className="rounded-2xl glass p-6 glow-hover">
        <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start justify-between gap-4 text-left">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-bold text-[var(--text)]">{exp.role}</h3>
              <span className="rounded-full bg-[rgb(var(--accent-1)/0.1)] px-2.5 py-0.5 text-[10px] font-mono text-accent">{exp.period}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5 font-medium text-[var(--text)]"><Briefcase size={13} className="text-accent" /> {exp.company}</span>
              <span className="flex items-center gap-1.5"><MapPin size={12} /> {exp.location}</span>
            </div>
            <p className="mt-2 text-sm font-light text-[var(--text-muted)]">{exp.description}</p>
          </div>
          <ChevronDown size={20} className={`shrink-0 text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden"
            >
              <ul className="mt-5 space-y-2 border-t border-[rgb(var(--border)/0.06)] pt-5">
                {exp.bulletPoints.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-accent" /> {b}
                  </li>
                ))}
              </ul>

              {exp.challengesSolved.length > 0 && (
                <div className="mt-5 space-y-3">
                  {exp.challengesSolved.map((c, i) => (
                    <div key={i} className="rounded-xl bg-[rgb(var(--border)/0.04)] p-4">
                      <div className="mb-2 font-display text-sm font-bold text-[var(--text)]">{c.title}</div>
                      <div className="grid gap-3 text-xs md:grid-cols-3">
                        <div><div className="mb-1 flex items-center gap-1 font-mono uppercase tracking-wider text-rose-400"><Target size={11} /> Challenge</div><p className="text-[var(--text-muted)]">{c.challenge}</p></div>
                        <div><div className="mb-1 flex items-center gap-1 font-mono uppercase tracking-wider text-amber-400"><Lightbulb size={11} /> Solution</div><p className="text-[var(--text-muted)]">{c.solution}</p></div>
                        <div><div className="mb-1 flex items-center gap-1 font-mono uppercase tracking-wider text-emerald-400"><TrendingUp size={11} /> Impact</div><p className="text-[var(--text-muted)]">{c.impact}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-1.5">
                {exp.modelsUsed.map((m) => (
                  <span key={m} className="rounded-md bg-[rgb(var(--accent-1)/0.08)] px-2 py-0.5 text-[10px] font-mono text-accent">{m}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Career Journey"
        title={<>Experience, <span className="text-gradient">education &amp; certs</span></>}
        subtitle="A track record of turning research into revenue across enterprise clients in Europe."
      />

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="relative space-y-6 before:absolute before:left-[5px] before:top-2 before:h-full before:w-px before:bg-gradient-to-b before:from-[rgb(var(--accent-1)/0.4)] before:to-transparent md:before:left-[5px]">
            {EXPERIENCES.map((exp, i) => (
              <Reveal key={exp.company} delay={i * 0.05}>
                <ExperienceCard exp={exp} index={i} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Side: Education, Certs, Languages */}
        <div className="space-y-6">
          <Reveal>
            <div className="rounded-2xl glass p-6">
              <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-[var(--text)]"><GraduationCap size={18} className="text-accent" /> Education</h3>
              <div className="space-y-4">
                {EDUCATION.map((e) => (
                  <div key={e.degree} className="border-l-2 border-[rgb(var(--accent-1)/0.3)] pl-3">
                    <div className="text-sm font-bold text-[var(--text)]">{e.degree}</div>
                    <div className="text-xs text-accent">{e.institution}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{e.location} · {e.period}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="rounded-2xl glass p-6">
              <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-[var(--text)]"><Award size={18} className="text-accent" /> Certifications</h3>
              <div className="space-y-2.5">
                {CERTIFICATIONS.map((c) => (
                  <div key={c.title} className="flex items-center justify-between gap-2">
                    <div className="text-xs text-[var(--text)]">{c.title}</div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-mono uppercase ${c.status === 'Completed' ? 'bg-emerald-400/15 text-emerald-400' : 'bg-amber-400/15 text-amber-400'}`}>
                      {c.status === 'Completed' ? <CheckCircle2 size={10} className="inline" /> : <Clock size={10} className="inline" />} {c.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl glass p-6">
              <h3 className="mb-4 flex items-center gap-2 font-display font-bold text-[var(--text)]"><LangIcon size={18} className="text-accent" /> Languages</h3>
              <div className="space-y-3">
                {LANGUAGES.map((l) => {
                  const ref = React.useRef(null);
                  const inView = useInView(ref, { once: true });
                  return (
                    <div key={l.name} ref={ref}>
                      <div className="mb-1 flex justify-between text-xs"><span className="text-[var(--text)]">{l.name}</span><span className="text-[var(--text-muted)]">{l.level}</span></div>
                      <div className="skill-bar-track h-1.5 overflow-hidden rounded-full">
                        <motion.div className="skill-bar-fill h-full rounded-full" initial={{ width: 0 }} animate={inView ? { width: `${l.pct}%` } : {}} transition={{ duration: 1 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
