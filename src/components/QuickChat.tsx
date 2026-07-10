import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, User, Bot, HelpCircle, Loader2, RefreshCw, Milestone, Briefcase, Zap } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function QuickChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: "Hi there! I'm Karim's Virtual ML Co-pilot. Ask me anything about his technical background, architectural experience, or project availability!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when messages list changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && chatInputRef.current) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const presetQuestions = [
    { text: "Are you open to new projects or jobs?", label: "Availability" },
    { text: "What is your experience with LLMs and RAG?", label: "GenAI Stack" },
    { text: "What's your work history at Baker Hughes?", label: "Baker Hughes" },
    { text: "Where are you based and can you relocate?", label: "Location" }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Map frontend sender values to backend expectations: m.sender === 'user' ? 'user' : 'model'
      const backendMessages = newMessages.map(m => ({
        sender: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: backendMessages }),
      });

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch (e) {
          errData = { error: 'Inference node timed out.' };
        }
        throw new Error(errData.error || 'Inference node timed out.');
      }

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: data.text || "I was unable to retrieve a model response. Please check again shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `Connection Error: ${err.message}. If deploying to Vercel, please ensure GEMINI_API_KEY is configured in your Environment Variables. Karim's email is karim.programmer2020@gmail.com for direct messaging!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const resetChat = () => {
    setMessages([
      {
        sender: 'assistant',
        text: "Hi there! I'm Karim's Virtual ML Co-pilot. Ask me anything about his technical background, architectural experience, or project availability!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-950/40 hover:bg-indigo-500 transition-colors focus:outline-none"
          style={{
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
          }}
        >
          {/* Subtle Outer Radar Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-indigo-500/20 animate-ping opacity-75" />
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="relative flex items-center justify-center"
              >
                <MessageSquare size={22} />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Slide-out Panel Overlay & Container */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop overlay (clickable to close) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 print:hidden"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col print:hidden"
            >
              {/* Header */}
              <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150/40 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                    <Bot size={18} />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-1">
                      Virtual Assistant
                      <Sparkles size={11} className="text-indigo-500 animate-pulse" />
                    </h3>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
                      <span>Gemini 3.5 Flash Active</span>
                      <span className="text-zinc-300 dark:text-zinc-700">|</span>
                      <span>Karim’s Co-pilot</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={resetChat}
                    title="Reset dialogue thread"
                    className="cursor-pointer h-7 w-7 flex items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-550 dark:text-zinc-400 transition"
                  >
                    <RefreshCw size={12} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="cursor-pointer h-7 w-7 flex items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-550 dark:text-zinc-400 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50/20 dark:bg-zinc-950/10">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded border text-[10px] font-mono font-bold ${
                        msg.sender === 'user'
                          ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-150/50 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {msg.sender === 'user' ? <User size={11} /> : <Bot size={11} />}
                      </div>

                      <div className="space-y-1">
                        <div
                          className={`rounded-lg px-4 py-2.5 text-xs leading-relaxed border shadow-sm ${
                            msg.sender === 'user'
                              ? 'bg-indigo-600 border-indigo-700 text-white font-medium'
                              : 'bg-white dark:bg-zinc-900 border-zinc-150 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
                          }`}
                        >
                          <p className="whitespace-pre-line font-light">{msg.text}</p>
                        </div>
                        <div className={`text-[9px] font-mono text-zinc-400 dark:text-zinc-500 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2.5 max-w-[85%]">
                      <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded border border-indigo-150/40 dark:border-indigo-900/40 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                        <Loader2 size={11} className="animate-spin" />
                      </div>
                      <div className="rounded-lg px-4 py-2.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                        <span>Co-pilot is reasoning...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions / Prompt Chips */}
              <div className="p-4 border-t border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-950/20">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider mb-2">
                  <HelpCircle size={11} className="text-indigo-500" />
                  <span>Frequently Asked Questions</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {presetQuestions.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => handleSendMessage(q.text)}
                      disabled={isLoading}
                      className="cursor-pointer text-[10px] px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500/30 dark:hover:border-indigo-500/50 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/10 transition-colors text-left disabled:opacity-50"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form Footer */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <form onSubmit={handleFormSubmit} className="flex gap-2">
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about MLOps, RAG, availability, etc..."
                    disabled={isLoading}
                    className="flex-1 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/30 px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition font-sans text-xs"
                  />
                  <motion.button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    whileHover={{ scale: inputValue.trim() ? 1.05 : 1 }}
                    whileTap={{ scale: inputValue.trim() ? 0.95 : 1 }}
                    className="cursor-pointer px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold font-mono text-xs flex items-center justify-center transition-colors disabled:opacity-40"
                  >
                    <Send size={13} />
                  </motion.button>
                </form>
                <p className="text-[9px] text-zinc-450 dark:text-zinc-500 text-center font-mono mt-2 leading-tight">
                  Karim's Personal Agent can check project parameters, tech experience or connect live.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
