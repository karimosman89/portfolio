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

export interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
