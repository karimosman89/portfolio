import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, User, Bot, Loader2, RefreshCw } from 'lucide-react';

interface ChatMessage { sender: 'user' | 'assistant'; text: string; timestamp: string; }

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const GREETING: ChatMessage = {
  sender: 'assistant',
  text: "👋 Hi! I'm Karim's AI assistant. Ask me about his projects, skills, services, pricing, availability — or how he can help your team ship production AI.",
  timestamp: now(),
};

const PRESETS = [
  { text: 'What services do you offer?', label: 'Services' },
  { text: 'Tell me about your best projects.', label: 'Projects' },
  { text: 'What is your experience with LLMs, RAG and agents?', label: 'AI Skills' },
  { text: 'Are you available for freelance / B2B work?', label: 'Availability' },
  { text: 'How does pricing and engagement work?', label: 'Pricing' },
  { text: 'How can I contact or book a call with you?', label: 'Contact' },
];

export default function QuickChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next = [...messages, { sender: 'user' as const, text, timestamp: now() }];
    setMessages(next); setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map((m) => ({ sender: m.sender === 'user' ? 'user' : 'model', text: m.text })) }),
      });
      if (!res.ok) throw new Error('timeout');
      const data = await res.json();
      setMessages((p) => [...p, { sender: 'assistant', text: data.text || 'I could not retrieve a response.', timestamp: now() }]);
    } catch {
      setMessages((p) => [...p, { sender: 'assistant', text: "I couldn't reach the AI endpoint right now. Reach Karim directly at karim.programmer2020@gmail.com.", timestamp: now() }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40 no-print">
        <motion.button
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          aria-label="Open AI assistant"
          className="btn-primary relative flex h-14 w-14 items-center justify-center rounded-full"
        >
          <span className="absolute -inset-1 animate-pulse-ring rounded-full bg-[rgb(var(--accent-1)/0.4)]" />
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} /></motion.div>
              : <motion.div key="c" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative"><MessageSquare size={22} /><span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400" /></motion.div>}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black no-print" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full flex-col glass-strong sm:w-[420px] no-print"
            >
              {/* header */}
              <div className="flex items-center justify-between border-b border-[rgb(var(--border)/0.08)] p-5">
                <div className="flex items-center gap-3">
                  <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl gradient-accent text-white">
                    <Bot size={18} />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg)] bg-emerald-400" />
                  </div>
                  <div>
                    <h3 className="flex items-center gap-1 font-display text-sm font-bold text-[var(--text)]">Karim's AI Assistant <Sparkles size={11} className="text-accent" /></h3>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Powered by Gemini · Online</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setMessages([GREETING])} aria-label="Reset" className="inline-flex h-8 w-8 items-center justify-center rounded-lg glass text-[var(--text-muted)] hover:text-accent"><RefreshCw size={13} /></button>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="inline-flex h-8 w-8 items-center justify-center rounded-lg glass text-[var(--text-muted)] hover:text-accent"><X size={15} /></button>
                </div>
              </div>

              {/* messages */}
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${m.sender === 'user' ? 'glass text-[var(--text)]' : 'gradient-accent text-white'}`}>
                        {m.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                      </div>
                      <div>
                        <div className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${m.sender === 'user' ? 'gradient-accent font-medium text-white' : 'glass text-[var(--text)]'}`}>
                          <p className="whitespace-pre-line font-light" dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                        <div className={`mt-1 px-1 font-mono text-[8px] text-[var(--text-muted)] ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>{m.timestamp}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start"><div className="flex items-center gap-2.5"><div className="inline-flex h-7 w-7 items-center justify-center rounded-lg gradient-accent text-white"><Loader2 size={12} className="animate-spin" /></div><div className="rounded-2xl glass px-4 py-2.5 text-xs text-[var(--text-muted)]">Thinking…</div></div></div>
                )}
                <div ref={endRef} />
              </div>

              {/* presets */}
              <div className="border-t border-[rgb(var(--border)/0.08)] p-4">
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((p) => (
                    <button key={p.label} onClick={() => send(p.text)} disabled={loading}
                      className="rounded-lg glass px-2.5 py-1.5 text-[10px] font-medium text-[var(--text-muted)] transition hover:text-accent disabled:opacity-50">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* input */}
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-[rgb(var(--border)/0.08)] p-4">
                <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} disabled={loading}
                  placeholder="Ask anything…"
                  className="flex-1 rounded-xl glass px-4 py-2.5 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 ring-accent" />
                <button type="submit" disabled={!input.trim() || loading} className="btn-primary inline-flex items-center justify-center rounded-xl px-4 disabled:opacity-40"><Send size={14} /></button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
