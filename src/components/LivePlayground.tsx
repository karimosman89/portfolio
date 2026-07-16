import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeading, Reveal } from './ui';
import {
  Send, Loader2, Upload, ImageIcon, ScrollText, Search, Bot, Scissors, X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

/** Tiny, safe markdown → HTML renderer for **bold**, `code`, bullets and line breaks. */
function renderMarkdown(src: string): string {
  const esc = src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return esc
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-[rgb(var(--accent-1)/0.14)] px-1 py-0.5 text-accent">$1</code>')
    .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="my-2 list-disc space-y-1 pl-5">$1</ul>')
    .replace(/\n{2,}/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

function Markdown({ text }: { text: string }) {
  return (
    <div
      className="text-sm leading-relaxed text-[var(--text)]"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
    />
  );
}

function DemoBadge() {
  return (
    <span className="ml-2 rounded-md bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide text-amber-400">
      demo mode
    </span>
  );
}

/* ================================================================== */
/*  1. RAG — grounded assistant                                        */
/* ================================================================== */

type Msg = { sender: 'user' | 'bot'; text: string };

const RAG_SUGGESTIONS = [
  'What are Karim\u2019s key achievements?',
  'What is his AI tech stack?',
  'Is he available for freelance work?',
];

function RagDemo() {
  const [messages, setMessages] = useState<Msg[]>([
    { sender: 'bot', text: 'Ask me anything about Karim\u2019s experience — I answer using **Retrieval-Augmented Generation** grounded on his CV.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next = [...messages, { sender: 'user' as const, text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (data.demo) setIsDemo(true);
      setMessages((m) => [...m, { sender: 'bot', text: data.text || data.error || 'No response.' }]);
    } catch {
      setMessages((m) => [...m, { sender: 'bot', text: 'Network error — the AI service is unreachable right now.' }]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 9e9, behavior: 'smooth' }));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
        <Search size={13} className="text-accent" /> Retrieval-Augmented Generation · grounded on CV
        {isDemo && <DemoBadge />}
      </div>
      <div ref={scrollRef} className="mb-3 max-h-72 min-h-[16rem] space-y-3 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                m.sender === 'user'
                  ? 'gradient-accent text-white'
                  : 'glass text-[var(--text)]'
              }`}
            >
              {m.sender === 'bot' ? <Markdown text={m.text} /> : <span className="text-sm">{m.text}</span>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 size={15} className="animate-spin text-accent" /> Retrieving &amp; generating…
          </div>
        )}
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {RAG_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={loading}
            className="rounded-full border border-accent bg-[rgb(var(--accent-1)/0.06)] px-3 py-1 text-xs text-accent transition hover:bg-[rgb(var(--accent-1)/0.14)] disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question…"
          className="flex-1 rounded-xl border border-[rgb(var(--border)/0.5)] bg-[rgb(var(--surface)/0.6)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl gradient-accent text-white transition disabled:opacity-40"
          aria-label="Send"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}

/* ================================================================== */
/*  2. Long-context — chunking + summarization                         */
/* ================================================================== */

const SAMPLE_TEXT =
  'Retrieval-Augmented Generation (RAG) grounds a large language model in an external knowledge base so that answers stay factual and up to date. ' +
  'A production RAG pipeline ingests documents, splits them into overlapping chunks, embeds each chunk into a vector store, and at query time retrieves the most relevant chunks to condition the model. ' +
  'Chunking strategy — size and overlap — directly affects retrieval quality: chunks that are too large dilute relevance, while chunks that are too small lose context. ' +
  'Karim designs these pipelines with observability, caching and evaluation baked in, cutting hallucinations and latency while keeping cost predictable at scale.';

type Chunk = { id: number; start: number; end: number; content: string };

function ChunkingDemo() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [chunkSize, setChunkSize] = useState(140);
  const [overlap, setOverlap] = useState(30);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [meta, setMeta] = useState<{ numChunks: number; originalLength: number } | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const run = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setIsDemo(false);
    try {
      const res = await fetch('/api/summarize-chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, chunkSize, chunkOverlap: overlap }),
      });
      const data = await res.json();
      if (data.demo) setIsDemo(true);
      setSummary(data.summary || data.error || '');
      setChunks(data.chunks || []);
      setMeta(data.metadata || null);
    } catch {
      setSummary('Network error — the processing service is unreachable right now.');
    } finally {
      setLoading(false);
    }
  };

  const palette = ['var(--accent-1)', 'var(--accent-2)', 'var(--accent-3)'];

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
        <Scissors size={13} className="text-accent" /> Document chunking + LLM summarization
        {isDemo && <DemoBadge />}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-xl border border-[rgb(var(--border)/0.5)] bg-[rgb(var(--surface)/0.6)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-accent"
        placeholder="Paste any long text…"
      />

      <div className="mt-3 grid grid-cols-2 gap-4">
        <label className="text-xs text-[var(--text-muted)]">
          Chunk size: <span className="font-mono text-accent">{chunkSize}</span>
          <input type="range" min={60} max={400} step={20} value={chunkSize}
            onChange={(e) => setChunkSize(+e.target.value)} className="mt-1 w-full accent-current text-accent" />
        </label>
        <label className="text-xs text-[var(--text-muted)]">
          Overlap: <span className="font-mono text-accent">{overlap}</span>
          <input type="range" min={0} max={100} step={10} value={overlap}
            onChange={(e) => setOverlap(+e.target.value)} className="mt-1 w-full accent-current text-accent" />
        </label>
      </div>

      <button
        onClick={run}
        disabled={loading || !text.trim()}
        className="btn-primary mt-4 inline-flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <ScrollText size={16} />}
        {loading ? 'Processing…' : 'Chunk & summarize'}
      </button>

      {meta && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-4 text-xs font-mono text-[var(--text-muted)]">
            <span>{meta.originalLength} chars</span>
            <span className="text-accent">{meta.numChunks} chunks</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {chunks.map((c, i) => (
              <span
                key={c.id}
                title={c.content}
                className="max-w-[220px] truncate rounded-md px-2 py-1 text-[11px] font-mono"
                style={{
                  background: `rgb(${palette[i % palette.length]} / 0.12)`,
                  color: `rgb(${palette[i % palette.length]})`,
                }}
              >
                #{c.id} · {c.content.slice(0, 26)}…
              </span>
            ))}
          </div>

          {summary && (
            <div className="rounded-xl glass p-4">
              <div className="mb-1 text-[10px] font-mono uppercase tracking-wide text-[var(--text-muted)]">AI Summary</div>
              <Markdown text={summary} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  3. Multimodal — vision analysis                                    */
/* ================================================================== */

function VisionDemo() {
  const [preview, setPreview] = useState<string | null>(null);
  const [b64, setB64] = useState<string | null>(null);
  const [mime, setMime] = useState('');
  const [prompt, setPrompt] = useState('Describe this image in detail: objects, scene, colours and any text.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 4 * 1024 * 1024) { setResult('Please choose an image under 4 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setB64(dataUrl.split(',')[1]);
      setMime(file.type);
      setResult('');
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!b64 || loading) return;
    setLoading(true);
    setIsDemo(false);
    try {
      const res = await fetch('/api/gemini/analyze-multimodal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: b64, mimeType: mime, prompt }),
      });
      const data = await res.json();
      if (data.demo) setIsDemo(true);
      setResult(data.text || data.error || 'No analysis.');
    } catch {
      setResult('Network error — the vision service is unreachable right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
        <ImageIcon size={13} className="text-accent" /> Multimodal vision · image understanding
        {isDemo && <DemoBadge />}
      </div>

      {!preview ? (
        <button
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); }}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[rgb(var(--border)/0.6)] text-[var(--text-muted)] transition hover:border-accent hover:text-accent"
        >
          <Upload size={22} />
          <span className="text-sm">Drop an image or click to upload</span>
          <span className="text-[11px]">PNG / JPG · under 4 MB</span>
        </button>
      ) : (
        <div className="relative">
          <img src={preview} alt="Upload preview" className="max-h-56 w-full rounded-xl object-contain glass p-2" />
          <button
            onClick={() => { setPreview(null); setB64(null); setResult(''); }}
            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
            aria-label="Remove image"
          >
            <X size={15} />
          </button>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mt-3 w-full rounded-xl border border-[rgb(var(--border)/0.5)] bg-[rgb(var(--surface)/0.6)] px-4 py-2.5 text-sm text-[var(--text)] outline-none focus:border-accent"
        placeholder="What should the model look for?"
      />

      <button
        onClick={analyze}
        disabled={loading || !b64}
        className="btn-primary mt-3 inline-flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
        {loading ? 'Analyzing…' : 'Analyze image'}
      </button>

      {result && (
        <div className="mt-4 rounded-xl glass p-4">
          <div className="mb-1 text-[10px] font-mono uppercase tracking-wide text-[var(--text-muted)]">Model output</div>
          <Markdown text={result} />
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Section shell with tabs                                            */
/* ================================================================== */

const TABS = [
  { id: 'rag', label: 'RAG Assistant', icon: Bot, desc: 'Grounded Q&A over a knowledge base', Comp: RagDemo },
  { id: 'chunk', label: 'Long-Context', icon: ScrollText, desc: 'Chunking + summarization pipeline', Comp: ChunkingDemo },
  { id: 'vision', label: 'Multimodal Vision', icon: ImageIcon, desc: 'Image understanding with Gemini', Comp: VisionDemo },
] as const;

export default function LivePlayground() {
  const [active, setActive] = useState<(typeof TABS)[number]['id']>('rag');
  const ActiveComp = TABS.find((t) => t.id === active)!.Comp;

  return (
    <section id="playground" className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeading
        eyebrow="Live Playground"
        title={<>Working <span className="text-gradient">AI demos</span>, not slideware</>}
        subtitle="These are real endpoints running on this site — try them live. Each degrades gracefully into a labelled demo when no API key is configured."
      />

      <Reveal>
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          {/* Tab rail */}
          <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
            {TABS.map((t) => {
              const TIcon = t.icon;
              const on = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`group flex min-w-[220px] items-start gap-3 rounded-2xl border p-4 text-left transition lg:min-w-0 ${
                    on
                      ? 'border-accent bg-[rgb(var(--accent-1)/0.08)]'
                      : 'border-[rgb(var(--border)/0.4)] glass hover:border-accent'
                  }`}
                >
                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${on ? 'gradient-accent text-white' : 'bg-[rgb(var(--accent-1)/0.12)] text-accent'}`}>
                    <TIcon size={18} />
                  </span>
                  <span>
                    <span className="block font-display font-bold text-[var(--text)]">{t.label}</span>
                    <span className="mt-0.5 block text-xs font-light leading-snug text-[var(--text-muted)]">{t.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active demo panel */}
          <div className="rounded-2xl glass-strong p-5 md:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ActiveComp />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
