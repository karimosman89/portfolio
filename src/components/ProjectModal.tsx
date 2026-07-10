import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Cpu, CheckCircle2, AlertTriangle, ArrowRight, Share2, Mail } from 'lucide-react';
import { Experience } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Experience | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 dark:bg-zinc-950/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="relative w-full max-w-3xl bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-850 shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col font-sans"
          >
            {/* Header section with solid title */}
            <div className="p-6 md:p-8 border-b border-zinc-200 dark:border-zinc-850 flex items-start justify-between bg-zinc-50/50 dark:bg-zinc-950/20">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/45 px-2.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-1.5">
                    <Calendar size={11} /> {project.period}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <MapPin size={11} /> {project.location}
                  </span>
                </div>
                
                <h3 className="font-display text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                  {project.role}
                </h3>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                  {project.company}
                </h4>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="cursor-pointer p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                aria-label="Close case study details"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
              
              {/* Short Summary Description */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 font-mono">
                  General Overview
                </h5>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-light font-sans">
                  {project.description}
                </p>
              </div>

              {/* Production Accomplishments Blueprint */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 font-mono">
                  Technical Accomplishment Blueprint
                </h5>
                <ul className="space-y-3">
                  {project.bulletPoints.map((bullet, idx) => {
                    const parts = bullet.split(':');
                    const label = parts[0];
                    const details = parts.slice(1).join(':');

                    return (
                      <li key={idx} className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed flex items-start gap-3">
                        <span className="rounded bg-indigo-50 dark:bg-indigo-950/60 p-1.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                          <CheckCircle2 size={11} />
                        </span>
                        <div>
                          <span className="font-bold text-zinc-850 dark:text-zinc-150">{label}:</span>
                          <span className="font-light"> {details}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Deep-Tech Challenges Solved */}
              {project.challengesSolved && project.challengesSolved.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 font-mono">
                    Deep-Tech Engineering Case Studies
                  </h5>
                  
                  <div className="grid gap-4">
                    {project.challengesSolved.map((challenge) => (
                      <div 
                        key={challenge.title}
                        className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-5 space-y-4"
                      >
                        <h6 className="font-display font-extrabold text-sm text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                          <AlertTriangle size={14} className="text-rose-500" />
                          {challenge.title}
                        </h6>

                        <div className="grid gap-3.5 md:grid-cols-2 text-xs">
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">Critical Bottleneck:</span>
                            <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">{challenge.challenge}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] text-indigo-500 uppercase tracking-wider block">Resolution Strategy:</span>
                            <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">{challenge.solution}</p>
                          </div>
                        </div>

                        <div className="bg-indigo-50/30 dark:bg-indigo-950/10 rounded border border-indigo-100/40 dark:border-indigo-950/60 p-3 flex items-start gap-2 text-xs">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono uppercase text-[10px] tracking-wide block">Validated Quantifiable Outcome:</span>
                            <p className="text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">{challenge.impact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Models / Tech Stack Used */}
              {project.modelsUsed && project.modelsUsed.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 font-mono">
                    Underlying Infrastructure &amp; Models
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {project.modelsUsed.map((model) => (
                      <span
                        key={model}
                        className="rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-xs font-mono text-zinc-700 dark:text-zinc-350 flex items-center gap-1.5"
                      >
                        <Cpu size={11} className="text-indigo-500" />
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer with modal actions */}
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-850 flex flex-wrap items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-950/20">
              <div className="text-[10px] font-mono text-zinc-400">
                SECURE RECORD AUDIT OK
              </div>
              
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:karim.programmer2020@gmail.com?subject=Inquiry%20regarding%2520your%20experience%20at%20${encodeURIComponent(project.company)}`}
                  className="rounded border border-zinc-900 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-950 text-white font-mono font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 hover:bg-zinc-800 dark:hover:bg-zinc-900 flex items-center gap-1.5 transition-colors"
                >
                  <Mail size={12} />
                  <span>Discuss Project Details</span>
                </a>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
