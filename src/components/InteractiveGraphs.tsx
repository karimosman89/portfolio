import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, LineChart, Line, CartesianGrid, ReferenceLine, Label } from 'recharts';
import { TrendingUp, Award, Zap, HelpCircle, Activity, Sparkles, Milestone } from 'lucide-react';

interface ModelNode {
  name: string;
  accuracy: number; // 0-100
  latency: number;  // ms
  cost: number;     // $ per 1M tokens
  type: 'proprietary' | 'custom-tuned' | 'open-source';
  desc: string;
}

export default function InteractiveGraphs() {
  const [activeMetricTab, setActiveMetricTab] = useState<'latency-vs-acc' | 'roi-growth'>('latency-vs-acc');

  const modelData: ModelNode[] = [
    { name: 'GPT-4o (Stock)', accuracy: 88, latency: 420, cost: 5.0, type: 'proprietary', desc: 'Capable general-purpose model, but high baseline API expenses and higher general latency.' },
    { name: 'Claude 3.5 Sonnet', accuracy: 92, latency: 510, cost: 3.0, type: 'proprietary', desc: 'Elite reasoning capability, higher latency under concurrent system load.' },
    { name: 'Gemini 1.5 Flash', accuracy: 78, latency: 190, cost: 0.075, type: 'proprietary', desc: 'Extremely speedy, perfect for quick categorization tasks.' },
    { name: 'Llama 3 70B (Base)', accuracy: 81, latency: 280, cost: 0.65, type: 'open-source', desc: 'Strong performance on general datasets, medium inference speed.' },
    { name: 'Karim’s Fine-Tuned Qwen-7B', accuracy: 89, latency: 110, cost: 0.12, type: 'custom-tuned', desc: 'LoRA adapter quantized on business-specific logs. Highly fast, exact domain recall, extremely cost-effective.' },
    { name: 'Karim’s Agentic Ensemble', accuracy: 94, latency: 140, cost: 0.28, type: 'custom-tuned', desc: 'Hierarchical multi-agent framework with aggressive query pre-routing and cached embeddings.' }
  ];

  // Productivity ROI Growth data (Hours Saved vs Deployment Month)
  const roiData = [
    { month: 'Month 1', proprietaryHoursSaved: 10, karimEngineHoursSaved: 18, automationPct: 20 },
    { month: 'Month 2', proprietaryHoursSaved: 22, karimEngineHoursSaved: 45, automationPct: 40 },
    { month: 'Month 3', proprietaryHoursSaved: 38, karimEngineHoursSaved: 85, automationPct: 65 },
    { month: 'Month 4', proprietaryHoursSaved: 55, karimEngineHoursSaved: 140, automationPct: 82 },
    { month: 'Month 5', proprietaryHoursSaved: 72, karimEngineHoursSaved: 210, automationPct: 91 },
    { month: 'Month 6', proprietaryHoursSaved: 90, karimEngineHoursSaved: 295, automationPct: 96 }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-4 shadow-xl max-w-xs font-sans text-xs">
          <p className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-mono text-[10px]">
            {data.name || data.month}
          </p>
          {data.accuracy && (
            <div className="space-y-1.5 mt-2 text-zinc-650 dark:text-zinc-300">
              <div className="flex justify-between gap-4">
                <span>Task Accuracy:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{data.accuracy}%</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Latency:</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{data.latency}ms</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Est. Cost / 1M tokens:</span>
                <strong className="text-amber-600 dark:text-amber-400 font-mono">${data.cost}</strong>
              </div>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 font-light leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-2">
                {data.desc}
              </p>
            </div>
          )}
          {data.karimEngineHoursSaved && (
            <div className="space-y-1.5 mt-2 text-zinc-650 dark:text-zinc-300">
              <div className="flex justify-between gap-4">
                <span>Custom Agent ROI:</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">+{data.karimEngineHoursSaved} Hrs Saved</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Stock Model ROI:</span>
                <strong className="text-zinc-400 dark:text-zinc-500 font-mono">+{data.proprietaryHoursSaved} Hrs Saved</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>Task Automation Rate:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{data.automationPct}%</strong>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section id="interactive-ai-graphs" className="mx-auto max-w-7xl px-6 py-20 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[9px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <TrendingUp size={10} />
            <span>05 / Operational Performance Metrics</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
            Trade-off Analytics &amp; <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">Measurable ROI</span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            I map system constraints to tangible metrics. Explore model latency comparisons or witness the compounding efficiency gains of custom-orchestrated workflows over standard stock wrappers.
          </p>
        </div>

        {/* Chart Selector Tab */}
        <div className="flex p-1 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950 font-mono select-none self-start md:self-auto">
          <button
            onClick={() => setActiveMetricTab('latency-vs-acc')}
            className={`cursor-pointer px-3.5 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeMetricTab === 'latency-vs-acc'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Model Latency Matrix
          </button>
          <button
            onClick={() => setActiveMetricTab('roi-growth')}
            className={`cursor-pointer px-3.5 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeMetricTab === 'roi-growth'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Operational Efficiency Gains
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-stretch">
        
        {/* Left Interactive Specs Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] font-mono">
              {activeMetricTab === 'latency-vs-acc' ? 'Evaluating Model Constellations' : 'Compounding Operational Hours Saved'}
            </h3>
            
            <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed font-light">
              {activeMetricTab === 'latency-vs-acc' 
                ? 'Integrating high-end models requires addressing the cost-speed-accuracy frontier. Standard architectures often lead to excessive latency or severe cost spikes. By deploying local open-source models optimized with LoRA weight adapters, we lock in proprietary-level accuracy at custom-tailored speed bounds.'
                : 'Custom pipelines replace repetitive digital routines. Standard single-agent loops require human monitoring. By embedding self-contained error checks and validation consensus protocols, task automation approaches 96%, liberating engineering assets for high-value strategic execution.'
              }
            </p>

            <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4.5 space-y-3 font-mono text-[10px]">
              <div className="text-[9px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider mb-1">Key Performance Spec</div>
              
              <div className="flex justify-between py-1 border-b border-zinc-150 dark:border-zinc-900/50">
                <span>{activeMetricTab === 'latency-vs-acc' ? 'OPTIMAL LATENCY CEILING' : 'WEEK 1 EFFICIENCY'}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{activeMetricTab === 'latency-vs-acc' ? '< 150ms' : '+18 Hours Saved'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>{activeMetricTab === 'latency-vs-acc' ? 'ACCURACY LOWER BOUND' : 'WEEK 24 PROJECTED ROI'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeMetricTab === 'latency-vs-acc' ? '> 92%' : '+$240K Est. Value'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/45 p-6 flex items-start gap-3.5">
            <Activity className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-450 dark:text-zinc-550 font-bold">Dynamic Calibration Layer</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal font-light">
                Hover over the data points in the grid system to examine individual parameters, cost ratios, or compounding automation levels.
              </p>
            </div>
          </div>
        </div>

        {/* Right High-End Chart Render Canvas */}
        <div className="lg:col-span-8 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between relative overflow-hidden shadow-sm min-h-[420px]">
          
          {/* Faint Digital Grid Layout */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] dark:opacity-5 bg-grid-mask pointer-events-none" />

          {/* Model Latency vs Accuracy Scatter Matrix */}
          {activeMetricTab === 'latency-vs-acc' && (
            <div className="w-full h-full flex-1 flex flex-col justify-between relative z-10">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3 text-[10px] font-mono text-zinc-400 uppercase">
                <span>Quadrant Analysis: Cost-Speed-Accuracy Frontier</span>
                <span>Optimized Nodes highlighted</span>
              </div>

              <div className="flex-1 w-full h-[320px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                    <XAxis
                      type="number"
                      dataKey="latency"
                      name="Latency"
                      unit="ms"
                      domain={[50, 600]}
                      tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#e4e4e7' }}
                    >
                      <Label value="Latency (milliseconds) - Lower is Better" offset={-10} position="insideBottom" style={{ fill: '#71717a', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                    </XAxis>
                    <YAxis
                      type="number"
                      dataKey="accuracy"
                      name="Accuracy"
                      unit="%"
                      domain={[70, 100]}
                      tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#e4e4e7' }}
                    >
                      <Label value="Task Accuracy (%) - Higher is Better" angle={-90} position="insideLeft" style={{ fill: '#71717a', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                    </YAxis>
                    <ZAxis type="number" dataKey="cost" range={[60, 450]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    
                    {/* Add visual target boundaries */}
                    <ReferenceLine x={200} stroke="#a1a1aa" strokeDasharray="3 3">
                      <Label value="Speed Target" position="top" style={{ fill: '#a1a1aa', fontSize: 8, fontFamily: 'JetBrains Mono' }} />
                    </ReferenceLine>
                    <ReferenceLine y={90} stroke="#a1a1aa" strokeDasharray="3 3">
                      <Label value="Quality Target" position="insideRight" style={{ fill: '#a1a1aa', fontSize: 8, fontFamily: 'JetBrains Mono' }} />
                    </ReferenceLine>

                    {/* Standard models */}
                    <Scatter
                      name="Proprietary / Stock"
                      data={modelData.filter(m => m.type === 'proprietary')}
                      fill="#818cf8"
                      shape="circle"
                    />
                    
                    {/* Open Source models */}
                    <Scatter
                      name="Open Source Base"
                      data={modelData.filter(m => m.type === 'open-source')}
                      fill="#94a3b8"
                      shape="triangle"
                    />

                    {/* Karim's Optimized models */}
                    <Scatter
                      name="Karim's Custom Tuning"
                      data={modelData.filter(m => m.type === 'custom-tuned')}
                      fill="#10b981"
                      shape="star"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono border-t border-zinc-100 dark:border-zinc-900 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  <span className="text-zinc-500">Stock API Models</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  <span className="text-zinc-500">Open-Source Base</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <strong className="text-emerald-600 dark:text-emerald-450 font-extrabold">Custom Tuning Ensembles (Ours)</strong>
                </div>
              </div>
            </div>
          )}

          {/* Productivity ROI Growth Line Graph */}
          {activeMetricTab === 'roi-growth' && (
            <div className="w-full h-full flex-1 flex flex-col justify-between relative z-10">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3 text-[10px] font-mono text-zinc-400 uppercase">
                <span>Productivity Velocity Curve</span>
                <span>Cumulative Operational Hours Saved</span>
              </div>

              <div className="flex-1 w-full h-[320px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={roiData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#e4e4e7' }}
                    />
                    <YAxis
                      tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#e4e4e7' }}
                    >
                      <Label value="Operational Hours Reclaimed" angle={-90} position="insideLeft" style={{ fill: '#71717a', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                    </YAxis>
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="karimEngineHoursSaved"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Karim's Automated Pipelines"
                    />
                    <Line
                      type="monotone"
                      dataKey="proprietaryHoursSaved"
                      stroke="#818cf8"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Stock API Wrappers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono border-t border-zinc-100 dark:border-zinc-900 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-indigo-400 border-dashed" />
                  <span className="text-zinc-500">Stock API Integrations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-emerald-500" />
                  <strong className="text-emerald-600 dark:text-emerald-450 font-extrabold">Autonomous Guardrailed Pipelines</strong>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}
