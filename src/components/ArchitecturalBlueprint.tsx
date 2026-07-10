import React from 'react';
import { motion } from 'motion/react';
import { Database, Server, Cpu, Route, ArrowRight, Monitor, Cloud, Activity } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ArchitecturalBlueprint() {
  const { lang } = useLanguage();

  const title = lang === 'en' ? 'Enterprise AI Architecture Blueprint' : (lang === 'it' ? 'Planimetria dell\'Architettura AI' : 'Plan d\'Architecture IA');
  const subtitle = lang === 'en' ? 'How systems are built for scale and security.' : (lang === 'it' ? 'Come i sistemi sono costruiti per la scalabilità.' : 'Comment les systèmes sont conçus pour évoluer.');

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <Route size={10} className="text-indigo-500" />
            <span>02 / System Topology</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
            {title}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 p-8 shadow-sm overflow-hidden">
        {/* Architectural Blueprint Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          
          {/* User Input Layer */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg border-2 border-indigo-200 dark:border-indigo-900/50 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center">
              <Monitor size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-3 text-center">
              <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">Client Interface</span>
              <span className="block text-[10px] font-mono text-zinc-500">React / Next.js</span>
            </div>
          </motion.div>

          <ArrowRight size={20} className="text-zinc-300 dark:text-zinc-700 rotate-90 md:rotate-0" />

          {/* API Gateway & Load Balancer Layer */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg border-2 border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center">
              <Cloud size={24} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-3 text-center">
              <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">API Gateway</span>
              <span className="block text-[10px] font-mono text-zinc-500">Rate Limiting & Auth</span>
            </div>
          </motion.div>

          <ArrowRight size={20} className="text-zinc-300 dark:text-zinc-700 rotate-90 md:rotate-0" />

          {/* Vector DB / RAG Layer */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col items-center relative">
            <div className="w-16 h-16 rounded-lg border-2 border-amber-200 dark:border-amber-900/50 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center">
              <Database size={24} className="text-amber-600 dark:text-amber-500" />
            </div>
            <div className="mt-3 text-center">
              <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">Vector DB</span>
              <span className="block text-[10px] font-mono text-zinc-500">Qdrant / PGVector</span>
            </div>
            <div className="absolute -top-10 flex flex-col items-center">
              <span className="text-[9px] font-mono font-bold text-amber-500 mb-1 tracking-widest">RAG Context</span>
              <div className="h-4 border-l-2 border-dashed border-amber-300 dark:border-amber-700/50"></div>
            </div>
          </motion.div>

          <ArrowRight size={20} className="text-zinc-300 dark:text-zinc-700 rotate-90 md:rotate-0" />

          {/* LLM Engine Layer */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col items-center relative">
            <div className="w-16 h-16 rounded-lg border-2 border-rose-200 dark:border-rose-900/50 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center">
              <Cpu size={24} className="text-rose-600 dark:text-rose-400" />
            </div>
            <div className="mt-3 text-center">
              <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">LLM Engine</span>
              <span className="block text-[10px] font-mono text-zinc-500">Gemini 1.5 Pro</span>
            </div>
            
            <div className="absolute -bottom-12 flex flex-col items-center">
              <div className="h-4 border-l-2 border-dashed border-rose-300 dark:border-rose-700/50 mb-1"></div>
              <span className="text-[9px] font-mono font-bold text-rose-500 tracking-widest bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">vLLM Inference</span>
            </div>
          </motion.div>

          <ArrowRight size={20} className="text-zinc-300 dark:text-zinc-700 rotate-90 md:rotate-0" />

          {/* Output & Guardrails Layer */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-lg border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center relative">
              <Server size={24} className="text-blue-600 dark:text-blue-400" />
              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 animate-pulse"></div>
            </div>
            <div className="mt-3 text-center">
              <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">Output Server</span>
              <span className="block text-[10px] font-mono text-zinc-500">Guardrails & Response</span>
            </div>
          </motion.div>

        </div>
        
        {/* Streaming Data Indicators */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent transform -translate-y-1/2 hidden md:block"></div>
          <div className="absolute top-1/2 left-[20%] w-2 h-2 rounded-full bg-indigo-500/50 blur-sm shadow-[0_0_10px_rgba(99,102,241,0.8)] transform -translate-y-1/2 animate-[marquee_3s_linear_infinite] hidden md:block"></div>
          <div className="absolute top-1/2 left-[40%] w-2 h-2 rounded-full bg-amber-500/50 blur-sm shadow-[0_0_10px_rgba(245,158,11,0.8)] transform -translate-y-1/2 animate-[marquee_4s_linear_infinite] hidden md:block" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-[60%] w-2 h-2 rounded-full bg-rose-500/50 blur-sm shadow-[0_0_10px_rgba(225,29,72,0.8)] transform -translate-y-1/2 animate-[marquee_2s_linear_infinite] hidden md:block" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </section>
  );
}
