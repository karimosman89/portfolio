import { Experience, SkillCategory, BlogPost, GithubRepo, Metric } from './types';

export const PERSONAL_INFO = {
  name: "Karim Osman",
  title: "Senior AI Engineer",
  subtitle: "Generative AI | LLM Architect | Freelance & B2B Solutions",
  location: "Siena, Tuscany, Italy & Worldwide (Remote)",
  email: "karim.programmer2020@gmail.com",
  linkedin: "https://www.linkedin.com/in/karimosman89/",
  github: "https://github.com/karimosman89",
  phoneItaly: "+39 34 70 70 1100",
  phoneFrance: "+33 7 66 62 99 70",
  phoneWhatsapp: "+39 320 952 47 54",
  summaryEn: "Result-oriented Senior AI Engineer and B2B Consultant with over 5 years of experience designing and implementing scalable AI/ML solutions for international enterprise clients. Specialized in Generative AI, RAG architectures, LLM fine-tuning (LoRA), and multimodal Computer Vision (YOLO). Open to Senior roles, high-impact Freelance contracts, and B2B corporate consultancies to transform research prototypes into high-uptime, production-ready systems.",
  summaryIt: "Senior AI Engineer e Consulente B2B orientato ai risultati con oltre 5 anni di esperienza nella progettazione e implementazione di soluzioni scalabili di AI/ML per clienti internazionali. Specializzato in Intelligenza Artificiale Generativa, sistemi RAG, fine-tuning di LLM e applicazioni AI multimodali. Disponibile per ruoli Senior, contratti Freelance ad alto impatto e consulenze aziendali B2B per trasformare prototipi in sistemi production-ready.",
  summaryFr: "Ingénieur IA Senior et Consultant B2B orienté résultats avec plus de 5 ans d'expérience dans la conception et l'implémentation de solutions IA/ML scalables pour des clients internationaux. Spécialisé en IA Générative, architectures RAG, fine-tuning de LLM (LoRA) et vision par ordinateur (YOLO). Ouvert aux rôles Senior, aux contrats Freelance à fort impact et aux conseils d'entreprise B2B pour transformer des prototypes de recherche en systèmes prêts pour la production."
};

export const KEY_METRICS: Metric[] = [
  {
    id: "uptime",
    value: "60%",
    label: "REDUCED TICKET TIME",
    sublabel: "Via Custom Support RAG"
  },
  {
    id: "users",
    value: "$1.2M",
    label: "OPEX SAVINGS",
    sublabel: "Automated Enterprise QA"
  },
  {
    id: "perf",
    value: "+40%",
    label: "CONVERSION LIFT",
    sublabel: "Personalized AI Recommender"
  },
  {
    id: "revenue",
    value: "10x",
    label: "FASTER DEPLOYMENTS",
    sublabel: "Multi-Agent Code Reviews"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Programming & Development",
    skills: ["Python (Expert)", "SQL", "R", "Java", "C++", "C#", "JavaScript", "PHP"]
  },
  {
    title: "AI/ML Frameworks",
    skills: ["PyTorch", "TensorFlow", "Hugging Face", "LangChain", "Scikit-Learn"]
  },
  {
    title: "Advanced AI Specialties",
    skills: ["LLM Fine-tuning", "Sistemi RAG", "Prompt Engineering", "Computer Vision (YOLO v8)", "NLP", "AI Agents"]
  },
  {
    title: "Cloud & MLOps",
    skills: ["AWS SageMaker", "GCP AI Platform", "Azure ML", "Docker", "Kubernetes", "Auto-scaling", "Spot Instances"]
  },
  {
    title: "Data Engineering & Tools",
    skills: ["Apache Spark", "Apache Airflow", "MLflow", "PostgreSQL", "MongoDB", "Redis", "Pinecone", "FAISS"]
  },
  {
    title: "Emerging Technologies",
    skills: ["Sistemi Multi-Agente", "Reinforcement Learning", "Edge AI Deployment", "INT8 Quantization"]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    company: "Baker Hughes (via Hermes Trade Company)",
    role: "AI Engineer (Consulente)",
    location: "Firenze, Italia",
    period: "Nov 2024 – Jan 2026",
    description: "Architecting enterprise AI platforms and scaling Generative AI services across global teams.",
    bulletPoints: [
      "Sviluppo Piattaforma AI-as-a-Service: Designed and implemented full RAG-as-a-Service and LLM-as-a-Service platforms, making advanced AI capabilities accessible to over 500 global team members across 15+ countries.",
      "Enterprise 'Chat with Document': Developed a high-performance system processing over 10,000 PDF/Word documents daily with a certified accuracy of 95%.",
      "Summarization as a Service: Reduced file analysis and review cycle time by 60% for technical and legal teams.",
      "Chunk-as-a-Service: Built a highly scalable text-segmentation and token-based chunking service to feed embedding layers, boosting chunking efficiency by 35%.",
      "Computer Vision (YOLO v8): Implemented YOLO v8 models to inspect industrial turbine and compressor components, enhancing manufacturing defect detection accuracy by 22%.",
      "LLM Fine-Tuning (LoRA): Fine-tuned Hugging Face models using parameter-efficient methods (PEFT/LoRA) for niche terminology, cutting inference latency by 40% while preserving 98% factual precision.",
      "Cloud & Cost Optimization: Administered a multi-region AWS cloud infrastructure, safeguarding a 99.9% uptime while shrinking operational bills by 25% through spot instances and automated scaling scripts."
    ],
    challengesSolved: [
      {
        title: "Domain LLM Latency & Cost Bottlenecks",
        challenge: "Generic API LLM calls were slow, expensive, and suffered from accuracy drift when processing niche industrial engineering manuals.",
        solution: "Fine-tuned an open-source Hugging Face model using LoRA (PEFT) on custom manuals, followed by INT8 post-training quantization, and hosted it on cost-efficient AWS Spot instances.",
        impact: "Slashed inference latency by 40% and infrastructure hosting costs by 25% while maintaining a 98% factual precision rating."
      },
      {
        title: "Scaling Document Extraction to 10k+ Daily PDFs",
        challenge: "Synchronous document parsing led to connection timeouts and stalled queues under heavy concurrent user loads.",
        solution: "Engineered an asynchronous 'Chunk-as-a-Service' document pipeline powered by a Redis-backed queue system, Apache Airflow, and specialized chunking algorithms.",
        impact: "Document ingestion throughput surged by 35%, ensuring zero lost documents and handling 10,000+ files daily seamlessly."
      }
    ],
    modelsUsed: ["Llama-3-8B-Instruct", "Mistral-7B", "YOLO v8 (Ultralytics)", "BGE-Large-Embeddings", "Claude-3.5-Sonnet"]
  },
  {
    company: "Configuratori",
    role: "Software Engineer / ML Engineer / Data Scientist",
    location: "Firenze, Italia",
    period: "Aug 2021 – Nov 2024",
    description: "Developing robust commercial recommendation systems and deep learning prediction pipelines.",
    bulletPoints: [
      "Sviluppo Soluzioni AI End-to-End: Created customized machine learning models and high-throughput production lines supporting 100,000+ active daily users (99.5% availability), generating over €2M in annual recurring revenue.",
      "Recommendation Systems: Drafted proprietary collaborative-filtering and deep learning hybrid recommendations, accelerating click-through-rates by 20% and conversion rates by 15%.",
      "Production Deployment: Integrated over 15 unique AI models into the live ecosystem, enhancing overall operational efficiency by 30% and eliminating 80% of manual configuration tasks.",
      "Deep Learning Data Ingestion: Formulated high-performance pipelines processing over 1TB of daily data with CNN and LSTM neural networks for proactive asset scheduling.",
      "Reinforcement Learning: Applied custom RL agents to optimize physical layout configurations in custom heavy machinery order-sheets.",
      "Anomaly Detection: Formed an ensemble classifier combining Isolation Forests and XGBoost to detect real-time transaction anomalies, depressing false alarms by 70%."
    ],
    challengesSolved: [
      {
        title: "1TB Daily Telemetry Data Bottlenecks",
        challenge: "Legacy pipeline crashed when reading high-volume, real-time telemetry streams, delaying critical failure forecasts.",
        solution: "Migrated the ETL system to Apache Spark and integrated PyTorch lightning for parallel neural network training.",
        impact: "Successfully ingested 1TB+ daily data, accelerated predictive scheduling, and automated 80% of manual data-cleansing tasks."
      },
      {
        title: "High False Positives in Anomaly Alerts",
        challenge: "Strict rule-based alert engines flagged 15% of healthy activities as anomalous, overloading operation support desks.",
        solution: "Engineered a hybrid ensemble classifier coupling Isolation Forest (unsupervised) with XGBoost (supervised) to audit anomalies.",
        impact: "Decreased false alarms by 70%, boosting engineering team confidence and system responsiveness."
      }
    ],
    modelsUsed: ["XGBoost", "PyTorch LSTM", "ResNet-50", "Collaborative Filtering Autoencoders", "Isolation Forests"]
  },
  {
    company: "Klimsoft",
    role: "Data Analyst",
    location: "Siena, Italia",
    period: "Apr 2021 – Jun 2021",
    description: "Business intelligence and real-time report analysis.",
    bulletPoints: [
      "Led analytics initiatives utilizing IBM Cognos Analytics V11, yielding a 40% improvement in executive report precision.",
      "Crafted multi-source BI executive dashboards for instantaneous operational awareness."
    ],
    challengesSolved: [],
    modelsUsed: ["IBM Cognos", "SQL", "Pandas", "Matplotlib"]
  },
  {
    company: "UniqMaster",
    role: "Backend Developer",
    location: "Bremen, Germany",
    period: "Nov 2020 – Mar 2021",
    description: "Designing REST API integration architectures.",
    bulletPoints: [
      "Architected secure, reliable RESTful API endpoints, enhancing cross-system syncing speed by 40%.",
      "Formulated scalable microservices backends using Node.js and Docker containers."
    ],
    challengesSolved: [],
    modelsUsed: ["Node.js", "Docker", "Express", "PostgreSQL"]
  }
];

export const CERTIFICATIONS = [
  {
    title: "IBM Certified Generative AI & LLM Engineering",
    issuer: "IBM",
    year: "2024",
    status: "Completed"
  },
  {
    title: "AWS Certified Machine Learning – Specialty",
    issuer: "Amazon Web Services (AWS)",
    year: "In Progress",
    status: "In Progress"
  },
  {
    title: "Azure AI Engineer Associate",
    issuer: "Microsoft",
    year: "In Progress",
    status: "In Progress"
  },
  {
    title: "Google Cloud Professional ML Engineer",
    issuer: "Google Cloud (GCP)",
    year: "In Progress",
    status: "In Progress"
  },
  {
    title: "Deep Learning Specialization - Stanford/Coursera",
    issuer: "DeepLearning.AI / Stanford",
    year: "In Progress",
    status: "In Progress"
  }
];

export const EDUCATION = [
  {
    degree: "Certificato Professionale in Machine Learning & Data Science",
    institution: "Università Paris 1 Panthéon-Sorbonne",
    location: "France",
    period: "2023 – 2024",
    details: "Advanced MLOps, model deployment in production, statistical analysis, and neural networks visualization."
  },
  {
    degree: "Laurea Magistrale in Finanza (Quantitative Finance)",
    institution: "Università degli Studi di Siena",
    location: "Siena, Italia",
    period: "2017 – 2022",
    details: "Strong foundations in Quantitative Finance, Risk Management, and Financial Modeling."
  }
];

export const GITHUB_REPOS: GithubRepo[] = [
  {
    name: "career-ops",
    description: "AI-powered job search system built on Claude Code. Features 14 skill modes, interactive Go dashboard, resume PDF generation, and scalable batch processing pipelines.",
    stars: 38,
    forks: 9,
    language: "Go",
    url: "https://github.com/karimosman89/career-ops",
    topics: ["Claude-Code", "Go", "Job-Search", "PDF-Generation", "Automation"]
  },
  {
    name: "Open-Generative-AI",
    description: "Unrestricted open-source alternative to AI video platforms. A free AI image and video generation studio supporting 200+ state-of-the-art models (Flux, Midjourney, Kling, Sora, Veo) without content filters.",
    stars: 124,
    forks: 28,
    language: "TypeScript",
    url: "https://github.com/karimosman89/Open-Generative-AI",
    topics: ["Generative-AI", "TypeScript", "React", "AI-Video", "Flux"]
  },
  {
    name: "AssetOpsBench",
    description: "Industry 4.0 benchmark and framework for building, orchestrating, and evaluating domain-specific AI agents for asset operations, with 460+ scenarios and 5 specialist agents over MCP.",
    stars: 42,
    forks: 11,
    language: "Python",
    url: "https://github.com/karimosman89/AssetOpsBench",
    topics: ["Industry-4.0", "MCP", "AI-Agents", "IoT", "Asset-Operations"]
  },
  {
    name: "500-AI-Agents-Projects",
    description: "A curated collection of AI agent use cases across various industries. Showcases practical applications and provides links to open-source projects for implementation, comparing frameworks like CrewAI and LangGraph.",
    stars: 87,
    forks: 19,
    language: "Markdown",
    url: "https://github.com/karimosman89/500-AI-Agents-Projects",
    topics: ["AI-Agents", "CrewAI", "AutoGen", "LangGraph", "Curated-List"]
  },
  {
    name: "gemini-cli",
    description: "An open-source AI agent that brings the power of Gemini directly into your terminal. Features deep code understanding, interactive prompt loops, GitHub integration, and native support for MCP servers.",
    stars: 49,
    forks: 14,
    language: "Go",
    url: "https://github.com/karimosman89/gemini-cli",
    topics: ["Gemini-API", "CLI", "AI-Agent", "MCP-Server", "Go"]
  }
];

function getDynamicDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export const TECHNICAL_BLOGS: BlogPost[] = [
  {
    id: "ai-news-1",
    title: "Gemini 1.5 Pro Context Windows: Standardizing 2M Tokens Across Industry Workflows",
    summary: "How enterprises are shifting from vector search to in-context learning with native 2-million-token context lengths for codebase analysis and complex multi-document reasoning.",
    content: `The generative AI space is witnessing a massive transition. Developers and enterprise architects are no longer restricted to traditional 4K or 8K token windows. With the widespread integration of the Gemini 1.5 Pro model, a native 2-million-token context is quickly becoming the benchmark for production applications.

### Shifting from RAG to In-Context Learning
Traditionally, Retrieval-Augmented Generation (RAG) has been the gold standard for querying custom data pools. However, RAG pipelines introduce latency, chunking bugs, and embedding failures. By feeding entire codebases, 1,000-page financial audits, or hours of audio files directly into the 2M context window of Gemini 1.5, systems achieve perfect multi-hop reasoning without complex chunking algorithms.

### Cost and Latency Trade-Offs
While long-context processing delivers superior recall, it raises performance and cost considerations:
- **Prompt Caching**: Substantially reduces the cost and latency of subsequent queries by reusing pre-loaded context assets.
- **Structured Outputs**: Pairing JSON schemas with long contexts ensures strict, validated schema adherence for heavy processing pipelines.
- **Smarter Workflows**: Models can cross-reference multiple documents natively, detecting hidden inconsistencies with extreme precision.`,
    date: getDynamicDate(0),
    readTime: "4 min read",
    tags: ["Gemini API", "LLM", "Long Context", "Enterprise AI", "Prompt Caching"]
  },
  {
    id: "ai-news-2",
    title: "Model Context Protocol (MCP): The Unified Standard for Agentic Tool Integration",
    summary: "An analysis of Anthropic’s open standard that allows secure, standard communication between AI clients and data sources like Postgres, GitHub, and local environments.",
    content: `The biggest bottleneck in deploying AI agents has always been the bespoke nature of tool integration. Every developer has had to write custom API wrappers for their agents to read local databases, scan directories, or send Slack notifications.

This fragmentation has been solved by the introduction of the **Model Context Protocol (MCP)**, an open-source standard designed to connect AI applications to data sources.

### Architecture of MCP
MCP defines a client-server relationship:
1. **AI Clients**: Applications (like Claude Desktop, Zed, or custom CLI tools) that coordinate the agentic workflow.
2. **MCP Servers**: Light services that expose specific resources, prompts, and tools through standard JSON-RPC 2.0.

### Why This Changes Everything
By standardizing the transport protocol (STDIO or SSE), an agent can seamlessly interface with any database, git repository, or memory node that implements an MCP server. The community has already built over 150 servers for PostgreSQL, Google Drive, Slack, Docker, and terminal shells, creating a universally interoperable agent ecosystem.`,
    date: getDynamicDate(1),
    readTime: "5 min read",
    tags: ["MCP", "AI Agents", "API Design", "JSON-RPC", "Open Source"]
  },
  {
    id: "ai-news-3",
    title: "The Rise of Multi-Agent Systems in Software Engineering Automation",
    summary: "Exploring how hierarchical multi-agent teams outperform single-prompt chatbots by distributing specialized software tasks like writing, linting, and building code.",
    content: `While individual developer tools can edit files on command, true automation requires collaboration. Autonomous multi-agent systems are proving that specialized roles—such as an Architect, Coder, and QA Engineer—can solve complex codebase modifications far better than any single AI agent.

### Hierarchical Task Delegation
Instead of prompting a single LLM to write a whole feature, multi-agent frameworks divide work:
- **Planner Agent**: Parses instructions, inspects existing directory trees, and outlines a localized architectural plan.
- **Coder Agent**: Receives precise edit instructions and executes file writes surgically, preventing token bloat.
- **Reviewer Agent**: Runs compilers and linters in sandboxed containers, analyzing build logs and returning diagnostic errors directly to the coder.

### Minimizing Catastrophic Rewrites
By isolating code edits to small, modular files, multi-agent pipelines minimize accidental code regression and preserve code patterns. In tests, multi-agent setups resolved 45% more GitHub issues successfully than standard single-turn agents.`,
    date: getDynamicDate(2),
    readTime: "6 min read",
    tags: ["Multi-Agent", "Software Automation", "Vite", "AI Coding", "LangGraph"]
  },
  {
    id: "ai-news-4",
    title: "Edge AI & Small Language Models (SLMs): Redefining Local Reasoning",
    summary: "How models like Phi-3, Gemma 2, and Llama 3-8B are enabling high-performance inference directly on smartphones and edge devices without cloud connectivity.",
    content: `For years, generative AI was synonymous with massive cloud-hosted APIs. But a quiet revolution is taking place at the edge. The rise of Small Language Models (SLMs) is enabling sophisticated on-device intelligence with zero internet latency and complete privacy.

### The Efficiency Breakthrough
Modern SLMs (ranging from 1B to 9B parameters) leverage advanced distillation and quantization techniques. Models like Gemma 2 (9B) and Phi-3 (3.8B) perform on par with older 70B models while running comfortably on low-power consumer devices.

### Industrial & Mobile Applications
On-device intelligence is critical for scenarios with limited connectivity:
- **Industrial Quality Control**: High-speed assembly lines run visual anomaly detection locally to prevent network lag.
- **Secure Patient Diagnostics**: Medical data can be analyzed directly on local tablets, preserving patient confidentiality.
- **Interactive Hardware**: Robots and smart appliances process commands in milliseconds without depending on active cloud servers.`,
    date: getDynamicDate(3),
    readTime: "5 min read",
    tags: ["Edge AI", "SLM", "Gemma", "Quantization", "On-Device AI"]
  },
  {
    id: "ai-news-5",
    title: "Vector Search vs. Graph RAG: Bridging the Structural Knowledge Gap",
    summary: "An evaluation of Graph RAG pipelines that combine knowledge graphs with semantic embeddings to provide contextual answers for unstructured enterprise data.",
    content: `Standard RAG pipelines excel at finding specific documents or facts, but fail on holistic questions like 'What are the main theme of these 100 research papers?'. This is because vector search treats chunks independently.

Enter **Graph RAG**: a paradigm shift that integrates structured Knowledge Graphs with semantic search.

### Building the Knowledge Graph
Graph RAG works by using an LLM to analyze raw documents, extract entities (such as people, technologies, systems), and map their relationships (edges). This creates a structured network representation of the unstructured files.

### Hybrid Query Execution
When a user queries the database, Graph RAG executes a two-stage retrieval:
1. **Relational Pathing**: Traverses the Knowledge Graph to retrieve high-level concepts and themes across the entire document set.
2. **Semantic Retrieval**: Fetches localized raw text chunks via standard vector similarity.

This hybrid approach delivers up to 60% higher completeness in summary responses, ensuring the LLM understands not just the words, but the deep relationships between them.`,
    date: getDynamicDate(4),
    readTime: "6 min read",
    tags: ["Graph RAG", "Knowledge Graphs", "Vector Search", "Neo4j", "Information Retrieval"]
  }
];
