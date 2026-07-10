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
  icon?: string;
  skills: { name: string; level: number }[];
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  category: string;
}

export interface GithubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  topics: string[];
  metrics?: { label: string; value: string }[];
}

export interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  bullets: string[];
  tag?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  metric: string;
}

export interface AgentCapability {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  prefix: string;
  label: string;
  icon: string;
}
