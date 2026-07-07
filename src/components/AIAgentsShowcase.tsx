import React, { useState } from 'react';
import { Bot, Cpu, Network, Database, RefreshCw, GitFork, Shield, Zap, Sparkles, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';

interface AgentNode {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'processing' | 'done';
  desc: string;
  icon: React.ReactNode;
}

const footerTranslations: Record<string, { thread: string; grounding: string; active: string }> = {
  en: { thread: "Graph Thread ID", grounding: "Grounding", active: "Active" },
  it: { thread: "ID Thread Grafico", grounding: "Messa a terra", active: "Attivo" },
  fr: { thread: "ID Thread du Graphe", grounding: "Ancrage", active: "Actif" }
};

export default function AIAgentsShowcase() {
  const { t, lang } = useLanguage();
  const [activeWorkflow, setActiveWorkflow] = useState<'rag' | 'multi-agent' | 'mcp'>('multi-agent');
  const [simStep, setSimStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation steps for Multi-Agent flow
  const simulationSteps = [
    { title: t('agents.sim.step0.title'), text: t('agents.sim.step0.text') },
    { title: t('agents.sim.step1.title'), text: t('agents.sim.step1.text') },
    { title: t('agents.sim.step2.title'), text: t('agents.sim.step2.text') },
    { title: t('agents.sim.step3.title'), text: t('agents.sim.step3.text') },
    { title: t('agents.sim.step4.title'), text: t('agents.sim.step4.text') }
  ];

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(0);
    
    const interval = setInterval(() => {
      setSimStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsSimulating(false);
          return 4;
        }
        return prev + 1;
      });
    }, 2000);
  };

  return (
    <motion.section
      id="ai-agents-showcase"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-7xl px-6 py-20 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800"
    >
      
      {/* Upper Title Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[9px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <Sparkles size={10} />
            <span>{t('agents.title.badge')}</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
            {t('agents.title.main')} <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">{t('agents.title.italic')}</span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            {t('agents.subtitle')}
          </p>
        </div>

        {/* Workflow Tab Selector */}
        <div className="flex p-1 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950 font-mono select-none self-start md:self-auto">
          {(['multi-agent', 'rag', 'mcp'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTabAndReset(tab);
              }}
              className={`cursor-pointer px-3.5 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeWorkflow === tab
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {tab === 'multi-agent' ? t('agents.tab.multi') : tab === 'rag' ? t('agents.tab.rag') : t('agents.tab.mcp')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-stretch">
        
        {/* Left Side: Explanatory Bento Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <AnimatePresence mode="wait">
            {activeWorkflow === 'multi-agent' && (
              <motion.div
                key="multi-agent-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 p-6 space-y-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-150/40 dark:border-indigo-900/50">
                    <Network size={20} />
                  </div>
                  <h3 className="font-display font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] font-mono">
                    {t('agents.multi.title')}
                  </h3>
                  <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed font-light">
                    {t('agents.multi.desc')}
                  </p>
                  
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-start gap-2.5 text-xs font-light text-zinc-550 dark:text-zinc-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5" />
                      <span>{t('agents.multi.bullet1')}</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs font-light text-zinc-550 dark:text-zinc-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5" />
                      <span>{t('agents.multi.bullet2')}</span>
                    </div>
                  </div>
                </div>

                {/* Simulation control panel */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/45 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-450 dark:text-zinc-500 font-bold">{t('agents.multi.sandbox')}</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-150/40 dark:border-indigo-900/40">
                      {t('agents.multi.live')}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                    {t('agents.multi.sandbox_desc')}
                  </p>

                  <button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="cursor-pointer w-full rounded border border-zinc-900 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-950 text-white font-mono font-bold uppercase tracking-wider text-[10px] py-3 hover:bg-zinc-800 dark:hover:bg-zinc-900 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSimulating ? (
                      <>
                        <RefreshCw size={12} className="animate-spin text-indigo-400" />
                        <span>Step {simStep + 1}/5 {t('agents.multi.btn_executing')}</span>
                      </>
                    ) : (
                      <>
                        <Zap size={11} className="fill-white" />
                        <span>{t('agents.multi.btn_execute')}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {activeWorkflow === 'rag' && (
              <motion.div
                key="rag-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 p-6 space-y-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-150/40 dark:border-indigo-900/50">
                    <Database size={20} />
                  </div>
                  <h3 className="font-display font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] font-mono">
                    {t('agents.rag.title')}
                  </h3>
                  <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed font-light">
                    {t('agents.rag.desc')}
                  </p>
                  
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-start gap-2.5 text-xs font-light text-zinc-550 dark:text-zinc-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5" />
                      <span>{t('agents.rag.bullet1')}</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs font-light text-zinc-550 dark:text-zinc-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5" />
                      <span>{t('agents.rag.bullet2')}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/45 p-6 text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed space-y-2 font-mono">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 uppercase text-[9px] tracking-wider mb-1">{t('agents.rag.perf_title')}</div>
                  <div className="flex justify-between py-1 border-b border-zinc-150 dark:border-zinc-900/50">
                    <span>{t('agents.rag.perf.recall')}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">98.4%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-150 dark:border-zinc-900/50">
                    <span>{t('agents.rag.perf.latency')}</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">18ms</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>{t('agents.rag.perf.accuracy')}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-450">94.2% (Ragas scale)</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeWorkflow === 'mcp' && (
              <motion.div
                key="mcp-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 p-6 space-y-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-150/40 dark:border-indigo-900/50">
                    <Code2 size={20} />
                  </div>
                  <h3 className="font-display font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] font-mono">
                    {t('agents.mcp.title')}
                  </h3>
                  <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed font-light">
                    {t('agents.mcp.desc')}
                  </p>
                  
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-start gap-2.5 text-xs font-light text-zinc-550 dark:text-zinc-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5" />
                      <span>{t('agents.mcp.bullet1')}</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs font-light text-zinc-550 dark:text-zinc-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5" />
                      <span>{t('agents.mcp.bullet2')}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/45 p-6 text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed space-y-2 font-mono">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200 uppercase text-[9px] tracking-wider mb-1">{t('agents.mcp.enclave_title')}</div>
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded.5 border border-zinc-150 dark:border-zinc-800/80 text-[10px] text-zinc-600 dark:text-zinc-400 leading-tight">
                    <Shield size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{t('agents.mcp.enclave_desc')}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: High-Impact Visual Diagram Frame */}
        <div className="lg:col-span-7 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          
          {/* Faint Digital Grid Layout */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] dark:opacity-5 bg-grid-mask pointer-events-none" />

          {/* Diagram Console Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4 relative z-10 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              <span className="font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                {activeWorkflow === 'multi-agent' ? t('agents.diagram.multi_title') : activeWorkflow === 'rag' ? t('agents.diagram.rag_title') : t('agents.diagram.mcp_title')}
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-light">{t('agents.diagram.status')}</span>
          </div>

          {/* Interactive Simulation Viewport */}
          <div className="flex-1 py-8 flex flex-col items-center justify-center min-h-[300px] relative z-10">
            
            {activeWorkflow === 'multi-agent' && (
              <div className="w-full max-w-lg space-y-8 font-mono text-[10px]">
                {/* Visual Agent Node Flow */}
                <div className="flex justify-between items-center relative">
                  {/* Flowing Connector lines */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0" />
                  
                  {/* Node 1: Master Orchestrator */}
                  <div className={`relative z-10 flex flex-col items-center p-3 rounded-lg border bg-white dark:bg-zinc-900 text-center w-28 shadow-sm transition-all duration-300 ${
                    simStep >= 1 ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-200 dark:border-zinc-800'
                  }`}>
                    <Cpu size={16} className={simStep === 1 ? "text-indigo-600 animate-pulse" : "text-zinc-400"} />
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 mt-1.5">{t('agents.diagram.orchestrator')}</span>
                    <span className="text-[8px] text-zinc-400 font-light mt-0.5">GPT-4o</span>
                  </div>

                  {/* Dynamic Processing Line indicators */}
                  <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                    isSimulating && simStep >= 2 ? 'bg-indigo-500 animate-ping' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`} />

                  {/* Node 2: Retrieval Specialist */}
                  <div className={`relative z-10 flex flex-col items-center p-3 rounded-lg border bg-white dark:bg-zinc-900 text-center w-28 shadow-sm transition-all duration-300 ${
                    simStep >= 2 ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-zinc-200 dark:border-zinc-800'
                  }`}>
                    <Database size={16} className={simStep === 2 ? "text-indigo-600 animate-pulse" : "text-zinc-400"} />
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 mt-1.5">{t('agents.diagram.rag_agent')}</span>
                    <span className="text-[8px] text-zinc-400 font-light mt-0.5">Qdrant / PG</span>
                  </div>

                  {/* Dynamic Processing Line indicators */}
                  <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                    isSimulating && simStep >= 3 ? 'bg-indigo-500 animate-ping' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`} />

                  {/* Node 3: Verification Guard */}
                  <div className={`relative z-10 flex flex-col items-center p-3 rounded-lg border bg-white dark:bg-zinc-900 text-center w-28 shadow-sm transition-all duration-300 ${
                    simStep >= 4 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-zinc-200 dark:border-zinc-800'
                  }`}>
                    <Shield size={16} className={simStep >= 4 ? "text-emerald-500 animate-pulse" : "text-zinc-400"} />
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 mt-1.5">{t('agents.diagram.guardrail')}</span>
                    <span className="text-[8px] text-zinc-400 font-light mt-0.5">NeMo Guard</span>
                  </div>
                </div>

                {/* Simulation Output Logger */}
                <div className="rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-2 text-[9px] text-zinc-400">
                    <span>{t('agents.multi.console_output')}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">● ONLINE</span>
                  </div>
                  
                  <div className="space-y-2 text-xs font-light text-zinc-650 dark:text-zinc-350 leading-relaxed font-sans min-h-[50px]">
                    {isSimulating || simStep > 0 ? (
                      <div>
                        <div className="font-mono text-[9px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                          &gt; {simulationSteps[simStep].title}
                        </div>
                        <p>{simulationSteps[simStep].text}</p>
                      </div>
                    ) : (
                      <p className="italic text-zinc-400">{t('agents.multi.console_placeholder')}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeWorkflow === 'rag' && (
              <div className="w-full max-w-md space-y-6 font-mono text-[10px]">
                <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-2 text-[9px] text-zinc-450 dark:text-zinc-550 uppercase">
                    <span>{t('agents.diagram.topology_header')}</span>
                    <span>{t('agents.diagram.topology_cluster')}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="rounded border border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-950 shadow-xs space-y-1">
                      <div className="font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> {t('agents.diagram.dense_vector')}
                      </div>
                      <p className="text-[9px] text-zinc-450 dark:text-zinc-550 leading-normal font-sans font-light">{t('agents.diagram.dense_vector_desc')}</p>
                    </div>

                    <div className="rounded border border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-950 shadow-xs space-y-1">
                      <div className="font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {t('agents.diagram.sparse_bm25')}
                      </div>
                      <p className="text-[9px] text-zinc-450 dark:text-zinc-550 leading-normal font-sans font-light">{t('agents.diagram.sparse_bm25_desc')}</p>
                    </div>
                  </div>

                  <div className="rounded border border-indigo-150/50 dark:border-indigo-950/80 bg-indigo-50/20 dark:bg-indigo-950/20 p-3.5 text-center text-xs leading-normal font-sans font-light">
                    🎯 <strong className="font-semibold text-indigo-700 dark:text-indigo-400">{t('agents.rag.perf_title')}:</strong> {t('agents.rag.reranker_desc')}
                  </div>
                </div>
              </div>
            )}

            {activeWorkflow === 'mcp' && (
              <div className="w-full max-w-lg space-y-6 font-mono text-[10px]">
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800 pb-2 text-[9px] text-zinc-450 dark:text-zinc-550 uppercase">
                    <span>{t('agents.diagram.mcp_header')}</span>
                    <span>{t('agents.diagram.mcp_tools')}</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Code2 size={13} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="font-bold text-zinc-750 dark:text-zinc-300">{t('agents.diagram.mcp.sql')}</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200/40 uppercase">{t('agents.diagram.mcp.sql_badge')}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Database size={13} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="font-bold text-zinc-750 dark:text-zinc-300">{t('agents.diagram.mcp.files')}</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border border-indigo-200/40 uppercase">{t('agents.diagram.mcp.files_badge')}</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Bot size={13} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="font-bold text-zinc-750 dark:text-zinc-300">{t('agents.diagram.mcp.delegate')}</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200/40 uppercase">{t('agents.diagram.mcp.delegate_badge')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Diagram Console Footer */}
          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-4 flex justify-between items-center font-mono text-[9px] text-zinc-400 relative z-10">
            <span>{(footerTranslations[lang] || footerTranslations.en).thread}: gr_442a8b9</span>
            <span>{(footerTranslations[lang] || footerTranslations.en).grounding}: {(footerTranslations[lang] || footerTranslations.en).active}</span>
          </div>

        </div>

      </div>

    </motion.section>
  );

  function setActiveTabAndReset(tab: 'rag' | 'multi-agent' | 'mcp') {
    setActiveWorkflow(tab);
    setSimStep(0);
    setIsSimulating(false);
  }
}
