import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, GenerateVideosOperation, Modality } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { google } from "googleapis";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

/**
 * Optional email delivery for contact submissions.
 * Configure SMTP via environment variables (see .env.example):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL
 * If nodemailer or the SMTP vars are missing, submissions still persist
 * to inquiries.json and the API succeeds gracefully.
 */
async function sendContactEmail(inquiry: Record<string, any>): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false;
  try {
    // Dynamic import so the app runs even if nodemailer isn't installed.
    const nodemailer = await import("nodemailer").then((m: any) => m.default || m);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    const to = CONTACT_TO_EMAIL || "karim.programmer2020@gmail.com";
    const rows = Object.entries(inquiry)
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;font-family:sans-serif;font-size:13px">${k}</td><td style="padding:4px 0;font-family:sans-serif;font-size:13px">${String(v).replace(/\n/g, "<br/>")}</td></tr>`)
      .join("");
    await transporter.sendMail({
      from: `"Portfolio Contact" <${SMTP_USER}>`,
      to,
      replyTo: inquiry.email,
      subject: `New AI project inquiry — ${inquiry.name}${inquiry.company ? " (" + inquiry.company + ")" : ""}`,
      html: `<h2 style="font-family:sans-serif">New Project Inquiry</h2><table>${rows}</table>`,
    });
    return true;
  } catch (err) {
    console.error("Email delivery failed (submission still persisted):", err);
    return false;
  }
}

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

// ==========================================
// GOOGLE CALENDAR & MEETING BOOKING SYSTEM Backend
// ==========================================

let DATA_DIR = path.join(process.cwd(), "data");
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Fallback to /tmp if process.cwd() is read-only (like in Vercel serverless)
  DATA_DIR = path.join("/tmp", "data");
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (err) {
      console.warn("Could not create data directory in /tmp either:", err);
    }
  }
}

const CONFIG_FILE = path.join(DATA_DIR, "host_config.json");
const MEETINGS_FILE = path.join(DATA_DIR, "meetings.json");

// Default availability configuration
const DEFAULT_CONFIG = {
  weeklyAvailability: {
    1: { start: "09:00", end: "12:00", active: true }, // Mon
    2: { start: "09:00", end: "17:00", active: true }, // Tue
    3: { start: "09:00", end: "17:00", active: true }, // Wed
    4: { start: "09:00", end: "17:00", active: true }, // Thu
    5: { start: "09:00", end: "16:00", active: true }, // Fri
    6: { start: "10:00", end: "14:00", active: false }, // Sat
    0: { start: "10:00", end: "14:00", active: false }, // Sun
  },
  slotDuration: 30, // in minutes
  timezone: "Europe/Rome",
  isGoogleConnected: false,
  googleTokens: null as any,
  hostEmail: "karim.programmer2020@gmail.com",
  calendlyUrl: "https://calendly.com/karim-programmer2020",
};

// Helper functions for file persistence
function readHostConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
      return { ...DEFAULT_CONFIG, ...data };
    }
  } catch (err) {
    console.error("Error reading host config:", err);
  }
  return { ...DEFAULT_CONFIG };
}

function writeHostConfig(config: any) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing host config:", err);
  }
}

function readMeetings() {
  try {
    if (fs.existsSync(MEETINGS_FILE)) {
      return JSON.parse(fs.readFileSync(MEETINGS_FILE, "utf8"));
    }
  } catch (err) {
    console.error("Error reading meetings:", err);
  }
  return [];
}

function writeMeetings(meetings: any[]) {
  try {
    fs.writeFileSync(MEETINGS_FILE, JSON.stringify(meetings, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing meetings:", err);
  }
}

// Google OAuth Client helper
function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.warn("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing. Running in Google Calendar Simulation Mode.");
    return null;
  }
  
  const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const redirectUri = `${appUrl}/api/auth/google/callback`;
  
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// Host Admin Password Verification
app.post("/api/booking/host-login", (req, res) => {
  const { passcode } = req.body;
  const hostPasscode = process.env.HOST_ADMIN_PASSCODE || "karim-ai-2026";
  
  if (passcode === hostPasscode) {
    res.json({ success: true, token: "karim-authenticated-session-token" });
  } else {
    res.status(401).json({ success: false, error: "Invalid passcode. Please try again." });
  }
});

// Fetch Host Configuration
app.get("/api/booking/config", (req, res) => {
  const config = readHostConfig();
  // Strip tokens from public output for security
  const publicConfig = {
    weeklyAvailability: config.weeklyAvailability,
    slotDuration: config.slotDuration,
    timezone: config.timezone,
    isGoogleConnected: !!(config.googleTokens && config.googleTokens.refresh_token),
    hostEmail: config.hostEmail,
    calendlyUrl: config.calendlyUrl || "https://calendly.com/karim-programmer2020",
  };
  res.json(publicConfig);
});

// Update Host Configuration
app.post("/api/booking/config", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== "Bearer karim-authenticated-session-token") {
    res.status(403).json({ error: "Unauthorized access." });
    return;
  }

  const { weeklyAvailability, slotDuration, timezone, hostEmail, calendlyUrl } = req.body;
  const config = readHostConfig();
  
  if (weeklyAvailability) config.weeklyAvailability = weeklyAvailability;
  if (slotDuration) config.slotDuration = Number(slotDuration);
  if (timezone) config.timezone = timezone;
  if (hostEmail) config.hostEmail = hostEmail;
  if (calendlyUrl !== undefined) config.calendlyUrl = calendlyUrl;
  
  writeHostConfig(config);
  res.json({ success: true, config });
});

// Generate Google Consent URL
app.get("/api/auth/google/url", (req, res) => {
  const oauth2Client = getOAuth2Client();
  
  if (!oauth2Client) {
    res.json({ 
      simulation: true, 
      message: "OAuth credentials are not set in environment variables. Google Calendar API is running in high-fidelity simulation mode." 
    });
    return;
  }
  
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ];
  
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
  
  res.json({ url });
});

// OAuth Callback handler
app.get("/api/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.status(400).send("Authorization code is missing.");
    return;
  }
  
  const oauth2Client = getOAuth2Client();
  if (!oauth2Client) {
    res.status(500).send("OAuth client is not configured on the server.");
    return;
  }
  
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    
    // Fetch host email
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    const config = readHostConfig();
    config.googleTokens = tokens;
    config.isGoogleConnected = true;
    if (userInfo.data.email) {
      config.hostEmail = userInfo.data.email;
    }
    
    writeHostConfig(config);
    
    // Redirect back to client app with success query param
    const appUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
    res.redirect(`${appUrl}?google_connected=true`);
  } catch (error: any) {
    console.error("Error exchanging OAuth code:", error);
    res.status(500).send(`Failed to authenticate with Google: ${error.message}`);
  }
});

// Disconnect Google Calendar
app.post("/api/auth/google/disconnect", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== "Bearer karim-authenticated-session-token") {
    res.status(403).json({ error: "Unauthorized access." });
    return;
  }
  
  const config = readHostConfig();
  config.googleTokens = null;
  config.isGoogleConnected = false;
  writeHostConfig(config);
  
  res.json({ success: true, message: "Google Calendar successfully disconnected." });
});

// Calculate Available Slots
app.get("/api/booking/slots", async (req, res) => {
  try {
    const { date } = req.query; // date in format YYYY-MM-DD
    if (!date || typeof date !== "string") {
      res.status(400).json({ error: "Missing or invalid 'date' query parameter." });
      return;
    }
    
    const config = readHostConfig();
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
    
    const dayConfig = config.weeklyAvailability[dayOfWeek];
    if (!dayConfig || !dayConfig.active) {
      res.json({ slots: [], message: "The host is not accepting meetings on this day of the week." });
      return;
    }
    
    // Parse working hours
    const [startHour, startMin] = dayConfig.start.split(":").map(Number);
    const [endHour, endMin] = dayConfig.end.split(":").map(Number);
    const slotDuration = config.slotDuration || 30;
    
    // Generate potential slots
    const slots: string[] = [];
    let currentSlot = new Date(`${date}T${dayConfig.start}:00`);
    const dayEnd = new Date(`${date}T${dayConfig.end}:00`);
    
    const now = new Date();
    
    while (currentSlot.getTime() + slotDuration * 60 * 1000 <= dayEnd.getTime()) {
      const timeStr = currentSlot.toTimeString().substring(0, 5); // "HH:MM"
      
      // Skip if slot is in the past
      if (currentSlot.getTime() > now.getTime()) {
        slots.push(timeStr);
      }
      
      currentSlot = new Date(currentSlot.getTime() + slotDuration * 60 * 1000);
    }
    
    // Filter local bookings
    const localMeetings = readMeetings();
    let availableSlots = slots.filter(slot => {
      // Check if slot overlaps with any local meeting on that date
      const slotStart = new Date(`${date}T${slot}:00`);
      const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);
      
      return !localMeetings.some((m: any) => {
        if (m.dateTime.substring(0, 10) !== date) return false;
        
        const mStart = new Date(m.dateTime);
        const mEnd = new Date(mStart.getTime() + m.duration * 60 * 1000);
        
        // Overlap check
        return slotStart.getTime() < mEnd.getTime() && slotEnd.getTime() > mStart.getTime();
      });
    });
    
    // Filter live Google Calendar events if connected
    if (config.googleTokens && config.googleTokens.refresh_token) {
      const oauth2Client = getOAuth2Client();
      if (oauth2Client) {
        oauth2Client.setCredentials(config.googleTokens);
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        
        try {
          // Fetch calendar events for the entire day
          const timeMin = `${date}T00:00:00Z`;
          const timeMax = `${date}T23:59:59Z`;
          
          const eventsRes = await calendar.events.list({
            calendarId: "primary",
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: "startTime",
          });
          
          const events = eventsRes.data.items || [];
          
          availableSlots = availableSlots.filter(slot => {
            const slotStart = new Date(`${date}T${slot}:00`);
            const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);
            
            return !events.some((event: any) => {
              const startStr = event.start?.dateTime || event.start?.date;
              const endStr = event.end?.dateTime || event.end?.date;
              if (!startStr || !endStr) return false;
              
              const eventStart = new Date(startStr);
              const eventEnd = new Date(endStr);
              
              // Overlap check
              return slotStart.getTime() < eventEnd.getTime() && slotEnd.getTime() > eventStart.getTime();
            });
          });
        } catch (calErr) {
          console.error("Error fetching Google Calendar events for slots filtering:", calErr);
          // Fall back to local filtering to keep app fully functional
        }
      }
    }
    
    res.json({ slots: availableSlots });
  } catch (error: any) {
    console.error("Error calculating booking slots:", error);
    res.status(500).json({ error: error.message || "Failed to retrieve available slots." });
  }
});

// Book a Meeting (With Auto-Google-Meet generation)
app.post("/api/booking/book", async (req, res) => {
  try {
    const { date, time, clientName, clientEmail, clientLinkedIn, subject, description } = req.body;
    
    if (!date || !time || !clientName || !clientEmail || !clientLinkedIn || !subject) {
      res.status(400).json({ error: "Missing required booking details." });
      return;
    }
    
    const config = readHostConfig();
    const slotDuration = config.slotDuration || 30;
    const meetingDateTime = `${date}T${time}:00`;
    
    // Check conflicts in local bookings first
    const localMeetings = readMeetings();
    const reqStart = new Date(meetingDateTime);
    const reqEnd = new Date(reqStart.getTime() + slotDuration * 60 * 1000);
    
    const hasConflict = localMeetings.some((m: any) => {
      const mStart = new Date(m.dateTime);
      const mEnd = new Date(mStart.getTime() + m.duration * 60 * 1000);
      return reqStart.getTime() < mEnd.getTime() && reqEnd.getTime() > mStart.getTime();
    });
    
    if (hasConflict) {
      res.status(409).json({ error: "This slot is no longer available. Please select another time slot." });
      return;
    }
    
    let googleEventId = undefined;
    let googleMeetLink = `https://meet.google.com/sim-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`; // default simulation link
    
    const meetingId = `meet-${Date.now()}`;
    
    // Call Google Calendar API if authenticated
    if (config.googleTokens && config.googleTokens.refresh_token) {
      const oauth2Client = getOAuth2Client();
      if (oauth2Client) {
        oauth2Client.setCredentials(config.googleTokens);
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        
        try {
          // Construct calendar event
          const eventDescription = `
Full Meeting Details:
---------------------
Client Name: ${clientName}
Client Email: ${clientEmail}
Client LinkedIn Profile: ${clientLinkedIn}
Meeting Purpose: ${subject}

Description / Agenda:
${description || "No description provided."}

Meeting booked via Karim's Portfolio AI Meeting Desk.
          `.trim();
          
          const event = {
            summary: `Karim Osman & ${clientName} | AI Consultation`,
            description: eventDescription,
            start: {
              dateTime: reqStart.toISOString(),
              timeZone: config.timezone,
            },
            end: {
              dateTime: reqEnd.toISOString(),
              timeZone: config.timezone,
            },
            attendees: [
              { email: config.hostEmail || "karim.programmer2020@gmail.com" },
              { email: clientEmail },
            ],
            conferenceData: {
              createRequest: {
                requestId: `meet-${meetingId}`,
                conferenceSolutionKey: {
                  type: "hangoutsMeet",
                },
              },
            },
          };
          
          const calResponse = await calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
            conferenceDataVersion: 1, // Crucial to trigger Google Meet creation!
            sendUpdates: "all", // Notify attendees!
          });
          
          googleEventId = calResponse.data.id || undefined;
          
          // Extract meeting link from conference details
          const meetUri = calResponse.data.conferenceData?.entryPoints?.find(
            ep => ep.entryPointType === "video"
          )?.uri;
          
          if (meetUri) {
            googleMeetLink = meetUri;
          } else if (calResponse.data.htmlLink) {
            googleMeetLink = calResponse.data.htmlLink;
          }
        } catch (calErr: any) {
          console.error("Error creating Google Calendar event:", calErr);
          // Don't crash! Let client book successfully in our local storage as fallback.
        }
      }
    }
    
    // Save to local database
    const newMeeting = {
      id: meetingId,
      clientName,
      clientEmail,
      clientLinkedIn,
      dateTime: reqStart.toISOString(),
      duration: slotDuration,
      subject,
      description,
      googleEventId,
      googleMeetLink,
      createdAt: new Date().toISOString(),
    };
    
    localMeetings.push(newMeeting);
    writeMeetings(localMeetings);
    
    res.json({ success: true, meeting: newMeeting });
  } catch (error: any) {
    console.error("Error booking meeting:", error);
    res.status(500).json({ error: error.message || "Failed to finalize meeting booking." });
  }
});

// View Booked Meetings (Admin only)
app.get("/api/booking/meetings", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== "Bearer karim-authenticated-session-token") {
    res.status(403).json({ error: "Unauthorized access." });
    return;
  }
  
  const meetings = readMeetings();
  // Sort by date ascending (soonest first)
  meetings.sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  res.json(meetings);
});

// Delete/Cancel Meeting
app.post("/api/booking/meetings/delete", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== "Bearer karim-authenticated-session-token") {
    res.status(403).json({ error: "Unauthorized access." });
    return;
  }
  
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ error: "Missing meeting ID." });
    return;
  }
  
  const meetings = readMeetings();
  const meetingIndex = meetings.findIndex((m: any) => m.id === id);
  if (meetingIndex === -1) {
    res.status(404).json({ error: "Meeting not found." });
    return;
  }
  
  const meeting = meetings[meetingIndex];
  
  // Try to remove from Google Calendar if connected
  const config = readHostConfig();
  if (meeting.googleEventId && config.googleTokens && config.googleTokens.refresh_token) {
    const oauth2Client = getOAuth2Client();
    if (oauth2Client) {
      oauth2Client.setCredentials(config.googleTokens);
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      try {
        await calendar.events.delete({
          calendarId: "primary",
          eventId: meeting.googleEventId,
          sendUpdates: "all",
        });
      } catch (calErr) {
        console.error("Failed to delete Google Calendar event:", calErr);
      }
    }
  }
  
  meetings.splice(meetingIndex, 1);
  writeMeetings(meetings);
  
  res.json({ success: true, message: "Meeting successfully cancelled." });
});


// CV Q&A Chat Assistant Route
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Missing or invalid 'messages' array in request body." });
      return;
    }

    // Graceful degradation so the RAG demo stays functional without a key.
    if (!process.env.GEMINI_API_KEY) {
      res.json({
        demo: true,
        text:
          "**Demo mode** — this assistant is grounded on Karim's CV via Retrieval-Augmented Generation, but no `GEMINI_API_KEY` is set on this deployment.\n\n" +
          "Highlights from the grounding data:\n" +
          "- **Senior AI Engineer** specialising in LLM, RAG & multi-agent systems.\n" +
          "- Impact metrics: **99.9% uptime**, **500+ global users**, **40% latency reduction**, **€2M+ revenue impact**.\n" +
          "- Based in **Siena, Italy** — open to remote & relocation.\n\n" +
          "Add `GEMINI_API_KEY` to `.env` to get live, grounded answers.",
      });
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
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "I apologize, but I could not formulate a response at this time." });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    if (error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("currently experiencing high demand")) { res.status(503).json({ error: "The AI model is currently experiencing high demand and is unavailable. Please try again in a few moments." }); } else { if (error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("currently experiencing high demand")) { res.status(503).json({ error: "The AI model is currently experiencing high demand and is unavailable. Please try again in a few moments." }); } else { res.status(500).json({ error: error.message || "An internal error occurred." }); } }
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
        id: id++,
        start,
        end,
        content
      });
      
      if (end === text.length) break;
      start += (chunkSize - chunkOverlap);
    }

    const metadata = {
      originalLength: text.length,
      numChunks: chunks.length,
      chunkSize,
      chunkOverlap
    };

    // The chunking runs entirely server-side and always works. Only the AI
    // summary needs a key — degrade gracefully so the demo stays functional.
    if (!process.env.GEMINI_API_KEY) {
      const preview = text.replace(/\s+/g, " ").trim().slice(0, 240);
      res.json({
        demo: true,
        summary:
          `**Demo mode** — chunking ran live (see the ${chunks.length} chunks below). ` +
          `Configure \`GEMINI_API_KEY\` for a real AI summary.\n\n` +
          `Preview of input: "${preview}${text.length > 240 ? "…" : ""}"`,
        chunks,
        metadata
      });
      return;
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
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      contents: `Please summarize the following text:\n\n${text}`,
      config: {
        systemInstruction: summaryInstructions,
        temperature: 0.3,
      }
    });

    res.json({
      summary: response.text || "Unable to generate summary.",
      chunks,
      metadata
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
    const filePath = path.join(DATA_DIR, "inquiries.json");
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

    // Attempt to forward the inquiry to Karim's inbox (no-op if SMTP not configured).
    const emailSent = await sendContactEmail(inquiry);

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
        model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
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
      emailSent,
      aiAssessment: aiResponseText
    });
  } catch (err: any) {
    console.error("Error handling /api/contact:", err);
    res.status(500).json({ error: err.message || "Failed to process contact inquiry." });
  }
});

// ---------------------------------------------------------
// NEW ADVANCED AI CAPABILITIES ENDPOINTS
// ---------------------------------------------------------

// Grounded and High-Thinking Chat Route
app.post("/api/gemini/grounded-chat", async (req, res) => {
  try {
    const { messages, model = "flash", searchGrounding, mapsGrounding, thinkingMode, role = "advisor" } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Missing or invalid 'messages' array." });
      return;
    }

    const ai = getGeminiClient();

    // Map model selection
    let modelName = "gemini-3.5-flash";
    if (model === "lite") modelName = "gemini-3.1-flash-lite";
    else if (model === "pro") modelName = "gemini-3.1-pro-preview";

    let config: any = {
      temperature: 0.7,
    };

    if (thinkingMode) {
      modelName = "gemini-3.1-pro-preview";
      config.thinkingConfig = {
        thinkingLevel: "HIGH"
      };
    } else {
      config.maxOutputTokens = 2045;
    }

    // Set grounding tools
    if (searchGrounding) {
      config.tools = [{ googleSearch: {} }];
    } else if (mapsGrounding) {
      config.tools = [{ googleMaps: {} }];
    }

    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // Select system instruction
    let systemInstruction = `You are a helpful assistant.`;
    if (role === "advisor") {
      systemInstruction = `
You are the Virtual AI Career Advisor for Karim Osman, a Senior AI Engineer.
Your goal is to represent Karim to recruiters, hiring managers, and technical leaders in an extremely professional, polite, and technically accurate manner.

GUIDELINES:
1. Speak confidently and objectively. Do NOT make up facts. Only represent facts present in the GROUNDING DATA below.
2. Always refer to the key metrics (99.9% uptime, 500+ global users, 40% latency reduction, €2M+ revenue impact) when discussing his achievements.
3. Keep answers concise, highly structured, and readable. Use markdown formatting appropriately.
4. Promote Karim's availability for roles as a Senior AI Engineer, ML Engineer, LLM Specialist, or MLOps Architect. Mention his location in Siena, Italy, and his willingness to relocate or work remotely.
5. Remind the recruiter to check out his prominent LinkedIn (https://www.linkedin.com/in/karimosman89/) and GitHub (https://github.com/karimosman89) links or contact him directly via email (karim.programmer2020@gmail.com).
6. Ground your answers ONLY in the following details:
--- START GROUNDING DATA ---
${CV_GROUNDING_DATA}
--- END GROUNDING DATA ---
`;
    } else if (role === "interviewer") {
      systemInstruction = "You are a demanding technical interviewer grilling the user about MLOps, quantization, model pruning, low-latency scaling, and full-stack integration. Be professional, technical, and challenge their assumptions.";
    } else if (role === "architect") {
      systemInstruction = "You are an Enterprise AI Architect designed to draft robust, scalable RAG platforms, vector ingestion pipelines, and multi-node GPU deployment designs.";
    }

    config.systemInstruction = systemInstruction;

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config
    });

    res.json({ text: response.text || "I apologize, but I could not formulate a response at this time." });
  } catch (error: any) {
    console.error("Error in grounded-chat:", error);
    res.status(500).json({ error: error.message || "An error occurred during chat processing." });
  }
});

// Advanced Multimodal Analysis Endpoint (Images, Video, Audio)
app.post("/api/gemini/analyze-multimodal", async (req, res) => {
  try {
    const { file, mimeType, prompt } = req.body;
    if (!file || !mimeType) {
      res.status(400).json({ error: "Missing required file (base64) or mimeType" });
      return;
    }

    // Graceful degradation: keep the live demo functional even without a key.
    if (!process.env.GEMINI_API_KEY) {
      res.json({
        demo: true,
        text:
          "**Demo mode** — this multimodal vision endpoint is live, but no `GEMINI_API_KEY` is configured on this deployment, so a canned analysis is returned.\n\n" +
          "In production, Gemini receives the uploaded media (inline base64) and returns a detailed, structured description: detected objects, scene context, text (OCR), colours, and any notable visual patterns. Add `GEMINI_API_KEY` to `.env` to see real analysis.",
      });
      return;
    }

    const ai = getGeminiClient();

    const isAudio = mimeType.startsWith("audio/");
    // Use the configured model (defaults to a broadly-available multimodal model).
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    const contentPart = {
      inlineData: {
        mimeType: mimeType,
        data: file
      }
    };

    const textPart = {
      text: prompt || (isAudio ? "Please transcribe this audio recording word-for-word." : "Please analyze this media content in detail. Describe the objects, scene, any visible text, and notable visual patterns in clear, structured markdown.")
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [contentPart, textPart]
      }
    });

    res.json({ text: response.text || "No analysis results generated." });
  } catch (error: any) {
    console.error("Error in analyze-multimodal:", error);
    res.status(500).json({ error: error.message || "Failed to analyze media content." });
  }
});

// AI Paintbox: Image Generation & Editing
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const { prompt, model = "pro", aspectRatio = "1:1", size = "1K", editingImage, mimeType } = req.body;
    const ai = getGeminiClient();

    let response;
    
    if (editingImage) {
      // Create & Edit Images using gemini-3.1-flash-lite-image
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: editingImage, // base64
                mimeType: mimeType || "image/png"
              }
            },
            {
              text: prompt
            }
          ]
        }
      });
    } else {
      // From-scratch Image Generation
      response = await ai.models.generateContent({
        model: model === 'pro' ? 'gemini-3-pro-image' : 'gemini-3.1-flash-image',
        contents: {
          parts: [
            {
              text: prompt
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: size
          }
        }
      });
    }

    let base64Image = "";
    let extractedText = "";

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
      } else if (part.text) {
        extractedText += part.text;
      }
    }

    res.json({
      success: true,
      image: base64Image ? `data:image/png;base64,${base64Image}` : null,
      text: extractedText
    });
  } catch (error: any) {
    console.error("Error in generate-image:", error);
    res.status(500).json({ error: error.message || "Failed to generate image." });
  }
});

// Aura Soundstage: Music Composer
app.post("/api/gemini/generate-music", async (req, res) => {
  try {
    const { prompt, model = "clip", imageBytes, mimeType } = req.body;
    const ai = getGeminiClient();

    const selectedModel = model === "pro" ? "lyria-3-pro-preview" : "lyria-3-clip-preview";

    let contents: any = prompt || "Generate a short musical track.";
    if (imageBytes && mimeType) {
      contents = {
        parts: [
          { text: prompt || "Generate music inspired by this image." },
          { inlineData: { data: imageBytes, mimeType } }
        ]
      };
    }

    const stream = await ai.models.generateContentStream({
      model: selectedModel,
      contents: contents,
    });

    let audioBase64 = "";
    let lyrics = "";
    let outMimeType = "audio/wav";

    for await (const chunk of stream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            outMimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    res.json({
      success: true,
      audio: audioBase64 ? `data:${outMimeType};base64,${audioBase64}` : null,
      lyrics
    });
  } catch (error: any) {
    console.error("Error in generate-music:", error);
    res.status(500).json({ error: error.message || "Failed to compose music." });
  }
});

// Veo Cinematic Studio - Video Generation (Start)
app.post("/api/generate-video", async (req, res) => {
  try {
    const { prompt, aspectRatio = "16:9", imageBytes, mimeType } = req.body;
    const ai = getGeminiClient();

    let payload: any = {
      model: "veo-3.1-lite-generate-preview",
      config: {
        numberOfVideos: 1,
        resolution: "720p",
        aspectRatio: aspectRatio,
      }
    };

    if (prompt) {
      payload.prompt = prompt;
    }

    if (imageBytes && mimeType) {
      payload.image = {
        imageBytes: imageBytes,
        mimeType: mimeType
      };
    }

    const operation = await ai.models.generateVideos(payload);
    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error("Error starting video generation:", error);
    res.status(500).json({ error: error.message || "Failed to start video generation." });
  }
});

// Veo Cinematic Studio - Video Generation (Poll)
app.post("/api/video-status", async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      res.status(400).json({ error: "Missing operationName" });
      return;
    }
    const ai = getGeminiClient();
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    res.json({ done: updated.done });
  } catch (error: any) {
    console.error("Error polling video operation:", error);
    res.status(500).json({ error: error.message || "Failed to poll video generation status." });
  }
});

// Veo Cinematic Studio - Video Generation (Download and Stream)
app.post("/api/video-download", async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      res.status(400).json({ error: "Missing operationName" });
      return;
    }
    const ai = getGeminiClient();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      res.status(400).json({ error: "No video URI found. Generation might have failed or is not finished." });
      return;
    }

    const videoRes = await fetch(uri, {
      headers: { "x-goog-api-key": apiKey },
    });

    res.setHeader("Content-Type", "video/mp4");
    
    if (videoRes.body) {
      const arrayBuffer = await videoRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } else {
      res.status(500).json({ error: "Could not stream video body." });
    }
  } catch (error: any) {
    console.error("Error downloading video:", error);
    res.status(500).json({ error: error.message || "Failed to download and stream video." });
  }
});

// Create HTTP server
const server = createServer(app);

// Setup WebSocket server for Real-time Voice (Live API)
const wss = new WebSocketServer({ server, path: "/api/live" });

wss.on("connection", async (clientWs) => {
  console.log("New Live API WebSocket connection established");
  let session: any = null;
  try {
    const ai = getGeminiClient();
    session = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        systemInstruction: "You are Karim Osman's Virtual AI Career Advisor. Speak warmly, concisely, and professionally. Highlight his experience at Baker Hughes and Configuratori, keeping answers technically precise.",
      },
      callbacks: {
        onmessage: (message: any) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
      },
    });

    clientWs.on("message", (data) => {
      try {
        const { audio } = JSON.parse(data.toString());
        if (audio && session) {
          session.sendRealtimeInput({
            audio: { data: audio, mimeType: "audio/pcm;rate=16000" },
          });
        }
      } catch (err) {
        console.error("Error processing client live voice chunk:", err);
      }
    });

    clientWs.on("close", () => {
      console.log("Client closed live voice connection");
    });
  } catch (err: any) {
    console.error("Failed to establish Live API connection:", err);
    clientWs.send(JSON.stringify({ error: err.message || "Failed to establish live session" }));
    clientWs.close();
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

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.VERCEL !== "1") {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}

export default app;
