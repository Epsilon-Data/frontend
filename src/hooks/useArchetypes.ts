import { Archetype, ArchetypeInfo, getArchetypeDetails, getArchetypes } from '@app/api/archetypes.api';
import { useCallback, useState } from 'react';

const isAbortError = (err: unknown) => err instanceof DOMException && err.name === 'AbortError';

export const useArchetypes = (projectId: string) => {
  const [archetype, setArchetype] = useState<ArchetypeInfo>({} as ArchetypeInfo);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [manageLoading, setManageLoading] = useState<boolean>(false);

  const fetchArchetypes = useCallback(
    async (signal?: AbortSignal) => {
      setTableLoading(true);
      try {
        const userArchetypes = await getArchetypes(projectId);
        setArchetypes(userArchetypes);
      } catch (error) {
        if (signal?.aborted || isAbortError(error)) return;
        console.error('Failed to fetch archetypes for project:', error);
      } finally {
        if (!signal?.aborted) setTableLoading(false);
      }
    },
    [projectId],
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

  return { archetypes, archetype, tableLoading, manageLoading, fetchArchetypes, fetchArchetype };
};
