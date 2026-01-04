// src/features/content/loaders/contentLoader.ts

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
];

/**
 * Load content metadata
 */
export async function loadContentMetadata(contentId: string): Promise<ContentConfig> {
  try {
    const response = await fetch(`/content/${contentId}/metadata.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${contentId} metadata: ${response.status}`);
    }
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON:', text.substring(0, 200));
      throw new Error('Invalid JSON response');
    }
  } catch (error) {
    console.error(`Error loading ${contentId} metadata:`, error);
    throw error;
  }
}

/**
 * Load content roadmap
 */
export async function loadContentRoadmap(contentId: string) {
  try {
    const response = await fetch(`/content/${contentId}/roadmap.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${contentId} roadmap: ${response.status}`);
    }
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON:', text.substring(0, 200));
      throw new Error('Invalid JSON response');
    }
  } catch (error) {
    console.error(`Error loading ${contentId} roadmap:`, error);
    throw error;
  }
}

/**
 * Load a specific unit
 * Temporarily using inline data
 */
export async function loadUnit(contentId: string, unitId: string) {
  try {
    // Temporary: Use inline data
    if (contentId === 'react') {
      if (unitId === 'react-001-usestate') {
        const { useStateUnit } = await import('../data/units/useState');
        return useStateUnit;
      }
      if (unitId === 'react-002-useeffect') {
        const { useEffectUnit } = await import('../data/units/useEffect');
        return useEffectUnit;
      }
    }
    
    // Fallback: Try to fetch from public folder
    const url = `/content/${contentId}/units/${unitId}/unit.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Unit not found: ${unitId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error loading unit ${unitId}:`, error);
    throw error;
  }
}

/**
 * Check if content exists
 */
export function isContentAvailable(contentId: string): boolean {
  return AVAILABLE_CONTENTS.some(c => c.id === contentId);
}