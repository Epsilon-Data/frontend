import { getUserOwnedProjects, getUserSharedProjects, ProjectSummaryInfo } from '@app/api/projects.api';
import { useCallback, useState } from 'react';

export const useUserProjects = () => {
  const [ownedProjects, setOwnedProjects] = useState<ProjectSummaryInfo[]>([]);
  const [sharedProjects, setSharedProjects] = useState<ProjectSummaryInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjects = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const [owned, shared] = await Promise.all([getUserOwnedProjects(signal), getUserSharedProjects(signal)]);
      setOwnedProjects(owned);
      setSharedProjects(shared);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { ownedProjects, sharedProjects, loading, fetchProjects };
};
