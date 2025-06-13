import { PROJECT_API_URL } from '@app/constants/projects';
import { getCsrfHeader, httpClient } from './http.api';
import { AccessDetails } from '@app/interfaces/interfaces';

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

export interface ProjectSummaryInfo {
  projectId: string;
  customId: string;
  name: string;
  lastModified: Date;
  university: string;
  faculty: string;
  lead: string;
  status: string;
}

export interface ConnectionInfo {
  requestId?: string;
  orgAdminEmail?: string;
  tempDbDetails?: string;
  additionalInfo?: string;
}

export interface ProjectInfo {
  projectId?: string;
  customId?: string;
  ownerId: string;
  name: string;
  lead: string;
  university: string;
  faculty: string;
  ethicsId: string;
  description: string;
  startDate: Date;
  endDate: Date;
  members: string[];
  participantsNum: string;
  lastModified?: Date;
  dbKeywords?: string[];
  connection: ConnectionInfo;
}

export const createProject = async (data: ProjectInfo): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.post(PROJECT_API_URL, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const getUserProjects = async (): Promise<ProjectSummaryInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}/me`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

// get shared projects
export const getSharedProjects = async (): Promise<ProjectSummaryInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(PROJECT_API_URL, {
    headers: { [csrfHeaderName]: `${csrf}` },
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

export const getProjectSummary = async (projectId: string | undefined): Promise<ProjectSummaryInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROJECT_API_URL}/${projectId}/summary`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const requestAccess = async (data: AccessDetails): Promise<AccessDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(PROJECT_API_URL, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
