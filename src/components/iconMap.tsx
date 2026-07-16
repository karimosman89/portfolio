import React from 'react';
import {
  // services
  Boxes, Database, Workflow, MessageSquareText, AudioLines, ScanEye, GitBranch, Compass,
  // stats
  Rocket, Building2, Brain, Globe2, Timer, Heart,
  // agents
  Network, Plug, ArrowLeftRight, FunctionSquare, BrainCircuit, AlignLeft, MousePointerClick,
  // skills
  Code2, Sparkles, Cpu, Cloud,
  // workflow diagram
  User, ListChecks, Wrench, CheckCircle2,
  Check, Calendar, ArrowUpRight,
  // live playground
  Send, Loader2, Upload, ImageIcon, ScrollText, Search, Bot, FileText, Scissors, X, Play,
  type LucideProps,
} from 'lucide-react';

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  Boxes, Database, Workflow, MessageSquareText, AudioLines, ScanEye, GitBranch, Compass,
  Rocket, Building2, Brain, Globe2, Timer, Heart,
  Network, Plug, ArrowLeftRight, FunctionSquare, BrainCircuit, AlignLeft, MousePointerClick,
  Code2, Sparkles, Cpu, Cloud,
  User, ListChecks, Wrench, CheckCircle2,
  Check, Calendar, ArrowUpRight,
  Send, Loader2, Upload, ImageIcon, ScrollText, Search, Bot, FileText, Scissors, X, Play,
};

export function DynIcon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const C = MAP[name] || Sparkles;
  return <C size={size} className={className} />;
}
