import { PROJECT_API_URL } from '@app/constants/projects';
import { getCsrfHeader, httpClient } from './http.api';

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

export interface ProjectSummaryInfo {
  projectId: string;
  name: string;
  lastModified: Date;
  createdDate: Date;
  dbKeywords?: string[];
  university: string;
  faculty: string;
  lead: string;
  status: string;
}

export interface ConnectionInfo {
  requestId?: string;
  orgAdminEmail?: string;
  dbDetails?: {
    name: string;
    type: string;
    host?: string;
    port?: string;
    url?: string;
    username?: string;
    password?: string;
    ssl?: boolean;
  };
  additionalInfo?: string;
}

export interface Member {
  email?: string;
  role?: string;
  name?: string;
}

export interface ProjectInfo {
  projectId?: string;
  status?: 'PENDING' | 'CRAWLING' | 'READY' | 'ERROR' | 'MAPPED';
  ownerId: string;
  name: string;
  lead: string;
  university: string;
  faculty: string;
  ethicsId: string;
  description: string;
  startDate: Date;
  endDate: Date;
  members: Member[];
  participantsNum: string;
  lastModified?: Date;
  dbKeywords?: string[];
  connection: ConnectionInfo;
}

export interface Member {
  email?: string;
  role?: string;
  name?: string;
}

export interface RequestSummaryInfo {
  requestId: string;
  projectName: string;
  status: string;
  requestorName: string;
  requestorEmail: string;
  requestorOrgName: string;
  createdDate: Date;
}

export interface RequestListInfo {
  connection: RequestSummaryInfo[];
  analysis: RequestSummaryInfo[];
}

export const createProject = async (data: ProjectInfo): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.post(PROJECT_API_URL, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const getUserOwnedProjects = async (signal?: AbortSignal): Promise<ProjectSummaryInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
    signal,
  });
  return response.data;
};

// get shared projects
export const getUserSharedProjects = async (signal?: AbortSignal): Promise<ProjectSummaryInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}/shared`, {
    headers: { [csrfHeaderName]: `${csrf}` },
    signal,
  });
  return response.data;
};

export const getAllProjects = async (): Promise<ProjectSummaryInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}/all`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const getProjectDetails = async (projectId: string | undefined): Promise<ProjectInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}/${projectId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const getProjectPublicDetails = async (projectId: string | undefined): Promise<ProjectInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}/${projectId}/public`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const getProjectSummary = async (projectId: string | undefined): Promise<ProjectSummaryInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}/${projectId}/summary`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const getProjectRequests = async (projectId: string | undefined): Promise<RequestListInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}/${projectId}/requests`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
