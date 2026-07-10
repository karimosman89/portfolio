import React, { useEffect, useState, useRef } from 'react';
import { KEY_METRICS } from '../data';
import { ShieldCheck, Users, Zap, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';

const metricContexts: Record<string, { icon: any; title: string; desc: string; detail: string; chartType: 'uptime' | 'users' | 'perf' | 'revenue' }> = {
  uptime: {
    icon: ShieldCheck,
    title: "AWS Infrastructure",
    desc: "Uptime on multi-region systems",
    detail: "Maintained 99.9% high availability for enterprise AI platforms (RAG & LLM-as-a-Service) using auto-scaling, spot instances, and healthy node setups on AWS.",
    chartType: 'uptime'
  },
  users: {
    icon: Users,
    title: "Global AI Adoption",
    desc: "Active team users across 15+ countries",
    detail: "Integrated custom microservices serving 500+ engineering and legal team members, reducing document evaluation times significantly.",
    chartType: 'users'
  },
  perf: {
    icon: Zap,
    title: "Inference Latency Optimization",
    desc: "Fine-tuned model response speedup",
    detail: "Fine-tuned Llama and Mistral models via Hugging Face LoRA adapters, followed by INT8 post-training quantization to slash latency by 40%.",
    chartType: 'perf'
  },
  revenue: {
    icon: TrendingUp,
    title: "Commercial AI Impact",
    desc: "Direct revenue impact in production",
    detail: "Engineered commercial deep-learning recommendation systems handling 100,000+ daily active users, elevating sales conversions by 15% and engagement by 20%.",
    chartType: 'revenue'
  }
};

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    if (!isInView) {
      // Show 0 initially if a number is expected, to make the animation obvious
      const numMatch = value.match(/[\d.]+/);
      if (numMatch) {
        const prefix = value.substring(0, numMatch.index);
        const suffix = value.substring(numMatch.index! + numMatch[0].length);
        const isFloat = value.includes('.');
        setDisplayValue(`${prefix}${isFloat ? "0.0" : "0"}${suffix}`);
      } else {
        setDisplayValue(value);
      }
      return;
    }
    
    // Parse the value to find the number
    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) {
      setDisplayValue(value);
      return;
    }
    
    const targetNum = parseFloat(numMatch[0]);
    const isFloat = value.includes('.');
    const prefix = value.substring(0, numMatch.index);
    const suffix = value.substring(numMatch.index! + numMatch[0].length);
    
    let startTime: number;
    const duration = 2000; // 2 seconds animation
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentNum = targetNum * ease;
      
      const formattedNum = isFloat 
        ? currentNum.toFixed(1) 
        : Math.floor(currentNum).toString();
        
      setDisplayValue(`${prefix}${formattedNum}${suffix}`);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Ensure exact final value
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return <span ref={ref}>{displayValue}</span>;
}

export default function Metrics() {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  return (
    <section id="metrics-dashboard" className="mx-auto max-w-7xl px-6 py-16 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <Activity size={10} className="animate-pulse text-indigo-600 dark:text-indigo-455" />
            <span>01 / Production Telemetry</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
            {t('section.metrics.title')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {t('section.metrics.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
          <span>{t('section.metrics.audited')}</span>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {KEY_METRICS.map((metric) => {
          const context = metricContexts[metric.id];
          const IconComponent = context?.icon || ShieldCheck;

          const translatedLabel = t(`metric.${metric.id}.label`);
          const displayLabel = translatedLabel !== `metric.${metric.id}.label` ? translatedLabel : metric.label;

          const translatedSublabel = t(`metric.${metric.id}.sublabel`);
          const displaySublabel = translatedSublabel !== `metric.${metric.id}.sublabel` ? translatedSublabel : metric.sublabel;

          const translatedTitle = t(`metric.${metric.id}.title`);
          const displayTitle = translatedTitle !== `metric.${metric.id}.title` ? translatedTitle : (context?.title || '');

          const translatedDetail = t(`metric.${metric.id}.detail`);
          const displayDetail = translatedDetail !== `metric.${metric.id}.detail` ? translatedDetail : (context?.detail || '');

          return (
            <motion.div
              key={metric.id}
              variants={cardVariants}
              whileHover={{ y: -4, borderColor: "rgba(79, 70, 229, 0.2)" }}
              transition={{ duration: 0.2 }}
              className="group relative overflow-hidden rounded border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 p-6 shadow-sm shadow-zinc-100/50 dark:shadow-none backdrop-blur-sm transition-all"
            >
              
              {/* Header inside the card */}
              <div className="flex items-center justify-between">
                <span className="rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/60 p-2.5 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <IconComponent size={16} />
                </span>
                
                {/* Simulated tiny chart/sparkline representing metric */}
                <div className="flex items-end gap-0.5 h-6">
                  {context?.chartType === 'uptime' && (
                    <>
                      <div className="w-1 bg-zinc-100 dark:bg-zinc-800 h-2 rounded-sm group-hover:bg-indigo-600/20 transition-all duration-300" />
                      <div className="w-1 bg-zinc-100 dark:bg-zinc-800 h-3 rounded-sm group-hover:bg-indigo-600/30 transition-all duration-300" />
                      <div className="w-1 bg-zinc-100 dark:bg-zinc-800 h-4 rounded-sm group-hover:bg-indigo-600/40 transition-all duration-300" />
                      <div className="w-1 bg-indigo-600 dark:bg-indigo-500 h-5 rounded-sm" />
                    </>
                  )}
                  {context?.chartType === 'users' && (
                    <>
                      <div className="w-1 bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-sm group-hover:bg-indigo-600/20 transition-all duration-300" />
                      <div className="w-1 bg-zinc-100 dark:bg-zinc-800 h-3 rounded-sm group-hover:bg-indigo-600/30 transition-all duration-300" />
                      <div className="w-1 bg-indigo-600 dark:bg-indigo-500 h-4.5 rounded-sm" />
                      <div className="w-1 bg-indigo-600 dark:bg-indigo-500 h-5 rounded-sm" />
                    </>
                  )}
                  {context?.chartType === 'perf' && (
                    <>
                      <div className="w-1 bg-indigo-600 dark:bg-indigo-500 h-5 rounded-sm" />
                      <div className="w-1 bg-zinc-100 dark:bg-zinc-800 h-4 rounded-sm group-hover:bg-indigo-600/40 transition-all duration-300" />
                      <div className="w-1 bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-sm group-hover:bg-indigo-600/20 transition-all duration-300" />
                      <div className="w-1 bg-zinc-100 dark:bg-zinc-800 h-1 rounded-sm group-hover:bg-indigo-600/10 transition-all duration-300" />
                    </>
                  )}
                  {context?.chartType === 'revenue' && (
                    <>
                      <div className="w-1 bg-zinc-100 dark:bg-zinc-800 h-2 rounded-sm group-hover:bg-indigo-600/20 transition-all duration-300" />
                      <div className="w-1 bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-sm group-hover:bg-indigo-600/30 transition-all duration-300" />
                      <div className="w-1 bg-indigo-600 dark:bg-indigo-500 h-4 rounded-sm" />
                      <div className="w-1 bg-indigo-600 dark:bg-indigo-500 h-5.5 rounded-sm" />
                    </>
                  )}
                </div>
              </div>

              {/* Big Core Values */}
              <div className="mt-6 space-y-1">
                <div className="font-mono text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                  <AnimatedCounter value={metric.value} />
                </div>
                <div className="font-display text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                  {displayLabel}
                </div>
                <div className="text-[10px] font-mono text-zinc-450 dark:text-zinc-500 uppercase tracking-widest">
                  {displaySublabel}
                </div>
              </div>

              {/* Audited verification check */}
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <CheckCircle2 size={13} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-light">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{displayTitle}: </span>
                  {displayDetail}
                </p>
              </div>

            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
