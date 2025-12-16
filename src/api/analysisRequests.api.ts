import { Priority } from '../constants/enums/priorities';
import { ANALYSIS_REQUEST_API_URL } from '@app/constants/accessRequest';
import { httpClient, getCsrfHeader } from './http.api';

export type AnalysisRequestStatus = 'PENDING' | 'REJECTED' | 'REVISION' | 'APPROVED';

export interface RequestComment {
  requestId: string;
  commentId?: string;
  authorId: string;
  authorName: string;
  content: string;
  createdDate: Date;
}

export interface AnalysisRequest {
  project?: {
    projectId: string;
    name: string;
    description: string;
    dbKeywords: string[];
    university: string;
    faculty: string;
    ethicsId: string;
    startDate: Date;
    endDate: Date;
    participantsNum: number;
    lead: string;
    members: Member[];
  };
  request?: {
    comments: RequestComment[];
    createdDate: Date;
    lastModified: Date;
    status: AnalysisRequestStatus;
  };
  requestId?: string;
  requestorPosition: string;
  requestorName: string;
  requestorEmail: string;
  requestorOrgName: string;
  projectName: string;
  projectStartDate: Date;
  projectEndDate: Date;
  projectDescription: string;
  projectObjective: string;
  projectOutcome: string;
  projectMembers: Member[];
  projectEthicsId: string;
}

export interface Member {
  email?: string;
  role?: string;
  name?: string;
}

export interface Tag {
  value: string;
  priority: Priority;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface RequestSummaryInfo {
  requestId: string;
  projectId: string;
  projectName: string;
  projectUniversity: string;
  status: AnalysisRequestStatus;
  createdDate: Date;
  lastModified: Date;
}

export const createComment = async (data: RequestComment, requestId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.post(`${ANALYSIS_REQUEST_API_URL}/${requestId}/comment`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const getComments = async (requestId: string | undefined): Promise<RequestComment[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${ANALYSIS_REQUEST_API_URL}/${requestId}/comment`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const getRequestDetails = async (requestId: string | undefined): Promise<AnalysisRequest> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${ANALYSIS_REQUEST_API_URL}/${requestId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const getRequests = async (): Promise<RequestSummaryInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(ANALYSIS_REQUEST_API_URL, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const getRequestByProject = async (projectId: string | undefined): Promise<RequestSummaryInfo | null> => {
  if (!projectId) return null;

  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${ANALYSIS_REQUEST_API_URL}/${projectId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const reviseRequest = async (data: { requestId: string | undefined; revisionInfo: string }): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.put(`${ANALYSIS_REQUEST_API_URL}/${data.requestId}/revision`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const createRequest = async (data: AnalysisRequest): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.post(ANALYSIS_REQUEST_API_URL, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const approveRequest = async (data: {
  projectId: string | undefined;
  requestId: string | undefined;
  isApproved: boolean;
}): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.patch(
    `${ANALYSIS_REQUEST_API_URL}/${data.projectId}/${data.requestId}`,
    { isApproved: data.isApproved },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
};

export const editRequest = async (data: AnalysisRequest): Promise<AnalysisRequest> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.put(`${ANALYSIS_REQUEST_API_URL}/${data.requestId}`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const deleteRequest = async (requestId: string | undefined): Promise<AnalysisRequest> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(`${ANALYSIS_REQUEST_API_URL}/${requestId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
