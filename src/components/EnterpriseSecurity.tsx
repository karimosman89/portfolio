import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Server, Network, Database, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function EnterpriseSecurity() {
  const { lang } = useLanguage();

  const t = {
    en: {
      title: 'Enterprise Security & Architecture',
      subtitle: 'Zero-Trust AI Deployments',
      desc: 'Large-scale AI integration requires rigorous data governance. I build production-grade architectures designed for heavily regulated environments—ensuring your intellectual property never leaks into public models.',
      features: [
        {
          title: 'VPC & Air-Gapped Deployments',
          desc: 'Deploying open-weight SLMs (Llama 3, Mistral) strictly within your private cloud. No external API calls, absolute data sovereignty.',
          icon: Network
        },
        {
          title: 'Zero-Data-Retention Policies',
          desc: 'When using commercial models (Gemini, Claude), APIs are configured with zero-day retention enterprise agreements. Your data is not trained on.',
          icon: Database
        },
        {
          title: 'SOC2 & GDPR Compliance',
          desc: 'Built-in PII redaction and audit-ready logging layers. Token-level access control with strict RBAC enforcement.',
          icon: Shield
        },
        {
          title: 'On-Premise LLM Inference',
          desc: 'Optimizing inference hardware (vLLM, TensorRT-LLM) for ultra-low latency within your bare-metal clusters.',
          icon: Server
        }
      ]
    },
    it: {
      title: 'Sicurezza Aziendale & Architettura',
      subtitle: 'Implementazioni IA Zero-Trust',
      desc: 'L\'integrazione dell\'IA su larga scala richiede una rigorosa governance dei dati. Costruisco architetture per la produzione progettate per ambienti altamente regolamentati, assicurando che la tua proprietà intellettuale non diventi mai di dominio pubblico.',
      features: [
        {
          title: 'Implementazioni VPC e Air-Gapped',
          desc: 'Distribuzione di modelli open-weight all\'interno del tuo cloud privato. Nessuna chiamata API esterna.',
          icon: Network
        },
        {
          title: 'Politiche di Zero-Data-Retention',
          desc: 'Le API dei modelli commerciali (Gemini) sono configurate con accordi aziendali a ritenzione zero.',
          icon: Database
        },
        {
          title: 'Conformità SOC2 e GDPR',
          desc: 'Riduzione PII integrata e livelli di registrazione pronti per l\'audit. Controllo degli accessi con RBAC.',
          icon: Shield
        },
        {
          title: 'Inferenza LLM On-Premise',
          desc: 'Ottimizzazione dell\'hardware di inferenza per latenza ultra bassa all\'interno dei tuoi cluster.',
          icon: Server
        }
      ]
    },
    fr: {
      title: 'Sécurité et Architecture d\'Entreprise',
      subtitle: 'Déploiements IA Zero-Trust',
      desc: 'L\'intégration de l\'IA à grande échelle nécessite une gouvernance des données rigoureuse. Je conçois des architectures de production pour les environnements hautement réglementés.',
      features: [
        {
          title: 'Déploiements VPC & Air-Gapped',
          desc: 'Déploiement de SLM ouverts strictement dans votre cloud privé. Souveraineté totale des données.',
          icon: Network
        },
        {
          title: 'Politiques Zéro-Rétention',
          desc: 'API configurées avec des accords d\'entreprise à rétention zéro. Vos données ne sont pas utilisées pour l\'entraînement.',
          icon: Database
        },
        {
          title: 'Conformité SOC2 & GDPR',
          desc: 'Masquage PII intégré et journalisation pour l\'audit. Contrôle d\'accès par jeton avec RBAC.',
          icon: Shield
        },
        {
          title: 'Inférence LLM Sur Site',
          desc: 'Optimisation matérielle pour une latence ultra-faible sur vos clusters.',
          icon: Server
        }
      ]
    }
  };

  const content = t[lang] || t.en;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800">
      
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 px-2.5 py-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
              <Lock size={10} className="animate-pulse" />
              <span>{content.subtitle}</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-3">
              {content.title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">
              {content.desc}
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:bg-emerald-50/10 dark:hover:bg-emerald-900/10"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <Icon size={18} />
                </div>
                <h3 className="font-display text-[13px] font-bold text-zinc-900 dark:text-white mb-2 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                  {feature.desc}
                </p>
                
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-1.5 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">Enterprise Ready</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
