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
  phoneFrance: "+33 7 66 62 9970",
  summaryEn: "Result-oriented Senior AI Engineer and B2B Consultant with over 5 years of experience designing and implementing scalable AI/ML solutions for international enterprise clients. Specialized in Generative AI, RAG architectures, LLM fine-tuning (LoRA), and multimodal Computer Vision (YOLO). Open to Senior roles, high-impact Freelance contracts, and B2B corporate consultancies to transform research prototypes into high-uptime, production-ready systems.",
  summaryIt: "Senior AI Engineer e Consulente B2B orientato ai risultati con oltre 5 anni di esperienza nella progettazione e implementazione di soluzioni scalabili di AI/ML per clienti internazionali. Specializzato in Intelligenza Artificiale Generativa, sistemi RAG, fine-tuning di LLM e applicazioni AI multimodali. Disponibile per ruoli Senior, contratti Freelance ad alto impatto e consulenze aziendali B2B per trasformare prototipi in sistemi production-ready."
};

export const KEY_METRICS: Metric[] = [
  {
    id: "uptime",
    value: "99.9%",
    label: "SYSTEM UPTIME",
    sublabel: "Multi-region AWS scaling"
  },
  {
    id: "users",
    value: "500+",
    label: "GLOBAL TEAM USERS",
    sublabel: "Across 15+ countries"
  },
  {
    id: "perf",
    value: "+40%",
    label: "PERFORMANCE BOOST",
    sublabel: "Reduced inference latency"
  },
  {
    id: "revenue",
    value: "€2M+",
    label: "ANNUAL REVENUE IMPACT",
    sublabel: "Generated via AI recommendations"
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
    period: "Nov 2024 – Present",
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

export const LANGUAGES = [
  { name: "Arabic", level: "Native / Mother Tongue" },
  { name: "English", level: "Fluent (C2)" },
  { name: "Italian", level: "Intermediate (B1)" },
  { name: "German", level: "Elementary (A2)" },
  { name: "French", level: "Beginner (A1)" }
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

export const TECHNICAL_BLOGS: BlogPost[] = [
  {
    id: "blog-lora-latency",
    title: "Mastering LoRA: 40% Latency Reduction for Domain-Specific LLMs",
    summary: "How to combine Parameter-Efficient Fine-Tuning (PEFT) with post-training quantization to fit massive models on low-cost hardware without accuracy degradation.",
    content: `Domain adaptation is one of the biggest challenges in deploying enterprise LLMs. While generalist models like Claude or GPT-4 perform outstandingly on open-ended queries, they frequently stumble or hallucinate on highly specialized terms—such as heavy machinery part serials or industrial gas turbine specs. 

To bridge this gap, we fine-tuned open-source models using Hugging Face **PEFT (Parameter-Efficient Fine-Tuning)** with **LoRA (Low-Rank Adaptation)** adapters. 

### Why LoRA?
Instead of retraining all billions of parameters (which is cost-prohibitive and leads to catastrophic forgetting), LoRA injects low-rank trainable matrices into the self-attention layers. This reduces trainable parameters by up to 99%.

### The Double-Whammy: Quantization (INT8/FP4)
After training, we applied INT8 quantization. This maps 32-bit floating-point weights to 8-bit integers. 

**The Result:**
- **40% Latency Reduction**: Inference response time dropped from 850ms to 510ms.
- **25% Cost Savings**: Models can run comfortably on cheaper AWS Spot instances (A10G GPUs) instead of expensive multi-node setups.
- **98% Accuracy Preserved**: Compared to a fully un-quantized float16 model, the accuracy degradation was virtually undetectable in domain specific evaluation datasets.`,
    date: "May 14, 2026",
    readTime: "5 min read",
    tags: ["LLM", "Hugging Face", "LoRA", "Model Optimization", "MLOps"]
  },
  {
    id: "blog-rag-service",
    title: "Architecting 'RAG-as-a-Service' for Enterprise Scaling",
    summary: "A blueprint for transforming simple vector-search scripts into a robust, multi-tenant distributed RAG pipeline serving 500+ global users.",
    content: `Most developers can spin up a simple Retrieval-Augmented Generation (RAG) prototype in 15 lines of LangChain code. However, taking that to production to serve 500+ concurrent international users across 15+ countries is an entirely different story.

In this article, we break down the architecture of the **RAG-as-a-Service** platform we designed at Baker Hughes.

### Component 1: Chunk-as-a-Service (Text Segmentation)
If you chunk your documents poorly, no retrieval strategy can save you. We built an asynchronous, token-aware chunking pipeline:
- **Overlapping sliding windows** (512 token size with 10% overlap).
- **Semantic boundary detection**: We detect headers and markdown sections to avoid breaking paragraphs mid-sentence.
- Distributed worker queues using **Redis** and **Celery** to parse 10,000+ files daily.

### Component 2: Multi-Tenant Vector Store Routing
Using **Pinecone** with metadata namespace tagging, we isolated data per country and team. 
- Hybrid keyword + vector search (BM25 + BGE Dense Embeddings).
- **Reranking Layer**: Passing top-30 candidates through a Cohere-Rerank node, shrinking context window inputs down to the absolute 5 most relevant chunks.

### Component 3: The LLM Guardrail Layer
We implemented system-level safety guidelines, injecting explicit prompt instructions:
1. *Strict Factual Boundary*: If the answer is not in the context, output "Information not found".
2. *Attribution*: Every claim must cite its source PDF page numbers.`,
    date: "Feb 22, 2026",
    readTime: "7 min read",
    tags: ["RAG", "System Design", "Vector Databases", "Pinecone", "Asynchronous Pipelines"]
  },
  {
    id: "blog-yolo-manufacturing",
    title: "Computer Vision in Heavy Industry: Defect Detection with YOLO v8",
    summary: "How we applied state-of-the-art object detection to high-speed thermal scans of industrial components to increase defect classification accuracy by 22%.",
    content: `Automating quality inspection in manufacturing plants is highly challenging due to varying lighting, dust, and microscopic defect sizes. In our Baker Hughes consultancy, we tackled this by applying **YOLO v8 (You Only Look Once)** to turbine rotor and compressor component inspection.

### The Objective
Detect microscopic thermal fractures and welding cracks on complex metal turbine blades as they move along the testing line.

### Pipeline Architecture
1. **Camera Stream Capture**: Dual thermal and high-resolution optical cameras capture frames at 30 FPS.
2. **Preprocessing**: Adaptive histogram equalization is applied to normalize metal reflection and specular glares.
3. **Inference with YOLO v8**: A customized YOLO v8-medium model, trained on highly balanced synthetic and real crack datasets, predicts bounding boxes in <15ms.
4. **Edge AI Deployment**: The model was compiled via NVIDIA TensorRT and deployed onto Jetson Orin edge boards to avoid round-trip network delays.

### Measurable Wins
- **Defect Detection Boosted by 22%**: Outperformed legacy Hough-transform CV filters and manual visual inspection.
- **Zero Interruption**: Seamless edge inference meant defect feedback occurs in real-time, instantly notifying workers or stopping the conveyor belt.`,
    date: "Nov 08, 2025",
    readTime: "6 min read",
    tags: ["Computer Vision", "YOLO v8", "Industrial AI", "TensorRT", "Edge AI"]
  }
];
