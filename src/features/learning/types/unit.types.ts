// src/features/learning/types/unit.types.ts

export type StepType = 
  | 'markdown' 
  | 'interactive-code' 
  | 'debug-quiz' 
  | 'coding-task' 
  | 'coding-challenge'
  // NEW: Game types
  | 'game-intro'
  | 'code-battle'
  | 'code-puzzle'
  | 'memory-game'
  | 'speed-typing-race'
  | 'bug-hunt-shooter'
  | 'tower-defense';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface StepConfig {
  type: StepType;
  file?: string;
  content?: string;
  code?: string;
  showPreview?: boolean;
  question?: string;
  options?: QuizOption[];
  hints?: string[];
  tests?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface UnitMetadata {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: DifficultyLevel;
  tags: string[];
  prerequisites: string[];
  unlocks: string[];
  xp: number;
}

export interface Unit extends UnitMetadata {
  steps: {
    refresher: StepConfig;
    positive: StepConfig;
    negative: StepConfig;
    task: StepConfig;
    challenge: StepConfig;
  };
}

export interface ContentMetadata {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  totalUnits: number;
  estimatedHours: number;
}

export interface RoadmapNode {
  id: string;
  title: string;
  units: string[];
  prerequisites: string[];
  position: { x: number; y: number };
}

export interface UserProgress {
  unitId: string;
  contentId: string;
  stepsCompleted: number[];
  score: number;
  timeSpent: number; // seconds
  hintsUsed: number;
  completed: boolean;
  completedAt?: string;
  startedAt: string;
  lastAccessedAt: string;
}

export interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  unitsCompleted: number;
  contentProgress: Record<string, {
    completed: number;
    total: number;
    xp: number;
  }>;
}