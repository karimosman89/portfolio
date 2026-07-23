import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, LineChart, Line, CartesianGrid, ReferenceLine, Label } from 'recharts';
import { TrendingUp, Award, Zap, HelpCircle, Activity, Sparkles, Milestone } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ModelNode {
  name: string;
  accuracy: number; // 0-100
  latency: number;  // ms
  cost: number;     // $ per 1M tokens
  type: 'proprietary' | 'custom-tuned' | 'open-source';
  desc: string;
}

const localTranslations: Record<string, any> = {
  en: {
    sectionNum: "05 / Operational Performance Metrics",
    sectionTitle: "Trade-off Analytics &",
    sectionTitleItalic: "Measurable ROI",
    sectionSubtitle: "I map system constraints to tangible metrics. Explore model latency comparisons or witness the compounding efficiency gains of custom-orchestrated workflows over standard stock wrappers.",
    tabLatency: "Model Latency Matrix",
    tabGains: "Operational Efficiency Gains",
    evalConstellations: "Evaluating Model Constellations",
    compoundingSaved: "Compounding Operational Hours Saved",
    evalDesc: "Integrating high-end models requires addressing the cost-speed-accuracy frontier. Standard architectures often lead to excessive latency or severe cost spikes. By deploying local open-source models optimized with LoRA weight adapters, we lock in proprietary-level accuracy at custom-tailored speed bounds.",
    compoundingDesc: "Custom pipelines replace repetitive digital routines. Standard single-agent loops require human monitoring. By embedding self-contained error checks and validation consensus protocols, task automation approaches 96%, liberating engineering assets for high-value strategic execution.",
    perfSpecTitle: "Key Performance Spec",
    optimalLatencyTitle: "OPTIMAL LATENCY CEILING",
    week1EfficiencyTitle: "WEEK 1 EFFICIENCY",
    accuracyLowerTitle: "ACCURACY LOWER BOUND",
    week24ProjectedTitle: "WEEK 24 PROJECTED ROI",
    optimalLatencyValue: "< 150ms",
    week1EfficiencyValue: "+18 Hours Saved",
    accuracyLowerValue: "> 92%",
    week24ProjectedValue: "+$240K Est. Value",
    calibrationTitle: "Dynamic Calibration Layer",
    calibrationDesc: "Hover over the data points in the grid system to examine individual parameters, cost ratios, or compounding automation levels.",
    quadrantTitle: "Quadrant Analysis: Cost-Speed-Accuracy Frontier",
    quadrantHighlight: "Optimized Nodes highlighted",
    latencyAxisLabel: "Latency (milliseconds) - Lower is Better",
    accuracyAxisLabel: "Task Accuracy (%) - Higher is Better",
    speedTarget: "Speed Target",
    qualityTarget: "Quality Target",
    legendStock: "Stock API Models",
    legendOpen: "Open-Source Base",
    legendOurs: "Custom Tuning Ensembles (Ours)",
    productivityTitle: "Productivity Velocity Curve",
    cumulativeSaved: "Cumulative Operational Hours Saved",
    reclaimedLabel: "Operational Hours Reclaimed",
    stockIntegrations: "Stock API Integrations",
    autonomousPipelines: "Autonomous Guardrailed Pipelines",
    
    // Tooltip & Data
    taskAccuracy: "Task Accuracy:",
    latency: "Latency:",
    estCost: "Est. Cost / 1M tokens:",
    customRoi: "Custom Agent ROI:",
    stockRoi: "Stock Model ROI:",
    automationRate: "Task Automation Rate:",
    hrsSaved: "Hrs Saved",
    monthNames: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
    
    // Models info
    gpt4oDesc: "Capable general-purpose model, but high baseline API expenses and higher general latency.",
    claudeDesc: "Elite reasoning capability, higher latency under concurrent system load.",
    geminiDesc: "Extremely speedy, perfect for quick categorization tasks.",
    llamaDesc: "Strong performance on general datasets, medium inference speed.",
    qwenDesc: "LoRA adapter quantized on business-specific logs. Highly fast, exact domain recall, extremely cost-effective.",
    ensembleDesc: "Hierarchical multi-agent framework with aggressive query pre-routing and cached embeddings."
  },
  fr: {
    sectionNum: "05 / Métriques de Performance Opérationnelle",
    sectionTitle: "Analyses de Compromis &",
    sectionTitleItalic: "ROI Mesurable",
    sectionSubtitle: "Je cartographie les contraintes système en métriques tangibles. Explorez les comparaisons de latence des modèles ou observez les gains d'efficacité cumulés des workflows orchestrés sur mesure par rapport aux wrappers standard.",
    tabLatency: "Matrice de Latence des Modèles",
    tabGains: "Gains d'Efficacité Opérationnelle",
    evalConstellations: "Évaluation des Constellations de Modèles",
    compoundingSaved: "Heures Opérationnelles Reclavées",
    evalDesc: "L'intégration de modèles haut de gamme nécessite de traiter la frontière coût-vitesse-précision. Les architectures standard entraînent souvent une latence excessive ou de graves pics de coûts. En déployant des modèles open source locaux optimisés avec des adaptateurs de poids LoRA, nous verrouillons une précision de niveau propriétaire dans des limites de vitesse personnalisées.",
    compoundingDesc: "Les pipelines personnalisés remplacent les routines numériques répétitives. Les boucles mono-agent standard nécessitent une surveillance humaine. En intégrant des vérifications d'erreurs autonomes et des protocoles de consensus de validation, l'automatisation des tâches approche 96%, libérant les ingénieurs pour une exécution stratégique à haute valeur ajoutée.",
    perfSpecTitle: "Spécification de Performance Clé",
    optimalLatencyTitle: "PLAFOND DE LATENCE OPTIMAL",
    week1EfficiencyTitle: "EFFICACITÉ SEMAINE 1",
    accuracyLowerTitle: "LIMITE INFÉRIEURE DE PRÉCISION",
    week24ProjectedTitle: "ROI PROJETÉ SEMAINE 24",
    optimalLatencyValue: "< 150ms",
    week1EfficiencyValue: "+18 Heures Sauvées",
    accuracyLowerValue: "> 92%",
    week24ProjectedValue: "+240k $ Valeur Est.",
    calibrationTitle: "Couche de Calibrage Dynamique",
    calibrationDesc: "Survolez les points de données dans le système de grille pour examiner les paramètres individuels, les ratios de coûts ou les niveaux d'automatisation cumulés.",
    quadrantTitle: "Analyse des Quadrants : Frontière Coût-Vitesse-Précision",
    quadrantHighlight: "Nœuds optimisés mis en évidence",
    latencyAxisLabel: "Latence (millisecondes) - Plus bas est mieux",
    accuracyAxisLabel: "Précision de la tâche (%) - Plus haut est mieux",
    speedTarget: "Cible de Vitesse",
    qualityTarget: "Cible de Qualité",
    legendStock: "Modèles d'API Standard",
    legendOpen: "Base Open Source",
    legendOurs: "Ensembles d'Optimisation Personnalisés (Karim)",
    productivityTitle: "Courbe de Vélocité de Productivité",
    cumulativeSaved: "Cumul des Heures Opérationnelles Sauvées",
    reclaimedLabel: "Heures Opérationnelles Récupérées",
    stockIntegrations: "Intégrations d'API Standard",
    autonomousPipelines: "Pipelines Autonomes avec Garde-fous",
    
    taskAccuracy: "Précision tâche :",
    latency: "Latence :",
    estCost: "Coût est. / 1M tokens :",
    customRoi: "ROI Agent sur mesure :",
    stockRoi: "ROI Modèle standard :",
    automationRate: "Taux d'automatisation :",
    hrsSaved: "Heures sauvées",
    monthNames: ["Mois 1", "Mois 2", "Mois 3", "Mois 4", "Mois 5", "Mois 6"],
    
    gpt4oDesc: "Modèle polyvalent performant, mais dépenses d'API de base élevées et latence générale plus élevée.",
    claudeDesc: "Capacité de raisonnement d'élite, latence plus élevée sous charge système concurrente.",
    geminiDesc: "Extrêmement rapide, parfait pour les tâches de catégorisation rapides.",
    llamaDesc: "Performances solides sur des ensembles de données généraux, vitesse d'inférence moyenne.",
    qwenDesc: "Adaptateur LoRA quantifié sur les journaux spécifiques à l'entreprise. Très rapide, rappel de domaine exact, extrêmement rentable.",
    ensembleDesc: "Framework multi-agents hiérarchique avec pré-routage agressif des requêtes et plongements mis en cache."
  },
  it: {
    sectionNum: "05 / Metriche di Performance Operativa",
    sectionTitle: "Analisi di Compromesso &",
    sectionTitleItalic: "ROI Misurabile",
    sectionSubtitle: "Mappo i vincoli di sistema in metriche tangibili. Esplora i confronti della latenza dei modelli o osserva i guadagni di efficienza cumulativi dei flussi di lavoro orchestrati su misura rispetto ai wrapper standard.",
    tabLatency: "Matrice di Latenza dei Modelli",
    tabGains: "Guadagni di Efficienza Operativa",
    evalConstellations: "Valutazione delle Costellazioni di Modelli",
    compoundingSaved: "Accumulo di Ore Operative Risparmiate",
    evalDesc: "L'integrazione di modelli di fascia alta richiede di affrontare la frontiera costo-velocità-precisione. Le architetture standard spesso portano a una latenza eccessiva o a gravi picchi di costo. Distribuendo modelli open source locali ottimizzati con adapter di peso LoRA, blocchiamo una precisione di livello proprietario entro limiti di velocità personalizzati.",
    compoundingDesc: "Le pipeline personalizzate sostituiscono le routine digitali ripetitive. I cicli standard a singolo agente richiedono il monitoraggio umano. Incorporando controlli degli errori autonomi e protocolli di consenso per la validazione, l'automazione delle attività si avvicina al 96%, liberando gli ingegneri per attività strategiche ad alto valore.",
    perfSpecTitle: "Specifica delle Prestazioni Chiave",
    optimalLatencyTitle: "TETTO DI LATENZA OTTIMALE",
    week1EfficiencyTitle: "EFFICIENZA SETTIMANA 1",
    accuracyLowerTitle: "LIMITE INFERIORE DI ACCURATEZZA",
    week24ProjectedTitle: "ROI PROIETTATO SETTIMANA 24",
    optimalLatencyValue: "< 150ms",
    week1EfficiencyValue: "+18 Ore Risparmiate",
    accuracyLowerValue: "> 92%",
    week24ProjectedValue: "+240.000$ Valore Stimato",
    calibrationTitle: "Livello di Calibrazione Dinamica",
    calibrationDesc: "Passa il mouse sopra i punti dati nel sistema a griglia per esaminare i singoli parametri, i rapporti di costo o i livelli di automazione cumulativi.",
    quadrantTitle: "Analisi dei Quadranti: Frontiera Costo-Velocità-Accuratezza",
    quadrantHighlight: "Nodi ottimizzati evidenziati",
    latencyAxisLabel: "Latenza (millisecondi) - Più basso è meglio",
    accuracyAxisLabel: "Accuratezza dell'attività (%) - Più alto è meglio",
    speedTarget: "Obiettivo Velocità",
    qualityTarget: "Obiettivo Qualità",
    legendStock: "Modelli API Standard",
    legendOpen: "Base Open Source",
    legendOurs: "Insiemi di Ottimizzazione Personalizzati (Karim)",
    productivityTitle: "Curva di Velocità della Produttività",
    cumulativeSaved: "Accumulo di Ore Operative Risparmiate",
    reclaimedLabel: "Ore Operative Recuperate",
    stockIntegrations: "Integrazioni API Standard",
    autonomousPipelines: "Pipeline Autonome con Guardrail",
    
    taskAccuracy: "Accuratezza attività :",
    latency: "Latenza :",
    estCost: "Costo stimato / 1M token :",
    customRoi: "ROI Agente personalizzato :",
    stockRoi: "ROI Modello standard :",
    automationRate: "Tasso di automazione :",
    hrsSaved: "Ore risparmiate",
    monthNames: ["Mese 1", "Mese 2", "Mese 3", "Mese 4", "Mese 5", "Mese 6"],
    
    gpt4oDesc: "Modello generico capace, ma spese API di base elevate e latenza generale più elevata.",
    claudeDesc: "Capacità di ragionamento d'élite, latenza più elevata sotto carico di sistema concorrente.",
    geminiDesc: "Estremamente veloce, perfetto per attività di categorizzazione rapide.",
    llamaDesc: "Prestazioni solide su dataset generici, velocità di inferenza media.",
    qwenDesc: "Adapter LoRA quantizzato su log specifici aziendali. Altamente veloce, richiamo esatto del dominio, estremamente economico.",
    ensembleDesc: "Framework multi-agente gerarchico con pre-routing aggressivo delle query ed embedding memorizzati nella cache."
  }
};

export default function InteractiveGraphs() {
  const { lang } = useLanguage();
  const activeT = localTranslations[lang] || localTranslations.en;

  const [activeMetricTab, setActiveMetricTab] = useState<'latency-vs-acc' | 'roi-growth'>('latency-vs-acc');

  const modelData: ModelNode[] = [
    { name: 'GPT-4o (Stock)', accuracy: 88, latency: 420, cost: 5.0, type: 'proprietary', desc: activeT.gpt4oDesc },
    { name: 'Claude 3.5 Sonnet', accuracy: 92, latency: 510, cost: 3.0, type: 'proprietary', desc: activeT.claudeDesc },
    { name: 'Gemini 1.5 Flash', accuracy: 78, latency: 190, cost: 0.075, type: 'proprietary', desc: activeT.geminiDesc },
    { name: 'Llama 3 70B (Base)', accuracy: 81, latency: 280, cost: 0.65, type: 'open-source', desc: activeT.llamaDesc },
    { name: 'Karim’s Fine-Tuned Qwen-7B', accuracy: 89, latency: 110, cost: 0.12, type: 'custom-tuned', desc: activeT.qwenDesc },
    { name: 'Karim’s Agentic Ensemble', accuracy: 94, latency: 140, cost: 0.28, type: 'custom-tuned', desc: activeT.ensembleDesc }
  ];

  // Productivity ROI Growth data (Hours Saved vs Deployment Month)
  const roiData = [
    { month: activeT.monthNames[0], proprietaryHoursSaved: 10, karimEngineHoursSaved: 18, automationPct: 20 },
    { month: activeT.monthNames[1], proprietaryHoursSaved: 22, karimEngineHoursSaved: 45, automationPct: 40 },
    { month: activeT.monthNames[2], proprietaryHoursSaved: 38, karimEngineHoursSaved: 85, automationPct: 65 },
    { month: activeT.monthNames[3], proprietaryHoursSaved: 55, karimEngineHoursSaved: 140, automationPct: 82 },
    { month: activeT.monthNames[4], proprietaryHoursSaved: 72, karimEngineHoursSaved: 210, automationPct: 91 },
    { month: activeT.monthNames[5], proprietaryHoursSaved: 90, karimEngineHoursSaved: 295, automationPct: 96 }
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
                <span>{activeT.taskAccuracy}</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{data.accuracy}%</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>{activeT.latency}</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{data.latency}ms</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>{activeT.estCost}</span>
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
                <span>{activeT.customRoi}</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">+{data.karimEngineHoursSaved} {activeT.hrsSaved}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>{activeT.stockRoi}</span>
                <strong className="text-zinc-400 dark:text-zinc-500 font-mono">+{data.proprietaryHoursSaved} {activeT.hrsSaved}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span>{activeT.automationRate}</span>
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
          <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <TrendingUp size={10} />
            <span>{activeT.sectionNum}</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
            {activeT.sectionTitle} <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">{activeT.sectionTitleItalic}</span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
            {activeT.sectionSubtitle}
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
            {activeT.tabLatency}
          </button>
          <button
            onClick={() => setActiveMetricTab('roi-growth')}
            className={`cursor-pointer px-3.5 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeMetricTab === 'roi-growth'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-zinc-200/60 dark:border-zinc-800 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {activeT.tabGains}
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-stretch">
        
        {/* Left Interactive Specs Panel */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 p-6 space-y-4 shadow-sm">
            <h3 className="font-display font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] font-mono">
              {activeMetricTab === 'latency-vs-acc' ? activeT.evalConstellations : activeT.compoundingSaved}
            </h3>
            
            <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed font-light">
              {activeMetricTab === 'latency-vs-acc' ? activeT.evalDesc : activeT.compoundingDesc}
            </p>

            <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4.5 space-y-3 font-mono text-[10px]">
              <div className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider mb-1">{activeT.perfSpecTitle}</div>
              
              <div className="flex justify-between py-1 border-b border-zinc-150 dark:border-zinc-900/50">
                <span>{activeMetricTab === 'latency-vs-acc' ? activeT.optimalLatencyTitle : activeT.week1EfficiencyTitle}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{activeMetricTab === 'latency-vs-acc' ? activeT.optimalLatencyValue : activeT.week1EfficiencyValue}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>{activeMetricTab === 'latency-vs-acc' ? activeT.accuracyLowerTitle : activeT.week24ProjectedTitle}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeMetricTab === 'latency-vs-acc' ? activeT.accuracyLowerValue : activeT.week24ProjectedValue}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/45 p-6 flex items-start gap-3.5">
            <Activity className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-450 dark:text-zinc-550 font-bold">{activeT.calibrationTitle}</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal font-light">
                {activeT.calibrationDesc}
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
                <span>{activeT.quadrantTitle}</span>
                <span>{activeT.quadrantHighlight}</span>
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
