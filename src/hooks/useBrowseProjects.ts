import { getAllProjects, ProjectSummaryInfo, BrowseProjectsQuery } from '@app/api/projects.api';
import { useCallback, useState } from 'react';

export const useBrowseProjects = () => {
  const [projects, setProjects] = useState<ProjectSummaryInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProjects = useCallback(async (query?: BrowseProjectsQuery) => {
    setLoading(true);
    try {
      const result = await getAllProjects(query);
      setProjects(result.data);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { projects, loading, total, totalPages, fetchProjects };
};
