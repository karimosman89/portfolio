import React, { useState } from 'react';
import { EXPERIENCES, EDUCATION, CERTIFICATIONS, LANGUAGES } from '../data';
import { Briefcase, Calendar, MapPin, ChevronDown, ChevronUp, Cpu, Award, BookOpen, Languages, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ExperienceTimeline() {
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const toggleChallenge = (id: string) => {
    setExpandedChallenge(expandedChallenge === id ? null : id);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.12,
      }
    }
  };

  return (
    <motion.section
      id="career-and-education"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className="mx-auto max-w-7xl px-6 py-16 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        
        {/* Experience Timeline (Left 8 Columns) */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[9px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              <Briefcase size={10} />
              <span>03 / Professional Milestones</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
              Career Experience <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">&amp; Contracts</span>
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Detailed tracking of engineered AI models, production system rollouts, and quantitative value added.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 pl-6 space-y-12"
          >
            {EXPERIENCES.map((exp, index) => (
              <motion.div key={exp.company} variants={itemVariants} className="relative group">
                
                {/* Timeline node connection */}
                <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-white dark:bg-zinc-900 border-2 border-indigo-600 dark:border-indigo-400 group-hover:bg-indigo-600 transition-all duration-300" />

                <div className="space-y-4">
                  {/* Meta tag details */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/45 border border-indigo-100 dark:border-indigo-900/40 px-2.5 py-1 rounded flex items-center gap-1.5">
                      <Calendar size={11} /> {exp.period}
                    </span>
                    <span className="font-mono text-zinc-455 dark:text-zinc-500 flex items-center gap-1.5">
                      <MapPin size={11} /> {exp.location}
                    </span>
                  </div>

                  {/* Header Titles */}
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {exp.role}
                    </h3>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                      {exp.company}
                    </h4>
                  </div>

                  {/* Short description */}
                  <p className="text-sm text-zinc-600 dark:text-zinc-350 font-light leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Accomplishment bullet points */}
                  <ul className="space-y-2.5 font-sans">
                    {exp.bulletPoints.map((bullet, idx) => {
                      const parts = bullet.split(':');
                      const label = parts[0];
                      const details = parts.slice(1).join(':');

                      return (
                        <li key={idx} className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed flex items-start gap-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 mt-1.5" />
                          <div>
                            <span className="font-bold text-zinc-850 dark:text-zinc-200">{label}:</span>
                            <span className="font-light text-zinc-550 dark:text-zinc-400"> {details}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Technology Tag Badge Grid */}
                  {exp.modelsUsed && exp.modelsUsed.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-450 dark:text-zinc-550 mr-1 flex items-center gap-1 font-mono">
                        <Cpu size={10} /> Stack:
                      </span>
                      {exp.modelsUsed.map((model) => (
                        <span
                          key={model}
                          className="inline-block rounded bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 px-2 py-0.5 text-[9px] font-mono text-zinc-600 dark:text-zinc-350"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Expandable Technical Challenges Solved */}
                  {exp.challengesSolved && exp.challengesSolved.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-800 space-y-3 font-sans">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 font-mono">
                        <Sparkles size={11} /> Deep-Tech Bottlenecks Overcome
                      </h5>
                      
                      <div className="grid gap-2.5">
                        {exp.challengesSolved.map((challenge, cIdx) => {
                          const challengeId = `${index}-${cIdx}`;
                          const isExpanded = expandedChallenge === challengeId;

                          return (
                            <div
                              key={challenge.title}
                              className={`rounded border transition-all duration-350 ${
                                isExpanded 
                                  ? 'border-indigo-150/40 dark:border-indigo-950 bg-indigo-50/10 dark:bg-indigo-950/10' 
                                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/20 hover:border-zinc-300 dark:hover:border-zinc-750'
                              }`}
                            >
                              <button
                                onClick={() => toggleChallenge(challengeId)}
                                className="cursor-pointer w-full flex items-center justify-between p-4.5 text-left text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
                              >
                                <span>{challenge.title}</span>
                                {isExpanded ? (
                                  <ChevronUp size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                                ) : (
                                  <ChevronDown size={14} className="text-zinc-450 dark:text-zinc-550 shrink-0" />
                                )}
                              </button>

                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                    className="overflow-hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                  >
                                    <div className="p-4 space-y-3 text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed font-light">
                                      <div>
                                        <span className="font-mono text-[9px] text-rose-600 dark:text-rose-400 block mb-0.5 uppercase tracking-wide">Problem / Bottleneck:</span>
                                        {challenge.challenge}
                                      </div>
                                      <div>
                                        <span className="font-mono text-[9px] text-indigo-650 dark:text-indigo-400 block mb-0.5 uppercase tracking-wide">Custom Solution Architecture:</span>
                                        {challenge.solution}
                                      </div>
                                      <div className="bg-indigo-50/50 dark:bg-indigo-950/25 rounded p-3.5 border border-indigo-100/50 dark:border-indigo-900/30 text-zinc-700 dark:text-zinc-300">
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-1 font-mono text-[10px] uppercase">
                                          <CheckCircle2 size={13} /> Validated Business Impact:
                                        </span>
                                        {challenge.impact}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Credentials Sidebar (Right 4 Columns) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-4 space-y-10"
        >
          
          {/* Education Block */}
          <div className="space-y-5">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h2 className="font-display text-base font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                <BookOpen size={15} className="text-indigo-600 dark:text-indigo-400" />
                Education &amp; Credentials
              </h2>
            </div>
            
            <div className="space-y-4">
              {EDUCATION.map((edu) => (
                <div key={edu.degree} className="rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 p-5 space-y-3.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/45 px-2.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40">
                      {edu.period}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-500 font-mono">{edu.location}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-display text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-snug font-sans">
                      {edu.degree}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mt-1">
                      {edu.institution}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed font-light font-sans">
                    {edu.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Block */}
          <div className="space-y-5">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h2 className="font-display text-base font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                <Award size={15} className="text-indigo-600 dark:text-indigo-400" />
                Certifications
              </h2>
            </div>
            
            <div className="space-y-3.5">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.title} className="flex items-start justify-between gap-4 text-xs rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 p-3.5 font-sans">
                  <div className="space-y-1">
                    <div className="font-bold text-zinc-800 dark:text-zinc-200">{cert.title}</div>
                    <div className="text-zinc-500 dark:text-zinc-400 text-[11px]">{cert.issuer}</div>
                  </div>
                  <span className={`shrink-0 inline-block px-2.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    cert.status === 'Completed' 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/40' 
                      : 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border border-yellow-100/65 dark:border-yellow-900/30'
                  }`}>
                    {cert.year === 'In Progress' ? 'In Progress' : cert.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages Block */}
          <div className="space-y-5">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h2 className="font-display text-base font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                <Languages size={15} className="text-indigo-600 dark:text-indigo-400" />
                Language Fluency
              </h2>
            </div>
            
            <div className="grid gap-2">
              {LANGUAGES.map((lang) => (
                <div key={lang.name} className="flex justify-between items-center text-xs rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/15 p-3.5 font-sans">
                  <span className="font-bold text-zinc-700 dark:text-zinc-200">{lang.name}</span>
                  <span className="font-mono text-zinc-650 dark:text-zinc-350 text-[10px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </motion.div>

      </div>
    </motion.section>
  );
}
