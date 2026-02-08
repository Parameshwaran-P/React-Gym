// src/features/learning/store/progressStore.ts

import { logError } from '../../../shared/utils/errorLogger';

export interface UnitProgress {
  unitId: string;
  contentId: string;
  stepsCompleted: number[]; // Array of step indices [0,1,2,3,4]
  currentStep: number;
  score: number;
  timeSpent: number; // seconds
  hintsUsed: number;
  completed: boolean;
  completedAt?: string;
  startedAt: string;
  lastAccessedAt: string;
}

export interface UserProgress {
  totalXP: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  units: Record<string, UnitProgress>; // key: `${contentId}-${unitId}`
}

const STORAGE_KEY = 'react-gym-progress';

/**
 * Get all user progress
 */
export function getProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    logError(
      error as Error,
      'medium',
      { context: 'getProgress', action: 'parse' }
    );
  }

  // Default progress
  return {
    totalXP: 0,
    level: 1,
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    units: {},
  };
}

/**
 * Save progress
 */
export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    logError(
      error as Error,
      'high',
      { context: 'saveProgress', action: 'save' }
    );
    
    // Try to clear some space
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old data...');
      try {
        localStorage.removeItem('error_logs');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (retryError) {
        logError(
          retryError as Error,
          'critical',
          { context: 'saveProgress', action: 'retry' }
        );
      }
    }
  }
}

/**
 * Get progress for a specific unit
 */
export function getUnitProgress(contentId: string, unitId: string): UnitProgress | null {
  const progress = getProgress();
  const key = `${contentId}-${unitId}`;
  return progress.units[key] || null;
}

/**
 * Update or create unit progress
 */
export function updateUnitProgress(
  contentId: string, 
  unitId: string, 
  update: Partial<UnitProgress>
): void {
  const progress = getProgress();
  const key = `${contentId}-${unitId}`;
  
  const existing = progress.units[key];
  const now = new Date().toISOString();
  
  progress.units[key] = {
    unitId,
    contentId,
   currentStep:
  update.currentStep !== undefined
    ? update.currentStep
    : existing?.currentStep ?? 0,

stepsCompleted:
  update.stepsCompleted !== undefined
    ? update.stepsCompleted
    : existing?.stepsCompleted ?? [],
    score: existing?.score || 0,
    timeSpent: existing?.timeSpent || 0,
    hintsUsed: existing?.hintsUsed || 0,
    completed: existing?.completed || false,
    startedAt: existing?.startedAt || now,
    lastAccessedAt: now,
    ...update,
  };
  
  // Update last active date
  progress.lastActiveDate = new Date().toISOString().split('T')[0];
  
  saveProgress(progress);
}

/**
 * Mark unit as complete and award XP
 */
export function completeUnit(contentId: string, unitId: string, xp: number): void {
  const progress = getProgress();
  const key = `${contentId}-${unitId}`;
  
  if (progress.units[key] && !progress.units[key].completed) {
    progress.units[key].completed = true;
    progress.units[key].completedAt = new Date().toISOString();
    progress.totalXP += xp;
    
    // Level up every 500 XP
    progress.level = Math.floor(progress.totalXP / 500) + 1;
    
    saveProgress(progress);
  }
}

/**
 * Get stats
 */
export function getStats() {
  const progress = getProgress();
  const completedUnits = Object.values(progress.units).filter(u => u.completed).length;
  
  return {
    totalXP: progress.totalXP,
    level: progress.level,
    streak: progress.streak,
    unitsCompleted: completedUnits,
  };
}

/**
 * Check if a unit is unlocked based on prerequisites
 */
export function isUnitUnlocked(
contentId: string, _id: string, // unitId: string, 
prerequisites: string[]): boolean {
  if (prerequisites.length === 0) {
    return true; // No prerequisites = always unlocked
  }
  
  const progress = getProgress();
  
  // Check if all prerequisites are completed
  return prerequisites.every(prereqId => {
    const key = `${contentId}-${prereqId}`;
    const unit = progress.units[key];
    return unit && unit.completed;
  });
}

/**
 * Get next unlocked unit based on completion
 */
export function getNextUnlockedUnit(
  contentId: string,
  roadmapUnits: Array<{ id: string; prerequisites: string[] }>
): string | null {
  const progress = getProgress();
  
  for (const unit of roadmapUnits) {
    const key = `${contentId}-${unit.id}`;
    const unitProgress = progress.units[key];
    
    // If not completed and unlocked, this is the next unit
    if (!unitProgress?.completed && isUnitUnlocked(contentId, unit.id, unit.prerequisites)) {
      return unit.id;
    }
  }
  
  return null; // All units completed or nothing unlocked
}

/**
 * Get list of unlocked unit IDs
 */
export function getUnlockedUnits(): string[] {
  const progress = getProgress();
  return Object.keys(progress.units).filter(key => progress.units[key].completed);
}

/**
 * Clear all progress (for testing)
 */
export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}