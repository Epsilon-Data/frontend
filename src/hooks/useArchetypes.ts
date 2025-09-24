import { Archetype, getArchetypes } from '@app/api/archetypes.api';
import { useCallback, useState } from 'react';

export const useArchetypes = (projectId: string) => {
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchArchetypes = useCallback(async () => {
    setLoading(true);
    try {
      const userArchetypes = await getArchetypes(projectId);
      setArchetypes(userArchetypes);
    } catch (error) {
      console.error('Failed to fetch archetypes for project:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return { archetypes, loading, fetchArchetypes };
};
