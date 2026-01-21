import { Archetype, ArchetypeInfo, getArchetypeDetails, getArchetypes } from '@app/api/archetypes.api';
import { useCallback, useState } from 'react';

const isAbortError = (err: unknown) => err instanceof DOMException && err.name === 'AbortError';

const OPTIMISTIC_KEY = (projectId: string) => `optimistic-archetypes-${projectId}`;
const OPTIMISTIC_TIMEOUT = 15 * 60 * 1000;

type OptimisticArchetype = Archetype & { _createdAt: number };

export const useArchetypes = (projectId: string) => {
  const [archetype, setArchetype] = useState<ArchetypeInfo>({} as ArchetypeInfo);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [manageLoading, setManageLoading] = useState<boolean>(false);

  const getOptimisticArchetypes = useCallback(() => {
    try {
      const stored = sessionStorage.getItem(OPTIMISTIC_KEY(projectId));
      const items = stored ? JSON.parse(stored) : [];

      // Filter out items older than timeout
      const now = Date.now();
      return items.filter((item: OptimisticArchetype) => now - item._createdAt < OPTIMISTIC_TIMEOUT);
    } catch {
      return [];
    }
  }, [projectId]);

  const setOptimisticArchetypes = useCallback(
    (optimistic: Archetype[]) => {
      try {
        const withTimestamp = optimistic.map((item) => ({
          ...item,
          _createdAt: (item as OptimisticArchetype)._createdAt || Date.now(),
        }));

        if (withTimestamp.length > 0) {
          sessionStorage.setItem(OPTIMISTIC_KEY(projectId), JSON.stringify(withTimestamp));
        } else {
          sessionStorage.removeItem(OPTIMISTIC_KEY(projectId));
        }
      } catch {}
    },
    [projectId],
  );

  const fetchArchetypes = useCallback(
    async (signal?: AbortSignal) => {
      setTableLoading(true);
      try {
        const userArchetypes = await getArchetypes(projectId);
        const optimistic = getOptimisticArchetypes();

        const stillPending = optimistic.filter((o: Archetype) => !userArchetypes.some((a) => a.name === o.name));
        setOptimisticArchetypes(stillPending);

        const merged = [...userArchetypes, ...stillPending];
        setArchetypes(merged);
      } catch (error) {
        if (signal?.aborted || isAbortError(error)) return;
        console.error('Failed to fetch archetypes for project:', error);
      } finally {
        if (!signal?.aborted) setTableLoading(false);
      }
    },
    [projectId, getOptimisticArchetypes, setOptimisticArchetypes],
  );

  const addArchetype = useCallback(
    (newArchetype: Archetype) => {
      setArchetypes((prev) => [newArchetype, ...prev]);

      const optimistic = getOptimisticArchetypes();
      setOptimisticArchetypes([{ ...newArchetype, _createdAt: Date.now() } as OptimisticArchetype, ...optimistic]);
    },
    [getOptimisticArchetypes, setOptimisticArchetypes],
  );

  const fetchArchetype = useCallback(
    async (archetypeId: string, signal?: AbortSignal) => {
      setManageLoading(true);
      try {
        const selectedArchetype = await getArchetypeDetails(projectId, archetypeId);
        setArchetype(selectedArchetype);
      } catch (error) {
        if (signal?.aborted || isAbortError(error)) return;
        console.error('Failed to fetch archetype for project:', error);
      } finally {
        if (!signal?.aborted) setManageLoading(false);
      }
    },
    [projectId],
  );

  return { archetypes, archetype, tableLoading, manageLoading, fetchArchetypes, fetchArchetype, addArchetype };
};
