// src/features/content/hooks/useUnitMetadata.ts
import { useState, useEffect } from 'react';
import { loadUnit } from '../loaders/contentLoader';

export interface UnitMetadata {
  id: string;
  title: string;
  description: string;
  duration: number;
  xp: number;
  prerequisites: string[];
  unlocks: string[];
}

interface UseUnitMetadataResult {
  units: Record<string, UnitMetadata>;
  loading: boolean;
  error: Error | null;
}

export function useUnitMetadata(
  contentId: string,
  unitIds: string[]
): UseUnitMetadataResult {
  const [units, setUnits] = useState<Record<string, UnitMetadata>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAllUnits = async () => {
      try {
        setLoading(true);
        setError(null);

        const loadedUnits: Record<string, UnitMetadata> = {};

        // Load all units in parallel
        await Promise.all(
          unitIds.map(async (unitId) => {
            try {
              const unit = await loadUnit(contentId, unitId);
              if (isMounted) {
                loadedUnits[unitId] = {
                  id: unit.id,
                  title: unit.title,
                  description: unit.description,
                  duration: unit.duration,
                  xp: unit.xp,
                  prerequisites: unit.prerequisites,
                  unlocks: unit.unlocks,
                };
              }
            } catch (err) {
              console.error(`Failed to load unit ${unitId}:`, err);
              // Continue loading other units even if one fails
            }
          })
        );

        if (isMounted) {
          setUnits(loadedUnits);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (unitIds.length > 0) {
      loadAllUnits();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [contentId, unitIds.join(',')]);

  return { units, loading, error };
}