import { Archetype, ArchetypeInfo, getArchetypeDetails, getArchetypes } from '@app/api/archetypes.api';
import { useCallback, useState, useRef, useEffect } from 'react';

const isAbortError = (err: unknown) => err instanceof DOMException && err.name === 'AbortError';

const OPTIMISTIC_KEY = (projectId: string) => `optimistic-archetypes-${projectId}`;
const OPTIMISTIC_TIMEOUT = 15 * 60 * 1000;

type OptimisticArchetype = Archetype & { _createdAt: number };

export const useArchetypes = (projectId: string) => {
  const [archetype, setArchetype] = useState<ArchetypeInfo>({} as ArchetypeInfo);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [manageLoading, setManageLoading] = useState<boolean>(false);
  const [archetypeReadyById, setArchetypeReadyById] = useState<Record<string, boolean>>({});
  const readyByIdRef = useRef<Record<string, boolean>>({});
  const inFlightRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    readyByIdRef.current = archetypeReadyById;
  }, [archetypeReadyById]);

  const ensureArchetypeReady = useCallback(
    (archetypeId: string, signal?: AbortSignal) => {
      if (!archetypeId) return Promise.resolve();

      if (readyByIdRef.current[archetypeId]) return Promise.resolve();
      if (inFlightRef.current.has(archetypeId)) return Promise.resolve();

      inFlightRef.current.add(archetypeId);
      setArchetypeReadyById((prev) => ({ ...prev, [archetypeId]: false }));

      const cleanup = () => {
        inFlightRef.current.delete(archetypeId);
        const timerId = timersRef.current.get(archetypeId);
        if (timerId != null) {
          window.clearInterval(timerId);
          timersRef.current.delete(archetypeId);
        }
      };

      return new Promise<void>((resolve, reject) => {
        const onAbort = () => {
          cleanup();
          reject(new DOMException('Aborted', 'AbortError'));
        };

        if (signal) {
          if (signal.aborted) return onAbort();
          signal.addEventListener('abort', onAbort, { once: true });
        }

        const tick = async () => {
          try {
            if (signal?.aborted) return;

            const info = await getArchetypeDetails(projectId, archetypeId);
            const ready = (info?.nodes?.length ?? 0) > 0;

            if (ready) {
              cleanup();
              setArchetypeReadyById((prev) => ({ ...prev, [archetypeId]: true }));
              resolve();
            }
          } catch (e) {
            if ((e as Error)?.name === 'AbortError') return;
            console.error('ensureArchetypeReady tick failed:', e);
          }
        };

        void tick();
        const intervalId = window.setInterval(() => void tick(), 1000);
        timersRef.current.set(archetypeId, intervalId);
      }).finally(() => {
        if (signal) signal.removeEventListener('abort', () => {});
      });
    },
    [projectId],
  );

  const getOptimisticArchetypes = useCallback(() => {
    try {
      const stored = sessionStorage.getItem(OPTIMISTIC_KEY(projectId));
      const items = stored ? JSON.parse(stored) : [];

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

        merged.forEach((a) => {
          if (a.id) void ensureArchetypeReady(a.id, signal);
        });
      } catch (error) {
        if (signal?.aborted || isAbortError(error)) return;
        console.error('Failed to fetch archetypes for project:', error);
      } finally {
        if (!signal?.aborted) setTableLoading(false);
      }
    },
    [projectId, getOptimisticArchetypes, setOptimisticArchetypes, ensureArchetypeReady],
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
        await ensureArchetypeReady(archetypeId, signal);
        const selectedArchetype = await getArchetypeDetails(projectId, archetypeId);
        setArchetype(selectedArchetype);
      } catch (error) {
        if (signal?.aborted || isAbortError(error)) return;
        console.error('Failed to fetch archetype for project:', error);
      } finally {
        if (!signal?.aborted) setManageLoading(false);
      }
    },
    [ensureArchetypeReady, projectId],
  );

  return {
    archetypes,
    archetype,
    tableLoading,
    manageLoading,
    fetchArchetypes,
    fetchArchetype,
    addArchetype,
    archetypeReadyById,
  };
};
