import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Database, MessageSquare, Terminal, RefreshCw, Volume2, Globe, Sparkles, Milestone, ArrowRight } from 'lucide-react';

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  desc: string;
  impact: string;
  metrics: string;
}

// Stylized Brand Vector SVGs for Ecosystem Partners
const OpenAILogo = () => (
  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current shrink-0 text-[#10a37f]" aria-hidden="true">
    <path d="M21.3,10.12a5.55,5.55,0,0,0-2.61-4.59,5.53,5.53,0,0,0-5.26-.29,5.56,5.56,0,0,0-4.63-2.52,5.61,5.61,0,0,0-5.18,3.5,5.53,5.53,0,0,0-2.6,4.6,5.55,5.55,0,0,0,2.61,4.59,5.53,5.53,0,0,0,5.26.29,5.56,5.56,0,0,0,4.63,2.52A5.61,5.61,0,0,0,19,20.22a5.53,5.53,0,0,0,2.6-4.6A5.49,5.49,0,0,0,21.3,10.12Zm-11,8.68L6.44,16.51a.63.63,0,0,1-.32-.55V11L10,13.25V18.8ZM6.29,9.45a.63.63,0,0,1,.32-.18l5.24-3V11L7,13.17,6.29,9.45ZM4.69,13l1.83-1.05V7.47A.63.63,0,0,1,6.84,7l3.83-2.21v4.44L6.84,11.39A.63.63,0,0,1,4.69,13ZM12,11l3.83-2.21V4.3a.63.63,0,0,1,.32-.18l3.83,2.21v4.44l-3.83-2.21a.63.63,0,0,1-.32.18ZM17,11.39V7a.63.63,0,0,1,.32-.55l3.83,2.21V13a.63.63,0,0,1-.32.55l-3.83-2.21ZM14,13.25V18.8l-3.83-2.21V11L14,13.25Z" />
  </svg>
);

const MicrosoftLogo = () => (
  <svg viewBox="0 0 23 23" className="h-6 w-6 shrink-0" aria-hidden="true">
    <rect x="0" y="0" width="10" height="10" fill="#f25022" />
    <rect x="12" y="0" width="10" height="10" fill="#7fba00" />
    <rect x="0" y="12" width="10" height="10" fill="#00a4ef" />
    <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
    <defs>
      <linearGradient id="google-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="30%" stopColor="#EA4335" />
        <stop offset="70%" stopColor="#FBBC05" />
        <stop offset="100%" stopColor="#34A853" />
      </linearGradient>
    </defs>
    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.882-6.437-6.437 0-3.555 2.882-6.437 6.437-6.437 1.625 0 3.097.604 4.244 1.602l3.153-3.153C19.165 2.126 15.932 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c6.88 0 12.24-5.48 12.24-12.24 0-.814-.08-1.607-.22-2.385H12.24z" fill="url(#google-brand-grad)" />
  </svg>
);

const AWSLogo = () => (
  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current shrink-0 text-[#FF9900]" aria-hidden="true">
    <path d="M22.28 15.2c-.3-.3-.7-.4-1.1-.2-1.7.9-3.7 1.4-5.8 1.4-4 0-7.6-1.7-10.1-4.4-.3-.3-.8-.3-1.1 0l-.8.8c-.3.3-.3.8 0 1.1 2.9 3.2 7.1 5.2 11.8 5.2 2.5 0 4.9-.6 6.9-1.7.4-.2.5-.6.3-1l-.9-1.2zm-1.1-1.3l.8-.8c.3-.3.2-.8-.2-1-.6-.3-1.3-.5-2-.6-.4-.1-.8.2-.8.6l-.2 1.4c-.1.4.3.7.7.6.6-.1 1.1-.1 1.7-.2z" />
  </svg>
);

const NVIDIALogo = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current shrink-0 text-[#76B900]" aria-hidden="true">
    <path d="M11.966 2.004c-3.13.047-6.096 1.423-8.087 3.793a.5.5 0 0 0 .056.704l1.325 1.057a.5.5 0 0 0 .685-.05c1.558-1.767 3.83-2.806 6.22-2.852 3.636-.07 6.845 2.227 8.013 5.736.21.63.488.948.911.948h1.22c.567 0 .912-.614.717-1.144C19.467 6.136 15.96 2.016 11.966 2.004zm-.006 3.6a6.4 6.4 0 0 0-4.8 2.2c-.2.2-.2.6 0 .8l1.1 1.1c.2.2.6.2.8 0a4 4 0 0 1 2.9-1.3c2 0 3.6 1.4 3.9 3.3.1.4.4.7.8.7h1.4c.5 0 .8-.5.7-.9-.4-3.3-3.2-5.9-6.8-5.9z" />
  </svg>
);

const AnthropicLogo = () => (
  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current shrink-0 text-[#cc5a37]" aria-hidden="true">
    <path d="M12 2L2 22h4.5l2.2-5h6.6l2.2 5H22L12 2zm1.8 11.5H10.2L12 8.3l1.8 5.2z" />
  </svg>
);

const MetaLogo = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current shrink-0 text-[#0064e0]" aria-hidden="true">
    <path d="M16.42 6c-1.84 0-3.53.86-4.42 2.33C11.11 6.86 9.42 6 7.58 6 4.5 6 2 8.5 2 11.58c0 3.08 2.5 5.58 5.58 5.58 1.84 0 3.53-.86 4.42-2.33.89 1.47 2.58 2.33 4.42 2.33 3.08 0 5.58-2.5 5.58-5.58C22 8.5 19.5 6 16.42 6zm-8.84 9c-1.89 0-3.42-1.53-3.42-3.42 0-1.89 1.53-3.42 3.42-3.42 1.25 0 2.38.67 2.97 1.77C9.35 12.16 8.35 15 7.58 15zm8.84 0c-.77 0-1.77-2.84-2.97-5.08.59-1.1 1.72-1.77 2.97-1.77 1.89 0 3.42 1.53 3.42 3.42 0 1.89-1.53 3.42-3.42 3.42z" />
  </svg>
);

const StripeLogo = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current shrink-0 text-[#635BFF]" aria-hidden="true">
    <path d="M13.92 6.51c0-1.02.77-1.63 2-1.63 1.29 0 2.27.42 2.89.81l.66-2C18.73 3.25 17.33 2.8 15.68 2.8c-3.15 0-5.18 1.63-5.18 4.47 0 4.41 6.06 3.69 6.06 5.6 0 1.13-.93 1.76-2.22 1.76-1.59 0-2.83-.55-3.66-1.11l-.69 2.05c1.02.66 2.76 1.14 4.41 1.14 3.32 0 5.48-1.59 5.48-4.59.02-4.54-6.06-3.8-6.06-5.61z" />
  </svg>
);

const SiemensLogo = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current shrink-0 text-[#00797A]" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.2 0 2.35-.21 3.43-.61l-1.32-1.32C13.29 20 12.66 20 12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 .66-.09 1.29-.24 1.9l1.45 1.45C21.71 14.35 22 13.2 22 12c0-5.52-4.48-10-10-10zm2 7H9v2h5v4H9v2h7v-6H11V9h3z" />
  </svg>
);

const BoschLogo = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-[#d51221]" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

const DeloitteLogo = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
    <rect x="2" y="5" width="13" height="13" rx="1" fill="currentColor" className="text-zinc-800 dark:text-zinc-200" />
    <circle cx="19" cy="16" r="3" fill="#86BC25" />
  </svg>
);

const AccentureLogo = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current shrink-0 text-[#A100FF]" aria-hidden="true">
    <path d="M6 4l8 8-8 8h5l8-8-8-8H6z" />
  </svg>
);

const COMPANY_LOGOS: Record<string, React.ComponentType> = {
  OpenAI: OpenAILogo,
  Microsoft: MicrosoftLogo,
  Google: GoogleLogo,
  AWS: AWSLogo,
  NVIDIA: NVIDIALogo,
  Anthropic: AnthropicLogo,
  Meta: MetaLogo,
  Stripe: StripeLogo,
  Siemens: SiemensLogo,
  Bosch: BoschLogo,
  Deloitte: DeloitteLogo,
  Accenture: AccentureLogo,
};

export default function ServicesAndCompanies() {
  const services: ServiceItem[] = [
    {
      icon: <Cpu className="text-indigo-600 dark:text-indigo-400" size={20} />,
      title: "Agentic Workflow Systems",
      badge: "Enterprise Grade",
      desc: "Architecting multi-agent orchestrations with LangGraph and CrewAI to replace brittle monolithic single-shot prompts. Supporting stateful graphs, persistent memory, and automated error-correcting loops.",
      impact: "Reduces manual operation, automates complex sequence execution with context awareness.",
      metrics: "Average 65% improvement in process completion rates vs traditional scripts."
    },
    {
      icon: <Database className="text-emerald-600 dark:text-emerald-400" size={20} />,
      title: "Semantic Search & Production RAG",
      badge: "High Recall",
      desc: "Deploying Pgvector, Qdrant, or Pinecone instances. Orchestrating hybrid search (sparse BM25 + dense neural vectors) coupled with Cohere or BGE re-rankers and custom parent-document chunkers.",
      impact: "Mitigates hallucinations, enforces strict internal policy grounding, and optimizes context windows.",
      metrics: "Under 18ms re-ranking latency, 98% relevant recall on custom corporate corpuses."
    },
    {
      icon: <MessageSquare className="text-blue-600 dark:text-blue-400" size={20} />,
      title: "LLM-As-A-Service & MCP Servers",
      badge: "Scale Architecture",
      desc: "Creating robust API layers and Model Context Protocol (MCP) servers allowing models to securely interact with private enterprise schemas, files, and developer environments.",
      impact: "Allows standard models to safely read, write, and execute database queries with fine-grained RBAC.",
      metrics: "Enterprise-grade authorization and sandboxed command enclaves."
    },
    {
      icon: <RefreshCw className="text-amber-600 dark:text-amber-400" size={20} />,
      title: "Fine-Tuning & Parameter Optimization",
      badge: "PEFT / LoRA",
      desc: "Adapting specialized open models (Llama-3, Mistral, Qwen) using Hugging Face PEFT/LoRA adapters, QLoRA quantization, and customized dataset curation for specific business jargon.",
      impact: "Unlocks highly specialized logic, mimics company tone, and reduces reliance on expensive proprietary APIs.",
      metrics: "Up to 40% inference latency reductions and 60% host hardware cost savings."
    }
  ];

  const targetCompanies = [
    { name: "OpenAI", logo: "OpenAI", hoverColor: "hover:text-emerald-500 dark:hover:text-emerald-400" },
    { name: "Microsoft AI", logo: "Microsoft", hoverColor: "hover:text-blue-500 dark:hover:text-blue-400" },
    { name: "Google DeepMind", logo: "Google", hoverColor: "hover:text-red-500 dark:hover:text-red-400" },
    { name: "AWS Cloud", logo: "AWS", hoverColor: "hover:text-amber-500 dark:hover:text-amber-400" },
    { name: "NVIDIA AI", logo: "NVIDIA", hoverColor: "hover:text-green-500 dark:hover:text-green-400" },
    { name: "Anthropic", logo: "Anthropic", hoverColor: "hover:text-orange-500 dark:hover:text-orange-400" },
    { name: "Meta AI", logo: "Meta", hoverColor: "hover:text-indigo-500 dark:hover:text-indigo-400" },
    { name: "Stripe", logo: "Stripe", hoverColor: "hover:text-purple-500 dark:hover:text-purple-400" },
    { name: "Siemens", logo: "Siemens", hoverColor: "hover:text-teal-500 dark:hover:text-teal-400" },
    { name: "Bosch", logo: "Bosch", hoverColor: "hover:text-rose-500 dark:hover:text-rose-400" },
    { name: "Deloitte", logo: "Deloitte", hoverColor: "hover:text-emerald-600 dark:hover:text-emerald-500" },
    { name: "Accenture", logo: "Accenture", hoverColor: "hover:text-purple-600 dark:hover:text-purple-500" }
  ];

  return (
    <section id="services-and-industries" className="mx-auto max-w-7xl px-6 py-20 md:px-8 border-t border-zinc-200/80 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20">
      
      {/* Services Title */}
      <div className="max-w-3xl mb-14">
        <div className="inline-flex items-center gap-1.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-[9px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          <Sparkles size={10} />
          <span>04 / Enterprise Solutions</span>
        </div>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-2.5">
          Consulting Services &amp; <span className="font-serif italic font-light text-indigo-600 dark:text-indigo-400">ROI-Driven Delivery</span>
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
          I provide professional B2B contract consulting, systems design, and custom machine learning pipelines for corporations looking to integrate artificial intelligence safely and predictably.
        </p>
      </div>

      {/* Services Bento Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:items-stretch">
        {services.map((svc, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
            className="group relative rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-750 hover:shadow-md transition duration-300 overflow-hidden"
          >
            {/* Soft background glow */}
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-indigo-500/[0.015] dark:bg-indigo-500/[0.02] blur-3xl group-hover:scale-125 transition-transform duration-500" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800">
                  {svc.icon}
                </div>
                {svc.badge && (
                  <span className="inline-flex items-center rounded px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border border-zinc-150 dark:border-zinc-805">
                    {svc.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display text-sm font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider font-mono">
                  {svc.title}
                </h3>
                <p className="text-xs text-zinc-550 dark:text-zinc-400 font-light mt-2 leading-relaxed">
                  {svc.desc}
                </p>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3 space-y-2.5 font-sans text-xs">
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-bold uppercase tracking-wider">Business Impact Spec</div>
                <div className="text-zinc-650 dark:text-zinc-350 leading-relaxed font-light">
                  <strong className="font-semibold text-zinc-850 dark:text-zinc-200">Value Add: </strong>{svc.impact}
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3 mt-4 relative z-10 flex justify-between items-center text-[10px] font-mono">
              <span className="text-zinc-450 dark:text-zinc-550 uppercase tracking-widest font-bold">Metrics Proven</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">{svc.metrics}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Target Companies & Target Industries Marquee */}
      <div className="mt-16 pt-10 border-t border-zinc-150 dark:border-zinc-850">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-455 dark:text-zinc-500 font-bold">
            <Milestone size={11} className="text-indigo-500" />
            <span>Target Sectors &amp; Collaborator Ecosystem</span>
          </div>
          <span className="text-[9px] text-zinc-400 font-light italic">Built with production compliance standards</span>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden py-4 border-y border-zinc-200/50 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/30 select-none">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div className="flex w-max animate-marquee space-x-12 pr-12">
            {/* Repeat list twice for seamless looping */}
            {[...targetCompanies, ...targetCompanies].map((company, index) => {
              const LogoComponent = COMPANY_LOGOS[company.logo];
              return (
                <div
                  key={index}
                  className={`group flex items-center space-x-2.5 text-zinc-400/80 dark:text-zinc-500/85 ${company.hoverColor} transition-all duration-300 cursor-pointer`}
                >
                  {LogoComponent ? (
                    <div className="grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                      <LogoComponent />
                    </div>
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-indigo-500/25 dark:bg-indigo-500/40" />
                  )}
                  <span className="font-display font-black text-xs tracking-wider uppercase">{company.name}</span>
                  <span className="text-[9px] font-mono text-zinc-300 dark:text-zinc-700">|</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive CTA to Book Call / Consult */}
      <div className="mt-12 rounded-xl border border-indigo-150/40 dark:border-indigo-950/40 bg-indigo-50/[0.15] dark:bg-indigo-950/[0.08] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-display text-sm font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider font-mono">
            Secure an AI Architectural Assessment
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            Discuss your system metrics, model limitations, or agentic automation roadmap. Let's design a high-ROI blueprint.
          </p>
        </div>

        <button
          onClick={() => {
            const event = new CustomEvent('set-contact-tab', { detail: 'calendly' });
            window.dispatchEvent(event);
            const el = document.getElementById('business-inquiry-desk');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold uppercase tracking-wider text-[10px] px-5 py-3 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition group"
        >
          <span>Book Assessment Call</span>
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </section>
  );
}
