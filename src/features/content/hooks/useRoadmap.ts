// src/features/content/hooks/useRoadmap.ts
import { useState, useEffect } from 'react';
import { loadContentRoadmap, ContentLoadError } from '../loaders/contentLoader';

interface RoadmapUnit {
  id: string;
  title: string;
  prerequisites: string[];
  unlocks: string[];
}

interface UseRoadmapResult {
  roadmap: RoadmapUnit[] | null;
  loading: boolean;
  error: ContentLoadError | null;
  retry: () => void;
}

export function useRoadmap(contentId: string): UseRoadmapResult {
  const [roadmap, setRoadmap] = useState<RoadmapUnit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ContentLoadError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await loadContentRoadmap(contentId);
      setRoadmap(data.nodes || []);
    } catch (err) {
      console.error('Error loading roadmap:', err);
      
      if (err instanceof ContentLoadError) {
        setError(err);
      } else {
        setError(new ContentLoadError(
          'Failed to load roadmap',
          'NETWORK_ERROR',
          contentId
        ));
      }
      setRoadmap(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;
      await fetchRoadmap();
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [contentId, retryCount]);

  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  return { roadmap, loading, error, retry };
}