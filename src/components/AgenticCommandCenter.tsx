import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, Search, Sparkles, Terminal, MessageSquare, Zap, X, CornerDownLeft } from 'lucide-react';

const suggestedQueries = [
  "Show me computer vision projects",
  "What is Karim's experience with YOLO?",
  "Navigate to contact section",
  "Explain the autonomous drone POC",
  "Download resume"
];

export default function AgenticCommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleCommand = (cmd: string) => {
    setIsProcessing(true);
    setResponse(null);
    
    // Simulate AI Processing
    setTimeout(() => {
      const lowerCmd = cmd.toLowerCase();
      let actionFound = false;

      if (lowerCmd.includes('vision') || lowerCmd.includes('cv')) {
        const event = new CustomEvent('switch-tab', { detail: { id: 'capabilities', scrollToTop: false } });
        window.dispatchEvent(event);
        setTimeout(() => {
          document.getElementById('cv-showcase')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
        setResponse("Navigating to Computer Vision Showcase...");
        actionFound = true;
      } else if (lowerCmd.includes('contact')) {
        const event = new CustomEvent('switch-tab', { detail: { id: 'contact', scrollToTop: true } });
        window.dispatchEvent(event);
        setResponse("Opening contact channels...");
        actionFound = true;
      } else if (lowerCmd.includes('resume') || lowerCmd.includes('download')) {
        window.print();
        setResponse("Opening print/export dialog for resume...");
        actionFound = true;
      } else if (lowerCmd.includes('experience')) {
        const event = new CustomEvent('switch-tab', { detail: { id: 'experience', scrollToTop: true } });
        window.dispatchEvent(event);
        setResponse("Showing career timeline and skills...");
        actionFound = true;
      }

      if (!actionFound) {
        setResponse("I'm sorry, I couldn't find a direct action for that. Try asking about 'projects', 'contact', or 'resume'.");
      }

      setIsProcessing(false);
      if (actionFound) {
        setTimeout(() => setIsOpen(false), 2000);
      }
    }, 1000);
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 flex items-center justify-center group"
      >
        <div className="absolute -top-12 right-0 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
          ⌘ + K
        </div>
        <Command size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />

            {/* Command Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                <Search className="text-zinc-400" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask the Agentic Concierge... (e.g. 'Show me CV projects')"
                  className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-white placeholder-zinc-500"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommand(query)}
                />
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-[10px] font-mono text-zinc-500">
                  <CornerDownLeft size={10} />
                  <span>ENTER</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                  <X size={18} className="text-zinc-400" />
                </button>
              </div>

              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {isProcessing ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="text-indigo-600 dark:text-indigo-400"
                    >
                      <Sparkles size={32} />
                    </motion.div>
                    <p className="text-sm text-zinc-500 animate-pulse">Agent is thinking...</p>
                  </div>
                ) : response ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800"
                  >
                    <div className="flex items-start gap-3">
                      <Terminal size={18} className="text-indigo-600 dark:text-indigo-400 mt-0.5" />
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium">{response}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Suggested Actions</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {suggestedQueries.map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setQuery(q);
                              handleCommand(q);
                            }}
                            className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all text-left group"
                          >
                            <MessageSquare size={16} className="text-zinc-400 group-hover:text-indigo-500" />
                            <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">{q}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Zap size={14} className="text-amber-500" />
                        <span className="text-[10px] font-medium">Agentic Engine v2.0.0 — Multimodal Ready</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
