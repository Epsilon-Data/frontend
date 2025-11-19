import { AnalysisRequest, getRequestDetails, getRequests, RequestSummaryInfo } from '@app/api/analysisRequests.api';
import { useCallback, useState } from 'react';

export const useAnalysisRequests = () => {
  const [request, setRequest] = useState<AnalysisRequest | null>(null);
  const [requests, setRequests] = useState<RequestSummaryInfo[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [manageLoading, setManageLoading] = useState<boolean>(false);

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

  const fetchRequest = useCallback(async (requestId: string) => {
    setManageLoading(true);
    try {
      const selectedRequest = await getRequestDetails(requestId);
      setRequest(selectedRequest);
    } catch (error) {
      console.error('Failed to fetch analysis request details:', error);
    } finally {
      setManageLoading(false);
    }
  }, []);

  return { requests, request, tableLoading, manageLoading, fetchRequests, fetchRequest };
};
