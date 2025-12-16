import { AnalysisRequest } from '@app/api/analysisRequests.api';
import { getProjectRequests, RequestListInfo } from '@app/api/projects.api';
import { useCallback, useState } from 'react';

export const useAccessRequests = (projectId: string) => {
  const [request, setRequest] = useState<AnalysisRequest | null>(null);
  const [requests, setRequests] = useState<RequestListInfo>({ connection: [], analysis: [] });
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const fetchRequests = useCallback(async () => {
    setTableLoading(true);
    try {
      const userRequests = await getProjectRequests(projectId);
      setRequests(userRequests);
    } catch (error) {
      console.error('Failed to fetch access requests:', error);
    } finally {
      setTableLoading(false);
    }
  }, [projectId]);

  const fetchRequest = useCallback(async (requestId: string) => {
    try {
      // const userRequest = await getRequest(requestId);
      console.log(requestId);
      setRequest(null);
    } catch (error) {
      console.error('Failed to fetch user request:', error);
    }
  }, []);

  return { requests, request, tableLoading, fetchRequests, fetchRequest };
};
