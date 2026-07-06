import React, { useState } from 'react';
import { Mail, Briefcase, Building2, Send, CheckCircle2, MessageSquare, Sparkles, Cpu, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    projectType: 'B2B Consulting',
    budget: 'Not Specified',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ inquiryId: string; aiAssessment: string } | null>(null);

  const projectTypes = [
    { label: 'B2B Consulting', value: 'B2B Consulting', description: 'Enterprise AI & MLOps advisory' },
    { label: 'Freelance Project', value: 'Freelance Project', description: 'End-to-end model development' },
    { label: 'Full-time Hire', value: 'Full-time Hire', description: 'Strategic leadership or Senior AI engineer roles' },
    { label: 'General Discussion', value: 'General Discussion', description: 'Partnerships & general inquiry' }
  ];

  const budgetOptions = [
    'Not Specified',
    'Under €5,000',
    '€5,000 - €15,000',
    '€15,000 - €50,000',
    '€50,000+ / Enterprise'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, projectType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill out all required fields (Name, Email, and Message).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry. Please try again or email directly.');
      }

      const data = await response.json();
      if (data.success) {
        setSuccessData({
          inquiryId: data.inquiryId,
          aiAssessment: data.aiAssessment
        });
      } else {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please contact Karim directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      projectType: 'B2B Consulting',
      budget: 'Not Specified',
      message: ''
    });
    setSuccessData(null);
    setError(null);
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
      id="business-inquiry-desk"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className="mx-auto max-w-7xl px-6 py-16 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        
        {/* Pitch Sidebar (Left 4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[9px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              <Sparkles size={10} />
              <span>07 / Collaboration Hub</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
              Initiate <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">Correspondence</span>
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Have an upcoming product launch, corporate AI consultation, or high-impact freelance development requirement?
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 p-5 space-y-4 font-sans text-xs">
              <h3 className="font-display font-extrabold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-mono">
                <Cpu size={12} className="text-indigo-600" />
                Tailored AI Solutions
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                Secure a dedicated specialist for custom LLM alignment, production-grade RAG systems, or industrial computer vision models deployed at the edge.
              </p>
              
              <ul className="space-y-2 font-light text-zinc-550 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                  <span>Immediate architectural feasibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                  <span>B2B Contract &amp; hourly consultancies</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                  <span>Worldwide delivery (EU passport)</span>
                </li>
              </ul>
            </div>

            <div className="rounded border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 p-4.5 text-[11px] text-zinc-500 dark:text-zinc-450 leading-relaxed font-mono font-light space-y-1.5">
              <div>Direct Email: <a href="mailto:karim.programmer2020@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">karim.programmer2020@gmail.com</a></div>
              <div>Telephone EU: <span className="text-zinc-700 dark:text-zinc-300 font-bold">+39 320 950 4754</span></div>
              <div>Secondary: <span className="text-zinc-700 dark:text-zinc-300 font-bold">+33 7 66 62 9970</span></div>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Desk (Right 8 Columns) */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-850 p-6 md:p-8 relative overflow-hidden shadow-sm dark:shadow-none">
          
          <AnimatePresence mode="wait">
            {!successData ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 font-sans text-xs"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                    Select Inquiry Profile *
                  </label>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {projectTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTypeSelect(type.value)}
                        className={`cursor-pointer text-left p-3.5 rounded border transition-all duration-200 ${
                          formData.projectType === type.value
                            ? 'border-indigo-150/50 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-400 font-semibold'
                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/15 text-zinc-650 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="font-bold text-[11px]">{type.label}</div>
                        <div className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono font-light mt-0.5">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="name-input" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <input
                        id="name-input"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full rounded border border-zinc-200 dark:border-zinc-850 bg-zinc-50/30 dark:bg-zinc-950/30 px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition font-sans text-xs"
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email-input" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                      Corporate / Contact Email *
                    </label>
                    <div className="relative">
                      <input
                        id="email-input"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className="w-full rounded border border-zinc-200 dark:border-zinc-850 bg-zinc-50/30 dark:bg-zinc-950/30 px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition font-sans text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Company name */}
                  <div className="space-y-1.5">
                    <label htmlFor="company-input" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                      Organization / Company
                    </label>
                    <div className="relative">
                      <input
                        id="company-input"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                        className="w-full rounded border border-zinc-200 dark:border-zinc-850 bg-zinc-50/30 dark:bg-zinc-950/30 px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition font-sans text-xs"
                      />
                    </div>
                  </div>

                  {/* Estimated budget / scope dropdown */}
                  <div className="space-y-1.5">
                    <label htmlFor="budget-select" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                      Project Scale / Budget Estimate
                    </label>
                    <div className="relative">
                      <select
                        id="budget-select"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full rounded border border-zinc-200 dark:border-zinc-850 bg-zinc-50/30 dark:bg-zinc-950/30 px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition font-sans text-xs"
                      >
                        {budgetOptions.map(option => (
                          <option key={option} value={option} className="dark:bg-zinc-950">
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message text area */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="message-input" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                      Project Scope &amp; Deliverables *
                    </label>
                    <span className="text-[9px] text-zinc-400 font-mono font-light">Markdown supported</span>
                  </div>
                  <textarea
                    id="message-input"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your project, objectives, tech stack, timeline, or key consulting issues you need resolved..."
                    className="w-full rounded border border-zinc-200 dark:border-zinc-850 bg-zinc-50/30 dark:bg-zinc-950/30 px-3.5 py-2.5 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none transition font-sans text-xs leading-relaxed"
                  />
                </div>

                {error && (
                  <div className="rounded border border-red-200 bg-red-50/30 p-3.5 text-xs text-red-650 flex items-start gap-2 animate-shake">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Action submit button */}
                <div className="pt-2">
                  <motion.button
                    id="submit-inquiry-btn"
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="cursor-pointer w-full rounded border border-zinc-900 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-950 text-white font-mono font-bold uppercase tracking-wider text-xs px-5 py-3.5 hover:bg-zinc-800 dark:hover:bg-zinc-900 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={13} className="animate-spin text-indigo-400" />
                        <span>Running AI Project Assessment &amp; Archiving...</span>
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        <span>Transmit Secure Business Proposal</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success-container"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-xs"
              >
                {/* Visual success head */}
                <div className="flex items-start gap-4 p-5 rounded border border-emerald-100/60 dark:border-emerald-900/30 bg-emerald-50/15 dark:bg-emerald-950/10">
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 p-2.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 size={18} />
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-display text-sm font-extrabold text-zinc-800 dark:text-zinc-100">
                      Transmission Successful!
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                      Your proposal has been securely saved to the server’s local inquiries ledger.
                    </p>
                    <div className="text-[10px] text-zinc-450 dark:text-zinc-500 font-mono pt-1">
                      Inquiry ID: <span className="font-bold text-zinc-650 dark:text-zinc-350">{successData.inquiryId}</span>
                    </div>
                  </div>
                </div>

                {/* Co-pilot Live Assessment */}
                <div className="rounded border border-indigo-150/40 dark:border-indigo-950/80 bg-indigo-50/10 dark:bg-indigo-950/10 overflow-hidden font-sans">
                  
                  {/* Co-pilot Title Bar */}
                  <div className="border-b border-indigo-150/40 dark:border-indigo-950/80 bg-indigo-50/30 dark:bg-indigo-950/30 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-indigo-100 dark:bg-indigo-950 p-1 text-indigo-600">
                        <Cpu size={12} className="animate-pulse" />
                      </span>
                      <h4 className="font-display font-bold uppercase tracking-wider text-[10px] text-indigo-700 dark:text-indigo-400 font-mono">
                        Karim's AI Co-pilot Assessment
                      </h4>
                    </div>
                    <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900">
                      Model: Gemini 3.5 Flash
                    </span>
                  </div>

                  {/* Assessment Text Box */}
                  <div className="p-5 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 leading-relaxed font-light text-xs space-y-3 font-sans whitespace-pre-wrap border-b border-indigo-50/50 dark:border-indigo-950/40">
                    {successData.aiAssessment}
                  </div>
                  
                  {/* Assessment Footer info */}
                  <div className="px-5 py-3 bg-zinc-50/50 dark:bg-zinc-950/40 text-[10px] text-zinc-500 dark:text-zinc-450 font-mono flex items-center justify-between">
                    <span>Generated live based on Karim’s real ML competencies</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">● System ready</span>
                  </div>

                </div>

                {/* Return CTA button */}
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="cursor-pointer inline-flex items-center gap-2 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    <span>Send Another Inquiry</span>
                  </motion.button>
                  <a
                    href={`mailto:${formData.email}?subject=Follow%20up%20on%20AI%20Project%20Inquiry`}
                    className="text-xs font-mono font-bold text-indigo-600 hover:underline px-2"
                  >
                    Send copy to self
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </motion.section>
  );
}
