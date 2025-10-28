import { Archetype, ArchetypeInfo, getArchetypeDetails, getArchetypes } from '@app/api/archetypes.api';
import { useCallback, useState } from 'react';

export const useArchetypes = (projectId: string) => {
  const [archetype, setArchetype] = useState<ArchetypeInfo>({} as ArchetypeInfo);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [manageLoading, setManageLoading] = useState<boolean>(false);

  const fetchArchetypes = useCallback(async () => {
    setTableLoading(true);
    try {
      const userArchetypes = await getArchetypes(projectId);
      setArchetypes(userArchetypes);
    } catch (error) {
      console.error('Failed to fetch archetypes for project:', error);
    } finally {
      setTableLoading(false);
    }
  }, [projectId]);

  const fetchArchetype = useCallback(
    async (archetypeId: string) => {
      setManageLoading(true);
      try {
        const selectedArchetype = await getArchetypeDetails(projectId, archetypeId);
        setArchetype(selectedArchetype);
      } catch (error) {
        console.error('Failed to fetch archetype for project:', error);
      } finally {
        setManageLoading(false);
      }
    },
    [projectId],
  );

  return { archetypes, archetype, tableLoading, manageLoading, fetchArchetypes, fetchArchetype };
};
