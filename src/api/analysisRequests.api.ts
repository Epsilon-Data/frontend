import { Priority } from '../constants/enums/priorities';
import { ANALYSIS_REQUEST_API_URL } from '@app/constants/analysisRequest';
import { httpClient, getCsrfHeader } from './http.api';

export type AnalysisRequestStatus = 'PENDING' | 'REJECTED' | 'REVISION' | 'REVIEW' | 'APPROVED';

export interface AnalysisRequest {
  requestId?: string;
  projectId: string;
  requestorId?: string;
  requestorName: string;
  requestorEmail: string;
  requestorOrgName: string;
  requestorPosition: string;
  projectName: string;
  projectStartDate: Date;
  projectEndDate: Date;
  projectDescription: string;
  projectObjective: string;
  projectOutcome: string;
  projectMembers: string;
  projectEthicsId: string;
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

export const approveRequest = async (data: { requestId: string | undefined; isApproved: boolean }): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch(
    `${ANALYSIS_REQUEST_API_URL}/${data.requestId}`,
    { isApproved: data.isApproved },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
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
