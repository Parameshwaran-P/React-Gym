// src/features/content/hooks/useUnit.ts
import { useState, useEffect } from 'react';
import { loadUnit } from '../loaders/contentLoader';

interface UseUnitResult {
  unit: any | null;
  loading: boolean;
  error: Error | null;
}

export function useUnit(contentId: string, unitId: string): UseUnitResult {
  const [unit, setUnit] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUnit() {
      try {
        setLoading(true);
        setError(null);
        const data = await loadUnit(contentId, unitId);
        
        if (isMounted) {
          setUnit(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    fetchUnit();

    return () => {
      isMounted = false;
    };
  }, [contentId, unitId]);

  return { unit, loading, error };
}