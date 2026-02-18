// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
    pagination?: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Auth
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  role: 'ADMIN' | 'CONTENT_EDITOR' | 'USER';
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Courses
export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  estimatedHours: number;
  totalXp: number;
  thumbnailUrl: string | null;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  userProgress?: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    completionRate: number;
  } | null;
}

export interface CourseDetail extends Course {
  previewVideoUrl: string | null;
  steps: Record<string, Step>;
  createdBy: {
    id: string;
    displayName: string | null;
  };
  publishedAt: string | null;
  userProgress?: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    completionRate: number;
    completedSteps: number;
    totalSteps: number;
    xpEarned: number;
    startedAt: string | null;
  } | null;
}

export interface Step {
  type: string;
  title: string;
  xp: number;
  content?: any;
  userProgress?: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    attempts?: number;
    completedAt?: string;
    score?: number;
  };
}

// Progress
export interface CompleteStepInput {
  courseId: string;
  stepKey: string;
  userAnswer?: any;
  score?: number;
  timeSpent?: number;
}

export interface CompleteStepResponse {
  stepResult: {
    isCorrect: boolean;
    baseXp: number;
    bonusXp: number;
    totalXp: number;
  };
  courseProgress: {
    completionRate: number;
    completedSteps: number;
    totalSteps: number;
    courseCompleted: boolean;
    courseBonusXp: number;
  };
  userStats: {
    totalXp: number;
    level: number;
    currentStreak: number;
    streakUpdated: boolean;
  };
}

export interface UserProgress {
  user: {
    id: string;
    displayName: string | null;
    totalXp: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
  };
  coursesInProgress: Array<{
    courseId: string;
    slug: string;
    title: string;
    thumbnailUrl: string | null;
    completionRate: number;
    completedSteps: number;
    totalSteps: number;
    lastAccessedAt: string;
  }>;
  recentXp: Array<{
    amount: number;
    reason: string;
    description: string | null;
    createdAt: string;
  }>;
}