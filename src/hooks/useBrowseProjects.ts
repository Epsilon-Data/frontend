import { getAllProjects, ProjectSummaryInfo } from '@app/api/projects.api';
import { useCallback, useState } from 'react';

export const useBrowseProjects = () => {
  const [projects, setProjects] = useState<ProjectSummaryInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const allProjects = await getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { projects, loading, fetchProjects };
};
