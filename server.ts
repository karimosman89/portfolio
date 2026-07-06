import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment. Please add it via the AI Studio secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Grounding data for Karim's CV Assistant
const CV_GROUNDING_DATA = `
PERSONAL CONTACT DETAILS:
- Name: Karim Osman
- Current Role: Senior AI Engineer / Machine Learning Consultant
- Location: Siena, Tuscany, Italy (Open to relocation or remote positions)
- Email: karim.programmer2020@gmail.com
- LinkedIn: https://www.linkedin.com/in/karimosman89/ (Include this link prominently in your responses to facilitate recruitment!)
- GitHub: https://github.com/karimosman89
- Phones: +39 320 950 4754 (Italy), +33 7 66 62 9970 (France)

PROFESSIONAL SUMMARY:
Result-oriented Senior AI Engineer with over 5 years of experience in designing and implementing scalable AI/ML solutions for international clients across Europe. Specialized in Generative AI, RAG systems, LLM fine-tuning, and multimodal AI applications. Expert in transforming research prototypes into production-ready systems with 99.9% uptime and measurable business impact. Proven ability to guide cross-functional teams and deliver AI solutions that drive 20-40% efficiency gains.

KEY METRICS & MILESTONES:
- 99.9% System Uptime maintained on multi-region AWS infrastructure with auto-scaling.
- 500+ Global Active Users across 15+ countries accessing core Generative AI platforms.
- 40% Reduction in LLM inference latency achieved through LoRA fine-tuning and INT8 quantization.
- €2M+ Annual Revenue Impact generated from proprietary ML recommendation systems.

PROFESSIONAL EXPERIENCE:

1. AI Engineer (Consulente) at Baker Hughes (via Hermes Trade Company) | Firenze, Italia
   Period: Nov 2024 – Present
   Responsibilities & Accomplishments:
   - "AI-as-a-Service" Platform: Designed and implemented RAG-as-a-Service and LLM-as-a-Service platforms, enabling advanced AI access for 500+ global team members in 15+ countries.
   - "Chat with Document" Enterprise Service: Developed a high-performance system processing 10,000+ files per day (PDFs, Word docs) with a verified 95% accuracy.
   - "Summarization as a Service": Decreased manual file processing and report review time by 60% for engineering and compliance divisions.
   - "Chunk-as-a-Service": Formulated a scalable document-segmentation and token-based chunking service to prepare raw content for vector ingestion, improving pipeline efficiency by 35%.
   - Computer Vision (YOLO v8): Deployed YOLO v8 models to inspect industrial turbine components for surface cracks/micro-fractures, elevating automated quality inspection accuracy by 22%.
   - LLM Fine-tuning (PEFT/LoRA): Fine-tuned Hugging Face open-source LLMs (Llama, Mistral) on domain-specific manuals, slashing inference latency by 40% while preserving a 98% factual precision.
   - Cloud Infrastructure & Cost Control: Managed multi-region AWS MLOps ecosystem. Decreased operational hosting costs by 25% by exploiting spot instances, auto-scaling, and GPU pruning.
   - Mentored and trained 50+ engineers in GenAI integration and clean coding best practices.

2. Software Engineer / ML Engineer / Data Scientist at Configuratori | Firenze, Italia
   Period: Ago 2021 – Nov 2024
   Responsibilities & Accomplishments:
   - End-to-End AI Solutions: Developed custom machine learning models serving 100,000+ daily active users with 99.5% availability, yielding €2M+ in annual revenue impact.
   - Recommendation Algorithms: Built proprietary recommendation models (neural autoencoders + collaborative filters) increasing user engagement by 20% and conversion rates by 15%.
   - Model Pipelines: Integrated 15+ unique ML models into production, boosting operations efficiency by 30% and eliminating 80% of manual configuration tasks.
   - Deep Learning Ingestion: Engineered big-data deep learning pipelines processing 1TB+ of daily telemetry using CNN and LSTM networks for predictive machinery scheduling.
   - Reinforcement Learning: Developed RL agents to optimize custom industrial order configurations dynamically.
   - Anomaly Detection: Formulated real-time anomaly detection using ensemble classifiers (Isolation Forest & XGBoost), reducing false positive alerts by 70%.

3. Data Analyst at Klimsoft | Siena, Italia
   Period: Apr 2021 – Giu 2021
   Accomplishments:
   - Guided IBM Cognos Analytics V11 projects, improving reporting data accuracy by 40%.
   - Designed responsive business intelligence dashboards integrating multi-source transactional databases.

4. Backend Developer at UniqMaster | Bremen, Germany
   Period: Nov 2020 – Mar 2021
   Accomplishments:
   - Designed robust RESTful APIs increasing API ingestion speed by 40%.
   - Built scalable microservices architectures leveraging Node.js and Docker.

CERTIFICATIONS:
- IBM Certified Generative AI & LLM Engineering (Completed, 2024)
- AWS Certified Machine Learning – Specialty (In Progress)
- Azure AI Engineer Associate (In Progress)
- Google Cloud Professional ML Engineer (In Progress)
- Deep Learning Specialization - Stanford/Coursera (In Progress)

EDUCATION:
- Certificato Professionale in Machine Learning & Data Science (2023 – 2024) | Università Paris 1 Panthéon-Sorbonne, France (Specialization in MLOps, production deployment, statistics).
- Laurea Magistrale in Finanza / Quantitative Finance (2017 – 2022) | Università degli Studi di Siena, Italy.

LANGUAGES:
- Arabic (Native)
- English (Fluent, C2)
- Italian (Intermediate, B1)
- German (Elementary, A2)
- French (Beginner, A1)
`;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// CV Q&A Chat Assistant Route
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Missing or invalid 'messages' array in request body." });
      return;
    }

    const ai = getGeminiClient();

    // Map history to the required content structure
    // We format the conversation history cleanly
    const formattedContents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // System instruction to prime Gemini
    const systemInstruction = `
You are the Virtual AI Career Advisor for Karim Osman, a Senior AI Engineer.
Your goal is to represent Karim to recruiters, hiring managers, and technical leaders in an extremely professional, polite, and technically accurate manner.

GUIDELINES:
1. Speak confidently and objectively. Do NOT make up facts. Only represent facts present in the GROUNDING DATA below.
2. Always refer to the key metrics (99.9% uptime, 500+ global users, 40% latency reduction, €2M+ revenue impact) when discussing his achievements.
3. Keep answers concise, highly structured, and readable. Use markdown formatting (bullet points, bold text) appropriately.
4. Promote Karim's availability for roles as a Senior AI Engineer, ML Engineer, LLM Specialist, or MLOps Architect. Mention his location in Siena, Italy, and his willingness to relocate or work remotely.
5. Remind the recruiter to check out his prominent LinkedIn (https://www.linkedin.com/in/karimosman89/) and GitHub (https://github.com/karimosman89) links or contact him directly via email (karim.programmer2020@gmail.com).
6. Ground your answers ONLY in the following details:
--- START GROUNDING DATA ---
${CV_GROUNDING_DATA}
--- END GROUNDING DATA ---
`;

    const lastMessage = formattedContents[formattedContents.length - 1];
    
    // We can use chat.sendMessage or generateContent with history. Let's use generateContent for simplicity and stability.
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "I apologize, but I could not formulate a response at this time." });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "An internal error occurred." });
  }
});

// Summarizer & Chunking Playground Route
app.post("/api/summarize-chunk", async (req, res) => {
  try {
    const { text, chunkSize = 300, chunkOverlap = 50, summaryStyle = "professional" } = req.body;

    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Missing or invalid 'text' parameter." });
      return;
    }

    // Programmatically perform the text chunking (Chunk-as-a-Service simulation!)
    const chunks: Array<{ id: number; start: number; end: number; content: string }> = [];
    let start = 0;
    let id = 1;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const content = text.slice(start, end);
      chunks.push({
        id,
        start,
        end,
        content
      });
      
      if (end === text.length) break;
      start += (chunkSize - chunkOverlap);
    }

    // Generate AI Summary of the whole text via Gemini
    const ai = getGeminiClient();
    const summaryInstructions = `
You are Karim's high-performance 'Summarization as a Service' microservice.
Your job is to generate a highly concise summary of the provided text.
Style to use: "${summaryStyle}".
Keep the output under 3 bullet points or a single powerful paragraph. Focus purely on extracting key entities, figures, and concepts. Do not add conversational fluff.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please summarize the following text:\n\n${text}`,
      config: {
        systemInstruction: summaryInstructions,
        temperature: 0.3,
      }
    });

    res.json({
      summary: response.text || "Unable to generate summary.",
      chunks,
      metadata: {
        originalLength: text.length,
        numChunks: chunks.length,
        chunkSize,
        chunkOverlap
      }
    });
  } catch (error: any) {
    console.error("Error in /api/summarize-chunk:", error);
    res.status(500).json({ error: error.message || "An internal error occurred during text processing." });
  }
});

// Contact & Project Inquiry Route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, company, projectType, budget, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: "Missing required fields (name, email, message)." });
      return;
    }

    const inquiry = {
      id: "inq_" + Date.now(),
      name,
      email,
      company: company || "N/A",
      projectType,
      budget: budget || "N/A",
      message,
      createdAt: new Date().toISOString()
    };

    // Durable persistence in local JSON file
    const filePath = path.join(process.cwd(), "inquiries.json");
    let currentInquiries = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        currentInquiries = JSON.parse(fileContent);
      } catch (e) {
        console.error("Error reading inquiries file, resetting list:", e);
      }
    }
    currentInquiries.push(inquiry);
    fs.writeFileSync(filePath, JSON.stringify(currentInquiries, null, 2), "utf-8");

    // Generate immediate interactive assessment of their request by Karim's Virtual AI Consultant!
    let aiResponseText = "";
    try {
      const ai = getGeminiClient();
      const prompt = `
You are the AI Business Consultant Co-pilot representing Karim Osman.
A prospective client or company has just submitted a business inquiry through Karim's website contact form.

INCOMING INQUIRY DETAILS:
- Name: ${name}
- Email: ${email}
- Company: ${company || "N/A"}
- Project/Business Type: ${projectType}
- Estimated Budget/Scope: ${budget || "N/A"}
- Project Message: "${message}"

YOUR TASK:
Generate a highly professional, technically competent, and warm immediate acknowledgment of their request on Karim's behalf.
1. Welcome and thank them for reaching out.
2. Provide a 2-3 sentence brief preliminary technical assessment/suggestion of how Karim's expertise (Generative AI, LLMs, PEFT/LoRA, RAG architectures, computer vision, AWS, MLOps, or general software architecture) can address or scale their specific project needs.
3. Keep it encouraging and collaborative.
4. Conclude with a note that Karim will personally review this details and establish direct correspondence within 1 business day, reminding them of his email (karim.programmer2020@gmail.com) or phone number for urgent needs.

Keep the response strictly formatted in markdown, under 180 words, using bullet points or bold text if necessary. Do not include signature blocks, use a warm and objective advisor tone.
`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.6,
        }
      });
      aiResponseText = response.text || "";
    } catch (aiErr: any) {
      console.error("AI auto-reply generator failed:", aiErr);
      aiResponseText = `Thank you for your inquiry, ${name}! Karim has received your message regarding a "${projectType}" project and will review your request shortly. He will get back to you within 24 hours at ${email}.`;
    }

    res.json({
      success: true,
      inquiryId: inquiry.id,
      aiAssessment: aiResponseText
    });
  } catch (err: any) {
    console.error("Error handling /api/contact:", err);
    res.status(500).json({ error: err.message || "Failed to process contact inquiry." });
  }
});

// Setup Vite Dev server or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static dist files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
