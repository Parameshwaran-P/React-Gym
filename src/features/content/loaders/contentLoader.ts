// src/features/content/loaders/contentLoader.ts

import { logError, logCriticalError } from '../../../shared/utils/errorLogger';

export interface ContentConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  version: string;
  totalUnits: number;
  estimatedHours: number;
}

export interface UnitMetadata {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  prerequisites: string[];
  unlocks: string[];
  xp: number;
}

// Available content (easy to expand)
export const AVAILABLE_CONTENTS = [
  { 
    id: 'react', 
    name: 'React Gym',
    path: '/content/react',
    icon: '⚛️',
    color: '#61DAFB'
  },
  { 
    id: 'next', 
    name: 'Next.js Gym',
    path: '/content/next',
    icon: '⚛️',
    color: '#000000'
  },
  // Future: Add more languages here
  // { id: 'nodejs', name: 'Node.js Gym', path: '/content/nodejs', icon: '🟢', color: '#339933' },
  // { id: 'python', name: 'Python Gym', path: '/content/python', icon: '🐍', color: '#3776AB' },
];

/**
 * Custom error class for content loading errors
 */
export class ContentLoadError extends Error {
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'NETWORK_ERROR' | 'PARSE_ERROR' | 'INVALID_DATA',
    public contentId?: string,
    public unitId?: string
  ) {
    super(message);
    this.name = 'ContentLoadError';
  }
}

/**
 * Validate JSON response
 */
function validateJSON(text: string, context: string): any {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new ContentLoadError(
      `Invalid JSON in ${context}`,
      'PARSE_ERROR'
    );
  }
}

/**
 * Fetch with timeout and retry
 */
async function fetchWithRetry(
  url: string, 
  retries = 3, 
  timeout = 5000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, { 
        signal: controller.signal,
        cache: 'no-cache' // Always get fresh content
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (i === retries - 1) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new ContentLoadError(
            'Request timeout - please check your connection',
            'NETWORK_ERROR'
          );
        }
        throw new ContentLoadError(
          'Network error - please check your connection',
          'NETWORK_ERROR'
        );
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new ContentLoadError('Failed after retries', 'NETWORK_ERROR');
}

/**
 * Load content metadata
 */
export async function loadContentMetadata(contentId: string): Promise<ContentConfig> {
  try {
    const response = await fetchWithRetry(`/content/${contentId}/meta.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new ContentLoadError(
          `Content "${contentId}" not found`,
          'NOT_FOUND',
          contentId
        );
      }
      throw new ContentLoadError(
        `Failed to load content metadata: ${response.statusText}`,
        'NETWORK_ERROR',
        contentId
      );
    }
    
    const text = await response.text();
    const data = validateJSON(text, `${contentId}/meta.json`);
    
    // Validate required fields
    const requiredFields = ['id', 'name', 'description', 'icon', 'color'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new ContentLoadError(
          `Missing required field "${field}" in metadata`,
          'INVALID_DATA',
          contentId
        );
      }
    }
    
    return data;
  } catch (error) {
    logError(error as Error, 'high', { contentId, context: 'loadContentMetadata' });
    if (error instanceof ContentLoadError) {
      throw error;
    }
    throw new ContentLoadError(
      `Error loading ${contentId} metadata: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'NETWORK_ERROR',
      contentId
    );
  }
}

/**
 * Load content roadmap
 */
export async function loadContentRoadmap(contentId: string) {
  try {
    const response = await fetchWithRetry(`/content/${contentId}/roadmap.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new ContentLoadError(
          `Roadmap for "${contentId}" not found`,
          'NOT_FOUND',
          contentId
        );
      }
      throw new ContentLoadError(
        `Failed to load roadmap: ${response.statusText}`,
        'NETWORK_ERROR',
        contentId
      );
    }
    
    const text = await response.text();
    const data = validateJSON(text, `${contentId}/roadmap.json`);
    
    // Validate roadmap structure
    if (!data.nodes || !Array.isArray(data.nodes)) {
      throw new ContentLoadError(
        'Invalid roadmap structure: missing nodes array',
        'INVALID_DATA',
        contentId
      );
    }
    
    return data;
  } catch (error) {
    logError(error as Error, 'high', { contentId, context: 'loadContentRoadmap' });
    if (error instanceof ContentLoadError) {
      throw error;
    }
    throw new ContentLoadError(
      `Error loading ${contentId} roadmap: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'NETWORK_ERROR',
      contentId
    );
  }
}

/**
 * Load a specific unit dynamically
 */
export async function loadUnit(contentId: string, unitId: string) {
  try {
    const url = `/content/${contentId}/${unitId}.json`;
    
    const response = await fetchWithRetry(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new ContentLoadError(
          `Unit "${unitId}" not found`,
          'NOT_FOUND',
          contentId,
          unitId
        );
      }
      throw new ContentLoadError(
        `Failed to load unit: ${response.statusText}`,
        'NETWORK_ERROR',
        contentId,
        unitId
      );
    }
    
    const text = await response.text();
    const data = validateJSON(text, `${contentId}/${unitId}.json`);
    
    // Validate unit structure
    const requiredFields = ['id', 'title', 'description', 'steps', 'xp'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new ContentLoadError(
          `Missing required field "${field}" in unit`,
          'INVALID_DATA',
          contentId,
          unitId
        );
      }
    }
    
    // Validate steps
    const requiredSteps = ['refresher', 'positive', 'negative', 'task', 'challenge'];
    for (const step of requiredSteps) {
      if (!data.steps[step]) {
        throw new ContentLoadError(
          `Missing required step "${step}" in unit`,
          'INVALID_DATA',
          contentId,
          unitId
        );
      }
    }
    
    return data;
  } catch (error) {
    logCriticalError(error as Error, { contentId, unitId, context: 'loadUnit' });
    if (error instanceof ContentLoadError) {
      throw error;
    }
    throw new ContentLoadError(
      `Error loading unit ${unitId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'NETWORK_ERROR',
      contentId,
      unitId
    );
  }
}

/**
 * Check if content exists
 */
export function isContentAvailable(contentId: string): boolean {
  return AVAILABLE_CONTENTS.some(c => c.id === contentId);
}

/**
 * Get all available units for a content
 */
export async function getAvailableUnits(contentId: string): Promise<string[]> {
  try {
    const roadmap = await loadContentRoadmap(contentId);
    return roadmap.nodes.map((node: any) => node.id);
  } catch (error) {
    console.error(`Failed to get available units for ${contentId}:`, error);
    return [];
  }
}