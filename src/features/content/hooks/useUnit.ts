// src/features/content/hooks/useUnit.ts
import { useState, useEffect } from 'react';
import { loadUnit, ContentLoadError } from '../loaders/contentLoader';

interface UseUnitResult {
  unit: any | null;
  loading: boolean;
  error: ContentLoadError | null;
  retry: () => void;
}

export function useUnit(contentId: string, unitId: string): UseUnitResult {
  const [unit, setUnit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ContentLoadError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  

  const fetchUnit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await loadUnit(contentId, unitId);
      setUnit(data);
    } catch (err) {
      console.error('Error loading unit:', err);
      
      if (err instanceof ContentLoadError) {
        setError(err);
      } else {
        setError(new ContentLoadError(
          'An unexpected error occurred',
          'NETWORK_ERROR',
          contentId,
          unitId
        ));
      }
      setUnit(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;
      await fetchUnit();
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [contentId, unitId, retryCount]);

  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  return { unit, loading, error, retry };
}