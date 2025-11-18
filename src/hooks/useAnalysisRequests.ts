import { getRequests, RequestSummaryInfo } from '@app/api/analysisRequests.api';
import { useCallback, useState } from 'react';

export const useAnalysisRequests = () => {
  const [requests, setRequests] = useState<RequestSummaryInfo[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const fetchRequests = useCallback(async () => {
    setTableLoading(true);
    try {
      const userRequests = await getRequests();
      setRequests(userRequests);
    } catch (error) {
      console.error('Failed to fetch user analysis requests:', error);
    } finally {
      setTableLoading(false);
    }
  }, []);

  return { requests, tableLoading, fetchRequests };
};
