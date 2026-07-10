import { Experience, SkillCategory, BlogPost, GithubRepo, Metric, Service, Testimonial, AgentCapability, Stat } from './types';

export const PERSONAL_INFO = {
  name: "Karim Osman",
  title: "Senior AI Engineer",
  roles: [
    "Enterprise AI Systems",
    "Generative AI Engineer",
    "LLM & RAG Architect",
    "Multi-Agent Systems Developer",
    "AI Automation Architect",
  ],
  subtitle: "Generative AI · LLM Architect · Multi-Agent Systems · B2B & Enterprise Solutions",
  location: "Siena, Tuscany, Italy · Worldwide (Remote)",
  email: "karim.programmer2020@gmail.com",
  linkedin: "https://www.linkedin.com/in/karimosman89/",
  github: "https://github.com/karimosman89",
  calendly: "https://calendly.com/karimosman89/30min",
  x: "https://x.com/karimosman89",
  medium: "https://medium.com/@karimosman89",
  devto: "https://dev.to/karimosman89",
  youtube: "https://youtube.com/@karimosman89",
  phoneItaly: "+39 34 70 70 1100",
  phoneFrance: "+33 7 66 62 9970",
  portrait: "/images/karim_portrait.png",
  summaryEn: "Result-oriented Senior AI Engineer and B2B Consultant with 5+ years of experience designing and shipping scalable AI/ML solutions for international enterprise clients across Europe. I specialize in Generative AI, RAG architectures, LLM fine-tuning (LoRA/PEFT), multi-agent systems, and multimodal Computer Vision (YOLO). I turn research prototypes into production-grade systems with 99.9% uptime and measurable business ROI.",
  summaryIt: "Senior AI Engineer e Consulente B2B orientato ai risultati con oltre 5 anni di esperienza nella progettazione e implementazione di soluzioni scalabili di AI/ML per clienti internazionali. Specializzato in Intelligenza Artificiale Generativa, sistemi RAG, fine-tuning di LLM, sistemi multi-agente e Computer Vision multimodale. Trasformo prototipi in sistemi production-ready ad alta affidabilità con ROI misurabile.",
};

export const KEY_METRICS: Metric[] = [
  { id: "uptime", value: "99.9%", label: "SYSTEM UPTIME", sublabel: "Multi-region AWS auto-scaling" },
  { id: "users", value: "500+", label: "GLOBAL TEAM USERS", sublabel: "Across 15+ countries" },
  { id: "perf", value: "-40%", label: "INFERENCE LATENCY", sublabel: "LoRA + INT8 quantization" },
  { id: "revenue", value: "€2M+", label: "ANNUAL REVENUE IMPACT", sublabel: "AI recommendation systems" },
];

export const STATS: Stat[] = [
  { id: "projects", value: 45, suffix: "+", prefix: "", label: "AI Projects Delivered", icon: "Rocket" },
  { id: "clients", value: 20, suffix: "+", prefix: "", label: "Enterprise Clients", icon: "Building2" },
  { id: "models", value: 60, suffix: "+", prefix: "", label: "Models Deployed", icon: "Brain" },
  { id: "countries", value: 15, suffix: "+", prefix: "", label: "Countries Served", icon: "Globe2" },
  { id: "hours", value: 12000, suffix: "+", prefix: "", label: "Hours Automated", icon: "Timer" },
  { id: "satisfaction", value: 98, suffix: "%", prefix: "", label: "Client Satisfaction", icon: "Heart" },
];

export const SERVICES: Service[] = [
  {
    id: "custom-ai",
    title: "Custom AI Applications",
    description: "End-to-end design and delivery of production-grade AI products tailored to your business logic and data.",
    icon: "Boxes",
    tag: "Most Requested",
    bullets: ["Full-stack AI apps (React + FastAPI)", "Domain-specific model tuning", "Secure deployment & monitoring"],
  },
  {
    id: "rag",
    title: "RAG & Knowledge Systems",
    description: "Enterprise Retrieval-Augmented Generation over your documents with citations, guardrails and multi-tenancy.",
    icon: "Database",
    bullets: ["Hybrid vector + keyword search", "Reranking & citation layer", "10k+ docs/day pipelines"],
  },
  {
    id: "agents",
    title: "AI Agents & Automation",
    description: "Autonomous multi-agent workflows that plan, use tools, call functions and complete real work end-to-end.",
    icon: "Workflow",
    tag: "Cutting Edge",
    bullets: ["LangGraph / CrewAI / AutoGen", "MCP & A2A integrations", "Human-in-the-loop controls"],
  },
  {
    id: "chatbots",
    title: "Enterprise Chatbots",
    description: "Branded, grounded assistants for support, sales and internal knowledge — with analytics and fallbacks.",
    icon: "MessageSquareText",
    bullets: ["Grounded, hallucination-safe", "Omnichannel deployment", "CRM & helpdesk integrations"],
  },
  {
    id: "voice",
    title: "Voice AI",
    description: "Low-latency conversational voice agents for calls, IVR and hands-free enterprise experiences.",
    icon: "AudioLines",
    bullets: ["Realtime speech-to-speech", "Telephony (Twilio) ready", "Multilingual support"],
  },
  {
    id: "cv",
    title: "Computer Vision",
    description: "Object detection, defect inspection and OCR for industrial and enterprise pipelines at the edge.",
    icon: "ScanEye",
    bullets: ["YOLO v8 defect detection", "Edge (Jetson / TensorRT)", "+22% inspection accuracy"],
  },
  {
    id: "llmops",
    title: "LLMOps & MLOps",
    description: "CI/CD for models: evaluation, observability, cost control and reliable multi-region deployment.",
    icon: "GitBranch",
    bullets: ["Eval & guardrail harnesses", "Cost & latency optimization", "-25% infra cost"],
  },
  {
    id: "consulting",
    title: "AI Strategy & Consulting",
    description: "Roadmaps, feasibility, architecture reviews and team enablement to de-risk your AI investment.",
    icon: "Compass",
    bullets: ["AI opportunity mapping", "Architecture & vendor review", "Team training & mentoring"],
  },
];

export const AGENT_CAPABILITIES: AgentCapability[] = [
  { id: "multi-agent", title: "Multi-Agent Systems", description: "Orchestrated teams of specialist agents that collaborate, delegate and self-correct to solve complex tasks.", icon: "Network", tags: ["LangGraph", "CrewAI", "AutoGen"] },
  { id: "rag", title: "RAG Pipelines", description: "Grounded retrieval with hybrid search, reranking and citations for factual, trustworthy answers.", icon: "Database", tags: ["Pinecone", "FAISS", "BGE"] },
  { id: "mcp", title: "MCP Servers", description: "Model Context Protocol servers that expose tools, data and resources to any compatible AI client.", icon: "Plug", tags: ["MCP", "Tools", "Resources"] },
  { id: "a2a", title: "A2A Protocol", description: "Agent-to-Agent communication so autonomous services can negotiate and cooperate across systems.", icon: "ArrowLeftRight", tags: ["A2A", "Interop"] },
  { id: "function", title: "Function Calling", description: "Structured tool use so LLMs can query APIs, run code and take real actions reliably.", icon: "FunctionSquare", tags: ["Tools", "JSON Schema"] },
  { id: "memory", title: "Memory Systems", description: "Short and long-term memory with vector stores so agents remember context across sessions.", icon: "BrainCircuit", tags: ["Episodic", "Semantic"] },
  { id: "long-context", title: "Long Context", description: "Handling 100k+ token contexts with chunking, compression and hierarchical retrieval strategies.", icon: "AlignLeft", tags: ["128k+", "Compression"] },
  { id: "computer-use", title: "Computer Use", description: "Agents that navigate GUIs and browsers to complete tasks the way a human operator would.", icon: "MousePointerClick", tags: ["Browser", "Automation"] },
  { id: "voice", title: "Voice Agents", description: "Realtime speech-to-speech agents for phone and hands-free experiences with sub-second latency.", icon: "AudioLines", tags: ["Realtime", "STT/TTS"] },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages & Backend",
    icon: "Code2",
    skills: [
      { name: "Python", level: 98 }, { name: "TypeScript", level: 90 }, { name: "JavaScript", level: 90 },
      { name: "FastAPI", level: 92 }, { name: "Node.js", level: 85 }, { name: "SQL", level: 88 },
    ],
  },
  {
    title: "GenAI & LLM Frameworks",
    icon: "Sparkles",
    skills: [
      { name: "LangChain", level: 95 }, { name: "LangGraph", level: 92 }, { name: "CrewAI", level: 88 },
      { name: "AutoGen", level: 85 }, { name: "Hugging Face", level: 93 }, { name: "LlamaIndex", level: 87 },
    ],
  },
  {
    title: "Models & Providers",
    icon: "Brain",
    skills: [
      { name: "OpenAI", level: 95 }, { name: "Anthropic", level: 93 }, { name: "Gemini", level: 90 },
      { name: "Llama", level: 90 }, { name: "Mistral", level: 88 }, { name: "RAG / Vector DB", level: 94 },
    ],
  },
  {
    title: "ML / Deep Learning",
    icon: "Cpu",
    skills: [
      { name: "PyTorch", level: 93 }, { name: "TensorFlow", level: 87 }, { name: "Computer Vision (YOLO)", level: 90 },
      { name: "LoRA / PEFT", level: 92 }, { name: "Quantization", level: 88 }, { name: "Reinforcement Learning", level: 80 },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: "Cloud",
    skills: [
      { name: "AWS", level: 92 }, { name: "Azure", level: 84 }, { name: "GCP", level: 84 },
      { name: "Docker", level: 93 }, { name: "Kubernetes", level: 85 }, { name: "CI/CD (GitHub Actions)", level: 88 },
    ],
  },
  {
    title: "Data & MLOps",
    icon: "Database",
    skills: [
      { name: "PostgreSQL", level: 90 }, { name: "Redis", level: 87 }, { name: "MongoDB", level: 84 },
      { name: "Pinecone / FAISS", level: 90 }, { name: "MLflow / Airflow", level: 86 }, { name: "LLMOps", level: 88 },
    ],
  },
];

export const TECH_RADAR = [
  { name: "LangGraph", ring: "adopt", quadrant: "agents" },
  { name: "MCP", ring: "adopt", quadrant: "agents" },
  { name: "RAG", ring: "adopt", quadrant: "genai" },
  { name: "LoRA/PEFT", ring: "adopt", quadrant: "ml" },
  { name: "vLLM", ring: "trial", quadrant: "infra" },
  { name: "A2A Protocol", ring: "trial", quadrant: "agents" },
  { name: "Computer Use", ring: "assess", quadrant: "agents" },
  { name: "GraphRAG", ring: "trial", quadrant: "genai" },
  { name: "Diffusion Agents", ring: "assess", quadrant: "genai" },
  { name: "TensorRT-LLM", ring: "trial", quadrant: "infra" },
];

export const EXPERIENCES: Experience[] = [
  {
    company: "Baker Hughes (via Hermes Trade Company)",
    role: "AI Engineer (Consultant)",
    location: "Firenze, Italia",
    period: "Nov 2024 – Present",
    description: "Architecting enterprise AI platforms and scaling Generative AI services across global teams.",
    bulletPoints: [
      "AI-as-a-Service Platform: Designed and implemented full RAG-as-a-Service and LLM-as-a-Service platforms, making advanced AI capabilities accessible to over 500 global team members across 15+ countries.",
      "Enterprise 'Chat with Document': Developed a high-performance system processing over 10,000 PDF/Word documents daily with a certified accuracy of 95%.",
      "Summarization as a Service: Reduced file analysis and review cycle time by 60% for technical and legal teams.",
      "Chunk-as-a-Service: Built a scalable text-segmentation and token-based chunking service to feed embedding layers, boosting chunking efficiency by 35%.",
      "Computer Vision (YOLO v8): Implemented YOLO v8 models to inspect industrial turbine and compressor components, enhancing defect detection accuracy by 22%.",
      "LLM Fine-Tuning (LoRA): Fine-tuned Hugging Face models using PEFT/LoRA for niche terminology, cutting inference latency by 40% while preserving 98% factual precision.",
      "Cloud & Cost Optimization: Administered a multi-region AWS infrastructure, safeguarding 99.9% uptime while shrinking operational costs by 25%.",
    ],
    challengesSolved: [
      {
        title: "Domain LLM Latency & Cost Bottlenecks",
        challenge: "Generic API LLM calls were slow, expensive, and suffered accuracy drift on niche industrial engineering manuals.",
        solution: "Fine-tuned an open-source Hugging Face model using LoRA (PEFT) on custom manuals, applied INT8 quantization, and hosted on cost-efficient AWS Spot instances.",
        impact: "Slashed inference latency by 40% and hosting costs by 25% while maintaining 98% factual precision.",
      },
      {
        title: "Scaling Document Extraction to 10k+ Daily PDFs",
        challenge: "Synchronous document parsing led to timeouts and stalled queues under heavy concurrent loads.",
        solution: "Engineered an asynchronous 'Chunk-as-a-Service' pipeline powered by a Redis-backed queue, Apache Airflow, and specialized chunking algorithms.",
        impact: "Ingestion throughput surged 35%, ensuring zero lost documents and handling 10,000+ files daily.",
      },
    ],
    modelsUsed: ["Llama-3-8B-Instruct", "Mistral-7B", "YOLO v8", "BGE-Large-Embeddings", "Claude-3.5-Sonnet"],
  },
  {
    company: "Configuratori",
    role: "Software / ML Engineer / Data Scientist",
    location: "Firenze, Italia",
    period: "Aug 2021 – Nov 2024",
    description: "Developing robust commercial recommendation systems and deep learning prediction pipelines.",
    bulletPoints: [
      "End-to-End AI Solutions: Created custom ML models and pipelines supporting 100,000+ daily active users (99.5% availability), generating over €2M in annual recurring revenue.",
      "Recommendation Systems: Built collaborative-filtering + deep learning hybrids, accelerating click-through rates by 20% and conversions by 15%.",
      "Production Deployment: Integrated 15+ AI models into the live ecosystem, improving operational efficiency by 30% and eliminating 80% of manual config tasks.",
      "Deep Learning Ingestion: Built pipelines processing 1TB+ of daily data with CNN and LSTM networks for proactive asset scheduling.",
      "Reinforcement Learning: Applied RL agents to optimize physical layout configurations in custom heavy-machinery order sheets.",
      "Anomaly Detection: Combined Isolation Forests and XGBoost to detect real-time anomalies, reducing false alarms by 70%.",
    ],
    challengesSolved: [
      {
        title: "1TB Daily Telemetry Data Bottlenecks",
        challenge: "Legacy pipeline crashed reading high-volume real-time telemetry, delaying critical failure forecasts.",
        solution: "Migrated the ETL system to Apache Spark and integrated PyTorch Lightning for parallel neural network training.",
        impact: "Successfully ingested 1TB+ daily data and automated 80% of manual data-cleansing tasks.",
      },
    ],
    modelsUsed: ["XGBoost", "PyTorch LSTM", "ResNet-50", "Autoencoders", "Isolation Forests"],
  },
  {
    company: "Klimsoft",
    role: "Data Analyst",
    location: "Siena, Italia",
    period: "Apr 2021 – Jun 2021",
    description: "Business intelligence and real-time report analysis.",
    bulletPoints: [
      "Led analytics initiatives using IBM Cognos Analytics V11, yielding a 40% improvement in executive report precision.",
      "Crafted multi-source BI dashboards for instantaneous operational awareness.",
    ],
    challengesSolved: [],
    modelsUsed: ["IBM Cognos", "SQL", "Pandas", "Matplotlib"],
  },
  {
    company: "UniqMaster",
    role: "Backend Developer",
    location: "Bremen, Germany",
    period: "Nov 2020 – Mar 2021",
    description: "Designing REST API integration architectures.",
    bulletPoints: [
      "Architected secure RESTful API endpoints, enhancing cross-system syncing speed by 40%.",
      "Built scalable microservices backends using Node.js and Docker containers.",
    ],
    challengesSolved: [],
    modelsUsed: ["Node.js", "Docker", "Express", "PostgreSQL"],
  },
];

export const CERTIFICATIONS = [
  { title: "IBM Generative AI & LLM Engineering", issuer: "IBM", year: "2024", status: "Completed" },
  { title: "AWS Certified Machine Learning – Specialty", issuer: "Amazon Web Services", year: "2025", status: "In Progress" },
  { title: "Azure AI Engineer Associate", issuer: "Microsoft", year: "2025", status: "In Progress" },
  { title: "Google Cloud Professional ML Engineer", issuer: "Google Cloud", year: "2025", status: "In Progress" },
  { title: "Deep Learning Specialization", issuer: "DeepLearning.AI / Stanford", year: "2025", status: "In Progress" },
];

export const EDUCATION = [
  { degree: "Professional Certificate in ML & Data Science", institution: "Université Paris 1 Panthéon-Sorbonne", location: "France", period: "2023 – 2024", details: "Advanced MLOps, production deployment, statistical analysis, neural networks." },
  { degree: "M.Sc. in Quantitative Finance", institution: "Università degli Studi di Siena", location: "Siena, Italy", period: "2017 – 2022", details: "Quantitative Finance, Risk Management, Financial Modeling." },
];

export const LANGUAGES = [
  { name: "Arabic", level: "Native", pct: 100 },
  { name: "English", level: "Fluent (C2)", pct: 95 },
  { name: "Italian", level: "Intermediate (B1)", pct: 60 },
  { name: "German", level: "Elementary (A2)", pct: 35 },
  { name: "French", level: "Beginner (A1)", pct: 25 },
];

export const TARGET_COMPANIES = [
  "OpenAI", "Anthropic", "NVIDIA", "Microsoft", "Google", "Meta",
  "AWS", "Hugging Face", "Stripe", "Shopify", "SAP", "Siemens",
  "Bosch", "Accenture", "Deloitte", "PwC", "Capgemini", "Thoughtworks",
];

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", quote: "Karim rebuilt our document intelligence stack into a RAG-as-a-Service platform used across 15 countries. Precision and reliability were exceptional.", name: "Engineering Director", role: "Head of Digital", company: "Industrial Enterprise (Baker Hughes program)", rating: 5, metric: "500+ users onboarded" },
  { id: "t2", quote: "He fine-tuned our domain LLM and cut inference latency by 40% while dropping cloud spend. A rare engineer who thinks about ROI, not just models.", name: "CTO", role: "Chief Technology Officer", company: "European SaaS Company", rating: 5, metric: "-40% latency · -25% cost" },
  { id: "t3", quote: "Our recommendation engine generated over €2M in annual impact after Karim's redesign. Clear communication and production-grade delivery.", name: "Product Lead", role: "VP Product", company: "Configuratori", rating: 5, metric: "€2M+ revenue impact" },
  { id: "t4", quote: "The multi-agent automation Karim built removed 80% of our manual configuration work. It just runs — reliably, every day.", name: "Operations Manager", role: "Head of Operations", company: "Manufacturing Client", rating: 5, metric: "80% tasks automated" },
];

export const GITHUB_REPOS: GithubRepo[] = [
  {
    name: "career-ops",
    description: "AI-powered job search system built on Claude Code. 14 skill modes, interactive Go dashboard, resume PDF generation, and scalable batch processing.",
    stars: 38, forks: 9, language: "Go", url: "https://github.com/karimosman89/career-ops",
    topics: ["Claude-Code", "Go", "Automation", "PDF"],
    metrics: [{ label: "Skill Modes", value: "14" }, { label: "Pipelines", value: "Batch" }],
  },
  {
    name: "Open-Generative-AI",
    description: "Open-source AI image & video generation studio supporting 200+ state-of-the-art models (Flux, Kling, Sora, Veo) with a unified React interface.",
    stars: 124, forks: 28, language: "TypeScript", url: "https://github.com/karimosman89/Open-Generative-AI",
    topics: ["Generative-AI", "React", "AI-Video", "Flux"],
    metrics: [{ label: "Models", value: "200+" }, { label: "Stars", value: "124" }],
  },
  {
    name: "AssetOpsBench",
    description: "Industry 4.0 benchmark for building, orchestrating and evaluating domain-specific AI agents over MCP — 460+ scenarios and 5 specialist agents.",
    stars: 42, forks: 11, language: "Python", url: "https://github.com/karimosman89/AssetOpsBench",
    topics: ["Industry-4.0", "MCP", "AI-Agents", "IoT"],
    metrics: [{ label: "Scenarios", value: "460+" }, { label: "Agents", value: "5" }],
  },
  {
    name: "500-AI-Agents-Projects",
    description: "Curated collection of AI agent use cases across industries with links to open-source implementations, comparing CrewAI, LangGraph and AutoGen.",
    stars: 87, forks: 19, language: "Markdown", url: "https://github.com/karimosman89/500-AI-Agents-Projects",
    topics: ["AI-Agents", "CrewAI", "LangGraph", "Curated"],
    metrics: [{ label: "Use Cases", value: "500" }, { label: "Frameworks", value: "3+" }],
  },
  {
    name: "gemini-cli",
    description: "Open-source AI agent bringing Gemini into your terminal — deep code understanding, interactive prompt loops, GitHub integration and native MCP support.",
    stars: 49, forks: 14, language: "Go", url: "https://github.com/karimosman89/gemini-cli",
    topics: ["Gemini", "CLI", "AI-Agent", "MCP"],
    metrics: [{ label: "MCP", value: "Native" }, { label: "Lang", value: "Go" }],
  },
];

export const TECHNICAL_BLOGS: BlogPost[] = [
  {
    id: "blog-lora-latency",
    title: "Mastering LoRA: 40% Latency Reduction for Domain-Specific LLMs",
    summary: "Combining Parameter-Efficient Fine-Tuning (PEFT) with post-training quantization to run large models on low-cost hardware without accuracy loss.",
    content: `Domain adaptation is one of the biggest challenges in deploying enterprise LLMs. Generalist models like Claude or GPT-4 excel at open-ended queries but stumble on highly specialized terms — heavy machinery part serials, industrial gas turbine specs.\n\nTo bridge this gap, we fine-tuned open-source models using Hugging Face **PEFT** with **LoRA** adapters.\n\n### Why LoRA?\nInstead of retraining billions of parameters, LoRA injects low-rank trainable matrices into the attention layers, cutting trainable parameters by up to 99%.\n\n### The Double-Whammy: Quantization (INT8)\nAfter training we applied INT8 quantization, mapping 32-bit weights to 8-bit integers.\n\n**Result:** 40% latency reduction (850ms → 510ms), 25% cost savings on AWS Spot instances, and 98% accuracy preserved.`,
    date: "May 14, 2026", readTime: "5 min", category: "LLMOps",
    tags: ["LLM", "Hugging Face", "LoRA", "MLOps"],
  },
  {
    id: "blog-rag-service",
    title: "Architecting 'RAG-as-a-Service' for Enterprise Scaling",
    summary: "A blueprint for turning simple vector-search scripts into a robust, multi-tenant distributed RAG pipeline serving 500+ global users.",
    content: `Anyone can spin up a RAG prototype in 15 lines of LangChain. Serving 500+ concurrent users across 15+ countries is a different story.\n\n### Component 1: Chunk-as-a-Service\nToken-aware chunking with overlapping windows and semantic boundary detection, distributed across Redis + Celery workers to parse 10,000+ files daily.\n\n### Component 2: Multi-Tenant Vector Routing\nPinecone with metadata namespace tagging isolates data per country/team. Hybrid BM25 + BGE dense search plus a Cohere reranking layer.\n\n### Component 3: Guardrails\nStrict factual boundaries and citation attribution to page numbers.`,
    date: "Feb 22, 2026", readTime: "7 min", category: "Architecture",
    tags: ["RAG", "System Design", "Vector DB", "Pinecone"],
  },
  {
    id: "blog-agents",
    title: "Multi-Agent Systems in Production: Lessons from the Trenches",
    summary: "What actually works when you deploy LangGraph and CrewAI agent teams for real enterprise automation — and where they break.",
    content: `Multi-agent demos look magical. Production is humbling. Here is what shipped reliably.\n\n### 1. Constrain the graph\nOpen-ended agent loops are unpredictable. We model workflows as explicit **LangGraph** state machines with bounded transitions.\n\n### 2. Tools over prompts\nEvery capability is a typed, validated function. Function calling with JSON schema beats free-text instructions.\n\n### 3. Human-in-the-loop gates\nHigh-impact actions pause for approval. This alone earned enterprise trust.\n\n### 4. Memory that forgets\nEpisodic + semantic memory with TTL keeps agents fast and relevant.`,
    date: "Jan 10, 2026", readTime: "6 min", category: "AI Agents",
    tags: ["Agents", "LangGraph", "CrewAI", "MCP"],
  },
  {
    id: "blog-yolo-manufacturing",
    title: "Computer Vision in Heavy Industry: Defect Detection with YOLO v8",
    summary: "Applying state-of-the-art object detection to high-speed scans of industrial components to increase defect classification accuracy by 22%.",
    content: `Automating quality inspection is hard: varying lighting, dust, microscopic defects. We applied **YOLO v8** to turbine rotor and compressor inspection.\n\n### Pipeline\n1. Dual thermal + optical cameras at 30 FPS.\n2. Adaptive histogram equalization to normalize reflections.\n3. Custom YOLO v8-medium predicting boxes in <15ms.\n4. Edge deployment via NVIDIA TensorRT on Jetson Orin.\n\n**Wins:** +22% defect detection over legacy filters, real-time feedback, zero interruption.`,
    date: "Nov 08, 2025", readTime: "6 min", category: "Computer Vision",
    tags: ["Computer Vision", "YOLO v8", "TensorRT", "Edge AI"],
  },
];

export const FAQS = [
  { q: "What kind of projects do you take on?", a: "Custom AI applications, RAG systems, AI agents & automation, enterprise chatbots, computer vision, and AI strategy consulting for B2B and enterprise clients." },
  { q: "Do you work remotely / internationally?", a: "Yes. I'm based in Siena, Italy and work with clients across Europe and North America, fully remote or hybrid. I'm a VAT-registered business entity." },
  { q: "How do engagements typically start?", a: "A free 30-minute discovery call to scope your needs, followed by a proposal with clear deliverables, timeline and pricing." },
  { q: "What is your typical timeline?", a: "Proofs of concept in 1–3 weeks; production systems in 4–12 weeks depending on scope. I ship in iterative, reviewable milestones." },
];
