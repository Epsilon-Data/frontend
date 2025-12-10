import { RequestSummaryInfo } from '@app/api/analysisRequests.api';
import { useCallback, useState } from 'react';

export const useAccessRequests = (projectId: string) => {
  const [requests, setRequests] = useState<RequestSummaryInfo[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  console.log(projectId);
  const fetchRequests = useCallback(async () => {
    setTableLoading(true);
    try {
      // const userRequests = await getRequests(projectId);
      setRequests([]);
    } catch (error) {
      console.error('Failed to fetch user analysis requests:', error);
    } finally {
      setTableLoading(false);
    }
  }, []);

  return { requests, tableLoading, fetchRequests };
};
