import {
  getUserOwnedProjects,
  getUserSharedProjects,
  PaginatedResponse,
  ProjectSummaryInfo,
  ProjectsQuery,
} from '@app/api/projects.api';
import { useCallback, useState } from 'react';

type PaginationInfo = { page: number; limit: number; total: number; totalPages: number };

const emptyPagination: PaginationInfo = { page: 1, limit: 12, total: 0, totalPages: 0 };

export const useUserProjects = () => {
  const [ownedProjects, setOwnedProjects] = useState<ProjectSummaryInfo[]>([]);
  const [ownedPagination, setOwnedPagination] = useState<PaginationInfo>(emptyPagination);
  const [analysisProjects, setAnalysisProjects] = useState<ProjectSummaryInfo[]>([]);
  const [sharedPagination, setSharedPagination] = useState<PaginationInfo>(emptyPagination);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjects = useCallback(
    async (ownedQuery?: ProjectsQuery, sharedQuery?: ProjectsQuery, signal?: AbortSignal) => {
      setLoading(true);
      try {
        const [owned, shared] = await Promise.all([
          getUserOwnedProjects(ownedQuery, signal),
          getUserSharedProjects(sharedQuery, signal),
        ]);
        setOwnedProjects(owned.data);
        setOwnedPagination(owned.pagination);
        setAnalysisProjects(shared.data);
        setSharedPagination(shared.pagination);
      } catch (error) {
        if ((error as any)?.code !== 'ERR_CANCELED') {
          console.error('Failed to fetch projects:', error);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    ownedProjects,
    ownedPagination,
    analysisProjects,
    sharedPagination,
    loading,
    fetchProjects,
  };
};
