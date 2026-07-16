import React from 'react';
import { STATS, TARGET_COMPANIES } from '../data';
import { Reveal, CountUp, OscilloscopeDial } from './ui';
import { DynIcon as Icon } from './iconMap';

export default function Stats() {
  const logos = [...TARGET_COMPANIES, ...TARGET_COMPANIES];
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 md:px-8">
      {/* Stats — OriginKit interlocking hairline grid */}
      <Reveal>
        <div className="card-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 [&>*:nth-child(3n)]:border-r-0 md:[&>*:nth-child(3n)]:border-r lg:[&>*:nth-child(6n)]:border-r-0">
          {STATS.map((s) => (
            <div key={s.id} className="group top-sheen p-6 text-center">
              <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[rgb(var(--accent-1)/0.12)] text-accent transition group-hover:gradient-accent group-hover:text-white">
                <Icon name={s.icon} />
              </div>
              <div className="font-display text-2xl font-extrabold text-gradient md:text-3xl">
                <CountUp to={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-[11px] font-medium text-[var(--text-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Target companies marquee */}
      <Reveal delay={0.1}>
        <div className="mt-16 text-center">
          <div className="mb-4 flex justify-center">
            <OscilloscopeDial size={104} />
          </div>
          <div className="dot-label mb-6 justify-center">Industries &amp; teams I build for</div>
          <div className="marquee-mask relative overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-10">
              {logos.map((name, i) => (
                <span key={i} className="whitespace-nowrap font-display text-lg font-bold text-[var(--text-muted)] opacity-50 transition hover:opacity-100 hover:text-accent md:text-2xl">
                  {name}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-5 text-[10px] text-[var(--text-muted)]">
            Target companies &amp; sectors — shown to indicate domain focus, not endorsement.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
