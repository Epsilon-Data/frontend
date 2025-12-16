import {
  AnalysisRequest,
  getRequestDetails as getAnalysisRequestDetails,
  RequestComment,
} from '@app/api/analysisRequests.api';
import { ConnectionRequest, getRequestDetails as getConnectionRequestDetails } from '@app/api/connectionRequests.api';
import { getProjectRequests, RequestListInfo, RequestSummaryInfo } from '@app/api/projects.api';
import { useCallback, useState } from 'react';

export type AccessRequest = {
  requestor: {
    name: string;
    position: string;
    orgName: string;
    email: string;
  };
  project: {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
  };
  requestId: string;
  status: string;
  comments: RequestComment[];
};

export const useAccessRequests = (projectId: string) => {
  const [request, setRequest] = useState<AccessRequest | null>(null);
  const [requests, setRequests] = useState<RequestListInfo>({ connection: [], analysis: [] });
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false);
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

  const fetchRequest = useCallback(async (record: RequestSummaryInfo, mode: string) => {
    setDrawerLoading(true);
    try {
      let request: ConnectionRequest | AnalysisRequest = {};
      switch (mode) {
        case 'CONNECTION':
          request = await getConnectionRequestDetails(record.requestId);
          break;
        case 'ANALYSIS':
          request = await getAnalysisRequestDetails(record.requestId);
          break;
      }

      const accessRequest: AccessRequest = {
        requestor: {
          name: record.requestorName,
          position: '-',
          orgName: record.requestorOrgName,
          email: record.requestorEmail,
        },
        project: {
          name: record.projectName,
          description: request.project?.description || '-',
          startDate: request.project?.startDate || new Date(),
          endDate: request.project?.endDate || new Date(),
        },
        requestId: record.requestId,
        status: request.request?.status || '-',
        comments: request.request?.comments || [],
      };
      setRequest(accessRequest);
    } catch (error) {
      console.error('Failed to fetch user request:', error);
    } finally {
      setDrawerLoading(false);
    }
  }, []);

  return { requests, request, drawerLoading, tableLoading, fetchRequests, fetchRequest };
};
