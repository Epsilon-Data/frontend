import { PROJECT_API_URL } from '@app/constants/projects';
import { getCsrfHeader, httpClient } from './http.api';
import type { AxiosProgressEvent } from 'axios';

export type ProjectStatus = 'PENDING' | 'CRAWLING' | 'READY' | 'ERROR' | 'MAPPED';
export type ConnectionType = 'CLOUD_CONNECT' | 'DIRECT_DB' | 'PROXY';

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

export interface ProjectsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'date-created' | 'title' | 'last-modified';
}

export interface BrowseProjectsQuery extends ProjectsQuery {
  field?: 'all' | 'name' | 'keywords' | 'organisation';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  isPublic?: boolean;
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
  status?: ProjectStatus;
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
  connectionType?: ConnectionType;
  isPublic?: boolean;
  syntheticDataUrl?: string | null;
  syntheticDataFileName?: string | null;
}

export interface SyntheticDataInfo {
  type: 'link' | 'file' | 'none';
  url?: string | null;
  fileName?: string | null;
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

export const getUserOwnedProjects = async (
  query?: ProjectsQuery,
  signal?: AbortSignal,
): Promise<PaginatedResponse<ProjectSummaryInfo>> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: query,
    signal,
  });
  return response.data;
};

export const getUserSharedProjects = async (
  query?: ProjectsQuery,
  signal?: AbortSignal,
): Promise<PaginatedResponse<ProjectSummaryInfo>> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}/shared`, {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: query,
    signal,
  });
  return response.data;
};

export const getAllProjects = async (query?: BrowseProjectsQuery): Promise<PaginatedResponse<ProjectSummaryInfo>> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}/all`, {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: query,
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

export const deleteProject = async (projectId: string | undefined): Promise<ProjectInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(`${PROJECT_API_URL}/${projectId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const updateCredentials = async (data: ConnectionInfo, projectId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.patch(`${PROJECT_API_URL}/${projectId}/credentials`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const updateProject = async (data: Partial<ProjectInfo>, projectId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.put(`${PROJECT_API_URL}/${projectId}`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const retryCrawl = async (projectId: string): Promise<{ jobId: string }> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    `${PROJECT_API_URL}/${projectId}/retry-crawl`,
    {},
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};

// ---- Synthetic dataset (attached by the data owner after the archetype is published) ----

export const getSyntheticData = async (projectId: string): Promise<SyntheticDataInfo> => {
  const response = await httpClient.get(`${PROJECT_API_URL}/${projectId}/synthetic-data`, {
    withCredentials: true,
  });
  return response.data;
};

export const setSyntheticDataLink = async (projectId: string, url: string): Promise<SyntheticDataInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.put(
    `${PROJECT_API_URL}/${projectId}/synthetic-data/link`,
    { url },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};

export const uploadSyntheticData = async (
  projectId: string,
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<SyntheticDataInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const formData = new FormData();
  formData.append('file', file);

  const response = await httpClient.post(`${PROJECT_API_URL}/${projectId}/synthetic-data`, formData, {
    headers: {
      [csrfHeaderName]: `${csrf}`,
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};

export const removeSyntheticData = async (projectId: string): Promise<SyntheticDataInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(`${PROJECT_API_URL}/${projectId}/synthetic-data`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
