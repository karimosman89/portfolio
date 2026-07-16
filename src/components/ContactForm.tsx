import React, { useState } from 'react';
import { PERSONAL_INFO, SERVICES, FAQS } from '../data';
import { SectionHeading, Reveal } from './ui';
import {
  Send, CheckCircle2, AlertCircle, Loader2, Mail, Phone, MapPin, Calendar,
  Linkedin, Github, ChevronDown, ShieldCheck, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BUDGETS = ['< €5k', '€5k – €15k', '€15k – €50k', '€50k+', 'Not sure yet'];
const TIMELINES = ['ASAP', '1–4 weeks', '1–3 months', '3+ months', 'Exploring'];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', company: '', country: '', email: '', phone: '',
    budget: '', timeline: '', service: '', industry: '', meetingTime: '', message: '', honeypot: '',
  });
  const [captcha, setCaptcha] = useState('');
  const [captchaQ] = useState(() => { const a = Math.floor(Math.random() * 8) + 2, b = Math.floor(Math.random() * 8) + 2; return { a, b, ans: a + b }; });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [aiReply, setAiReply] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg('');
    if (form.honeypot) return; // bot trap
    if (parseInt(captcha) !== captchaQ.ans) { setStatus('error'); setErrMsg('Incorrect verification answer. Please try again.'); return; }
    if (!form.name || !form.email || !form.message) { setStatus('error'); setErrMsg('Please fill in name, email and message.'); return; }
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, company: form.company,
          projectType: form.service || form.industry || 'General inquiry',
          budget: form.budget,
          message: `${form.message}\n\n---\nCountry: ${form.country} | Phone: ${form.phone} | Timeline: ${form.timeline} | Preferred meeting: ${form.meetingTime} | Industry: ${form.industry}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setAiReply(data.aiAssessment || '');
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err.message || 'Something went wrong. Email me directly.');
    }
  };

  const inputCls = 'w-full rounded-xl glass px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 ring-accent transition';

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Let's Build"
        title={<>Start your <span className="text-gradient">AI project</span></>}
        subtitle="Tell me about your goals. I reply within one business day with a preliminary technical assessment."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: contact info + calendly + FAQ */}
        <div className="space-y-5 lg:col-span-2">
          <Reveal>
            <div className="rounded-2xl glass p-6">
              <h3 className="font-display font-bold text-[var(--text)]">Direct channels</h3>
              <div className="mt-4 space-y-3">
                {[
                  { icon: Mail, label: 'Email', value: PERSONAL_INFO.email, href: `mailto:${PERSONAL_INFO.email}` },
                  { icon: Phone, label: 'Italy', value: PERSONAL_INFO.phoneItaly, href: `tel:${PERSONAL_INFO.phoneItaly.replace(/\s/g, '')}` },
                  { icon: Phone, label: 'France', value: PERSONAL_INFO.phoneFrance, href: `tel:${PERSONAL_INFO.phoneFrance.replace(/\s/g, '')}` },
                  { icon: MapPin, label: 'Location', value: 'Siena, Italy · Remote worldwide' },
                ].map((c) => (
                  <a key={c.label} href={c.href} className="flex items-center gap-3 rounded-xl bg-[rgb(var(--border)/0.04)] p-3 transition hover:bg-[rgb(var(--accent-1)/0.08)]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(var(--accent-1)/0.12)] text-accent"><c.icon size={15} /></span>
                    <div><div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{c.label}</div><div className="text-sm font-medium text-[var(--text)]">{c.value}</div></div>
                  </a>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl glass py-2.5 text-xs font-bold text-[var(--text)] hover:text-accent"><Linkedin size={14} /> LinkedIn</a>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl glass py-2.5 text-xs font-bold text-[var(--text)] hover:text-accent"><Github size={14} /> GitHub</a>
              </div>
            </div>
          </Reveal>

          {/* Calendly placeholder */}
          <Reveal delay={0.05}>
            <div className="rounded-2xl glass-strong p-6 text-center">
              <Calendar className="mx-auto mb-3 text-accent" size={28} />
              <h3 className="font-display font-bold text-[var(--text)]">Prefer to talk?</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Book a free 30-minute discovery call.</p>
              {/* Calendly inline embed placeholder — replace data-url with your Calendly link */}
              <div className="calendly-inline-widget mt-4" data-url={PERSONAL_INFO.calendly} />
              <a href={PERSONAL_INFO.calendly} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold">
                <Calendar size={15} /> Open Calendar
              </a>
            </div>
          </Reveal>

          {/* FAQ */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl glass p-6">
              <h3 className="mb-3 font-display font-bold text-[var(--text)]">FAQ</h3>
              <div className="space-y-1">
                {FAQS.map((f, i) => (
                  <div key={i} className="border-b border-[rgb(var(--border)/0.06)] last:border-0">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-2 py-3 text-left text-sm font-medium text-[var(--text)]">
                      {f.q} <ChevronDown size={16} className={`shrink-0 text-[var(--text-muted)] transition ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pb-3 text-sm font-light text-[var(--text-muted)]">{f.a}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: form */}
        <Reveal delay={0.05} className="lg:col-span-3">
          <div className="rounded-2xl glass-strong p-6 md:p-8">
            {status === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400"><CheckCircle2 size={28} /></div>
                <h3 className="font-display text-xl font-bold text-[var(--text)]">Message received!</h3>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Thanks, {form.name.split(' ')[0]}. I'll reply within one business day.</p>
                {aiReply && (
                  <div className="mt-5 rounded-xl bg-[rgb(var(--accent-1)/0.06)] p-4 text-left text-sm text-[var(--text-muted)]">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent"><Sparkles size={12} /> Instant AI assessment</div>
                    <div dangerouslySetInnerHTML={{ __html: aiReply.replace(/\*\*(.+?)\*\*/g, '<strong class="text-[var(--text)]">$1</strong>').replace(/\n/g, '<br/>') }} />
                  </div>
                )}
                <button onClick={() => { setStatus('idle'); setForm({ ...form, message: '' }); }} className="mt-5 text-sm font-bold text-accent">Send another →</button>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {/* honeypot */}
                <input type="text" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={(e) => set('honeypot', e.target.value)} className="hidden" aria-hidden="true" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Name *</label><input required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder="Jane Doe" /></div>
                  <div><label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Company</label><input value={form.company} onChange={(e) => set('company', e.target.value)} className={inputCls} placeholder="Acme Inc." /></div>
                  <div><label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Email *</label><input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} placeholder="jane@acme.com" /></div>
                  <div><label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Phone</label><input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} placeholder="+1 555 000 0000" /></div>
                  <div><label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Country</label><input value={form.country} onChange={(e) => set('country', e.target.value)} className={inputCls} placeholder="Germany" /></div>
                  <div><label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Industry</label><input value={form.industry} onChange={(e) => set('industry', e.target.value)} className={inputCls} placeholder="Manufacturing" /></div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Service interested in</label>
                    <select value={form.service} onChange={(e) => set('service', e.target.value)} className={inputCls}>
                      <option value="">Select…</option>
                      {SERVICES.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Budget</label>
                    <select value={form.budget} onChange={(e) => set('budget', e.target.value)} className={inputCls}>
                      <option value="">Select…</option>
                      {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Timeline</label>
                    <select value={form.timeline} onChange={(e) => set('timeline', e.target.value)} className={inputCls}>
                      <option value="">Select…</option>
                      {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Preferred meeting time</label><input value={form.meetingTime} onChange={(e) => set('meetingTime', e.target.value)} className={inputCls} placeholder="Weekdays, CET afternoons" /></div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-muted)]">Project description *</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} className={inputCls} placeholder="Describe your goals, challenges and what success looks like…" />
                </div>

                {/* captcha */}
                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-accent" />
                  <label className="text-xs text-[var(--text-muted)]">Spam check: what is <strong className="text-[var(--text)]">{captchaQ.a} + {captchaQ.b}</strong>?</label>
                  <input value={captcha} onChange={(e) => setCaptcha(e.target.value)} className="w-20 rounded-lg glass px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 ring-accent" placeholder="?" />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 rounded-lg bg-rose-400/10 px-4 py-2.5 text-sm text-rose-400"><AlertCircle size={15} /> {errMsg}</div>
                )}

                <button type="submit" disabled={status === 'loading'} className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold disabled:opacity-60">
                  {status === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <>Send Project Inquiry <Send size={15} /></>}
                </button>
                <p className="text-center text-[10px] text-[var(--text-muted)]">🔒 Your details are handled securely. Submissions are stored and forwarded to Karim's inbox.</p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
