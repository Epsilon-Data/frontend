import { CONNECTION_REQUEST_API_URL } from '@app/constants/accessRequest';
import { httpClient, getCsrfHeader } from './http.api';
import { Member, RequestComment } from './analysisRequests.api';

export type ConnectionRequestStatus = 'PENDING' | 'REJECTED' | 'REVISION' | 'APPROVED';

export interface ConnectionRequest {
  project?: {
    projectId: string;
    name: string;
    description: string;
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
    status: ConnectionRequestStatus;
  };
}

export interface ConnectionDecision {
  isApproved: boolean;
  dbDetails: {
    name: string;
    type: string;
    host?: string;
    port?: string;
    username?: string;
    password?: string;
  };
}

export type DatabaseConnectionDetails = {
  readonly type: string;
  readonly host: string;
  readonly port: string;
  readonly username: string;
  readonly password: string;
  readonly name: string;
  readonly ssl?: boolean;
};

export const getRequestDetails = async (requestId: string | undefined): Promise<ConnectionRequest> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${CONNECTION_REQUEST_API_URL}/${requestId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const approveRequest = async (
  data: ConnectionDecision,
  projectId: string | undefined,
  requestId: string | undefined,
): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.patch(`${CONNECTION_REQUEST_API_URL}/${projectId}/${requestId}`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const testConnection = async (data: DatabaseConnectionDetails): Promise<unknown> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(`${CONNECTION_REQUEST_API_URL}/test`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
