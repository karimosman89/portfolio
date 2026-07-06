import React from 'react';
import { SKILL_CATEGORIES } from '../data';
import { Code, Layers, Sparkles, Cloud, Database, Cpu, Milestone } from 'lucide-react';
import { motion } from 'motion/react';

const categoryIcons: Record<string, any> = {
  "Programming & Development": Code,
  "AI/ML Frameworks": Layers,
  "Advanced AI Specialties": Sparkles,
  "Cloud & MLOps": Cloud,
  "Data Engineering & Tools": Database,
  "Emerging Technologies": Cpu
};

export default function SkillsBento() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
      }
    }
  };

  return (
    <motion.section
      id="skills-stack"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className="mx-auto max-w-7xl px-6 py-16 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800"
    >
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[9px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <Milestone size={10} />
            <span>04 / Capability Index</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
            Skill Matrix <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">&amp; Stack</span>
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Proven competencies across machine learning frameworks, enterprise infrastructure models, and programming languages.
          </p>
        </div>
        
        <div className="text-xs text-zinc-500 dark:text-zinc-500 font-mono">
          <span>6 Categories // 40+ Tooling profiles</span>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SKILL_CATEGORIES.map((cat) => {
          const IconComponent = categoryIcons[cat.title] || Code;

          return (
            <motion.div
              key={cat.title}
              variants={itemVariants}
              whileHover={{ y: -3, borderColor: "rgba(79, 70, 229, 0.35)" }}
              transition={{ duration: 0.2 }}
              className="rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 p-6 transition-all"
            >
              <div className="flex items-center gap-2.5 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-5">
                <span className="rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 text-indigo-600 dark:text-indigo-400">
                  <IconComponent size={16} />
                </span>
                <h3 className="font-display text-sm font-extrabold text-zinc-850 dark:text-zinc-100 font-sans">
                  {cat.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => {
                  const isHighlight = skill.includes("(Expert)") || skill.includes("YOLO") || skill.includes("RAG") || skill.includes("Fine-tuning") || skill.includes("Kubernetes") || skill.includes("PyTorch");
                  
                  return (
                    <motion.span
                      key={skill}
                      whileHover={{ 
                        scale: 1.06,
                        y: -1,
                        boxShadow: isHighlight 
                          ? "0 4px 16px -2px rgba(99, 102, 241, 0.45)" 
                          : "0 4px 12px -2px rgba(99, 102, 241, 0.15)"
                      }}
                      transition={{ type: "spring", stiffness: 450, damping: 16 }}
                      className={`text-xs px-3 py-1.5 rounded font-mono tracking-tight flex items-center gap-1.5 cursor-default select-none border transition-colors ${
                        isHighlight
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-150/65 dark:border-indigo-900/50 font-semibold'
                          : 'bg-white dark:bg-zinc-900 text-zinc-650 dark:text-zinc-350 border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {isHighlight && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500 inline-block animate-pulse shrink-0" />
                      )}
                      <span>{skill}</span>
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
