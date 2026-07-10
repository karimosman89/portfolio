<div align="center">

# Karim Osman — Senior AI Engineer Portfolio

**A world-class, AI-native personal brand & portfolio.**
Production-grade LLM · RAG · Multi-Agent Systems · Enterprise AI.

Built with React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · Express · Gemini.

</div>

---

## ✨ Overview

A premium, conversion-focused portfolio designed to position Karim Osman as an elite AI Engineer
available for **freelance projects, B2B contracts, AI consulting and enterprise solutions**.

The aesthetic blends the design language of Apple, OpenAI, Linear, Vercel, Stripe and Framer:
cinematic hero, glassmorphism, aurora + neural backgrounds, tasteful motion, and a live AI assistant.

## 🚀 Features

- **Cinematic hero** with animated typing role rotation, holographic AI avatar and floating metric chips.
- **6 accent themes** (AI Dark, Aurora, Cyber Blue, Glass Purple, Emerald AI, Neon) + light/dark mode, persisted to `localStorage`.
- **Animated backgrounds** — aurora blobs, canvas neural-network particle field, mesh gradients, grid, film grain.
- **AI Agents showcase** with an animated agentic-workflow SVG diagram (orchestrator → planner/tools/memory → result) and 9 capability cards (Multi-Agent, RAG, MCP, A2A, Function Calling, Memory, Long Context, Computer Use, Voice).
- **Interactive skills** — animated proficiency bars + a live technology radar.
- **Enterprise services grid**, **animated stat counters**, **target-company marquee**, **testimonials carousel**.
- **Projects** with 3D tilt cards, live GitHub links and metrics.
- **Experience timeline** with expandable challenge → solution → impact case studies, education, certs, languages.
- **AI Insights blog** with search, category filters, reading modal and newsletter opt-in.
- **Premium contact form** — full B2B fields, honeypot + math CAPTCHA spam protection, validation, success/error states, optional SMTP email delivery, and an instant Gemini-powered assessment.
- **Floating AI Assistant** (Gemini) grounded on Karim's CV — answers about projects, skills, services, pricing, availability and contact.
- **SEO**: rich meta tags, Open Graph, Twitter cards, canonical, `robots.txt`, `sitemap.xml`, and Schema.org `Person` + `ProfessionalService` JSON-LD.
- **Performance**: route-level code splitting, tree-shaken icons, lazy sections.
- **Accessibility**: WCAG-minded, keyboard-friendly, ARIA labels, `prefers-reduced-motion` support.
- **Print-ready** resume export via the browser print dialog.

## 🧱 Tech Stack

| Layer      | Tech                                             |
| ---------- | ------------------------------------------------ |
| Frontend   | React 19, TypeScript, Vite 6                     |
| Styling    | Tailwind CSS v4 (theme tokens + CSS variables)   |
| Motion     | `motion` (Framer Motion 12)                      |
| Icons      | `lucide-react` (tree-shaken via a local map)     |
| Backend    | Express (SSR-less API + static serving)          |
| AI         | Google Gemini (`@google/genai`)                  |
| Email      | `nodemailer` (optional SMTP)                     |

## 📦 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env      # then fill in GEMINI_API_KEY, SMTP_*, etc.

# 3. Run in development (Vite middleware + Express API on :3000)
npm run dev

# 4. Build for production
npm run build

# 5. Serve the production build
npm start
```

Open http://localhost:3000

## ⚙️ Configuration

All configuration lives in `.env` (see [`.env.example`](./.env.example)):

| Variable            | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `GEMINI_API_KEY`    | Enables the AI Assistant chatbot & contact auto-reply.         |
| `GEMINI_MODEL`      | Override the Gemini model (default `gemini-2.0-flash`).        |
| `SMTP_HOST/PORT/USER/PASS` | Forward contact submissions by email (optional).        |
| `CONTACT_TO_EMAIL`  | Destination inbox for contact submissions.                     |
| `APP_URL`           | Public URL for self-referential links.                         |

> Every AI/email feature **degrades gracefully** — the site runs fully without any keys.
> Contact submissions always persist to `inquiries.json`.

### Customising content

All copy, projects, skills, services, testimonials and metrics live in [`src/data.ts`](./src/data.ts).
Replace the portrait at `public/images/karim_portrait.png` and the social preview at `public/og-image.png`.
Set your Calendly URL in `PERSONAL_INFO.calendly`.

## 🗂️ Project Structure

```
├── index.html              # SEO meta, OG/Twitter, JSON-LD, favicon
├── public/                 # static assets (portrait, og-image, robots, sitemap)
├── server.ts               # Express: /api/chat, /api/contact, /api/summarize-chunk
├── src/
│   ├── App.tsx             # composition + lazy loading
│   ├── theme.tsx           # dark/light + 6 accent themes (context)
│   ├── data.ts             # all site content
│   ├── index.css           # design system: tokens, glass, aurora, motion
│   └── components/
│       ├── Background.tsx   Header.tsx   Services.tsx   AgentsShowcase.tsx
│       ├── Stats.tsx        Skills.tsx   Projects.tsx   Testimonials.tsx
│       ├── ExperienceTimeline.tsx   Blog.tsx   ContactForm.tsx
│       ├── QuickChat.tsx    Footer.tsx   ui.tsx   iconMap.tsx
└── vite.config.ts          # code splitting + Tailwind + React
```

## ☁️ Deployment

The app is a standard Vite build + a small Express server.

- **Vercel / Render / Fly / Railway**: build with `npm run build`, start with `npm start`, set env vars in the dashboard.
- **Static-only host** (Netlify/CF Pages/GitHub Pages): deploy `dist/` and point the contact/chat calls at a serverless function or disable them.
- **Node host**: `NODE_ENV=production node dist/server.cjs`.

## ♿ Accessibility & 🔒 Privacy

- Respects `prefers-reduced-motion`, keyboard navigable, ARIA-labelled controls, high-contrast themes.
- Contact form uses a honeypot + arithmetic CAPTCHA; credentials stay in environment variables.

## 📄 License

© Karim Osman. All rights reserved.
