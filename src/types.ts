export interface Metric {
  id: string;
  value: string;
  label: string;
  sublabel: string;
}

export interface TechnicalChallenge {
  title: string;
  challenge: string;
  solution: string;
  impact: string;
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
  bulletPoints: string[];
  challengesSolved: TechnicalChallenge[];
  modelsUsed: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface GithubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  topics: string[];
}

export interface PocMetric {
  label: string;
  value: string;
}

export interface PocProject {
  id: string;
  title: string;
  tagline: string;
  domain: 'vision' | 'genai' | 'agents' | 'multimodal' | 'edge';
  domainLabel: string;
  year: string;
  status: 'Live Demo' | 'Prototype' | 'Research' | 'Production';
  description: string;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
  metrics: PocMetric[];
  image: string;
  accent: string; // tailwind gradient class fragment e.g. "from-indigo-500 to-violet-500"
  repoUrl?: string;
  demoUrl?: string;
  trending?: boolean;
}

export interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface HostConfig {
  weeklyAvailability: {
    [dayOfWeek: number]: { start: string; end: string; active: boolean };
  };
  slotDuration: number;
  timezone: string;
  isGoogleConnected: boolean;
  googleCalendarId?: string;
  hostEmail?: string;
  calendlyUrl?: string;
}

export interface Meeting {
  id: string;
  clientName: string;
  clientEmail: string;
  clientLinkedIn: string;
  dateTime: string;
  duration: number;
  subject: string;
  description: string;
  googleEventId?: string;
  googleMeetLink?: string;
  createdAt: string;
}
