import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, Bot, User, ShieldCheck, Database, RefreshCw, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export default function MiniAgentPlayground() {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-1',
      role: 'system',
      content: 'Initializing Enterprise Agent Simulator...',
      timestamp: new Date()
    },
    {
      id: 'system-2',
      role: 'system',
      content: 'Connected to Mock RAG Vector Store & Postgres DB.',
      timestamp: new Date()
    },
    {
      id: 'assistant-1',
      role: 'assistant',
      content: 'Hello. I am the autonomous assistant demonstration. Try asking me to "Analyze the latest Q3 revenue logs" or "Run a security audit on the VPC".',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Agent Reasoning Pipeline
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-sys',
        role: 'system',
        content: `[TOOL_CALL: search_vector_db] Querying for "${newMsg.content.substring(0, 15)}..."`,
        timestamp: new Date()
      }]);
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '-resp',
          role: 'assistant',
          content: 'This is a simulated response demonstrating agentic behavior. In a real environment, I would have just retrieved secure data via tool-calling, verified permissions via Guardrails, and synthesized this answer using a fine-tuned enterprise LLM.',
          timestamp: new Date()
        }]);
      }, 1500);
    }, 800);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <Zap size={10} className="animate-pulse" />
            <span>Live Interactive Demo</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
            Agentic Playground
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Interact with a simulated enterprise agent. Watch it securely reason, access mock internal tools, and format responses according to strict compliance boundaries.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden flex flex-col max-w-4xl mx-auto h-[400px] sm:h-[500px]">
        {/* Terminal Header */}
        <div className="border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
            <Terminal size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>SECURE_AGENT_SESSION</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-zinc-500">
              <ShieldCheck size={10} className="text-emerald-500" />
              <span>SOC2 Audit Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>VPC Connected</span>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/30 dark:bg-zinc-900/20 font-sans text-sm">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role !== 'user' && (
                  <div className="shrink-0 mt-1 w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    {msg.role === 'system' ? <Database size={13} /> : <Bot size={14} />}
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' 
                    : msg.role === 'system'
                      ? 'bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono text-xs'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm'
                }`}>
                  {msg.role === 'system' && <span className="font-bold text-indigo-500 mr-2">SYS_LOG:</span>}
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="shrink-0 mt-1 w-7 h-7 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                    <User size={14} />
                  </div>
                )}
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 justify-start">
                <div className="shrink-0 mt-1 w-7 h-7 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <RefreshCw size={12} className="animate-spin" />
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-150" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800/80">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Deploy a command to the agent..."
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-4 pr-12 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-sans"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50 transition-colors"
            >
              <Send size={14} />
            </button>
          </form>
          <div className="text-center mt-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            Data is strictly isolated and not retained after session termination.
          </div>
        </div>
      </div>
    </section>
  );
}
