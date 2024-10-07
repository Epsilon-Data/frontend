import { BROWSE_DATASET_API_URL } from '@app/constants/browseDatasets';
import { getCsrfHeader, httpClient } from './http.api';
import { AccessDetails, Template } from '@app/interfaces/interfaces';
import { format } from 'date-fns';

export interface Pagination {
  current: number;
  pageSize: number;
  total?: number;
}

export interface ProjectSummaryInfo {
  id: string;
  name: string;
  organisation: string;
  createdDate: Date;
  description?: string;
  keywords?: string[];
  cover?: string | null;
}

export interface ProjectInfo {
  name: string;
  duration: Date[];
  lead: string;
  members: string[];
  university: string;
  faculty: string;
  ethicsId: string;
  description: string;
  dataDescription?: string;
  collectionDuration: Date[];
  dataKeywords: string[];
  dataParticipantsNum: number;
  archetype: Template | null;
  isOwnProject: boolean;
  visualisations: { title: string; url: string }[];
  lastUpdated: string;
}

export const getProjects = async (isSearch: boolean): Promise<ProjectSummaryInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(BROWSE_DATASET_API_URL + 'projects', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      isSearch: isSearch,
    },
  });
  return response.data;
};

export const getProjectDetails = async (
  userId: string | undefined,
  projectId: string | undefined,
): Promise<ProjectInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(BROWSE_DATASET_API_URL + 'project-details', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      userId: userId,
      projectId: projectId,
    },
  });

  response.data.visualisations = JSON.parse(response.data.visualisations);
  if (!response.data.visualisations) {
    response.data.visualisations = [];
  }

  response.data.lastUpdated = format(new Date(response.data.lastUpdated), "h.mma 'on' MMMM d, yyyy");

  return response.data;
};

export const getProjectSummary = async (projectId: string | undefined): Promise<ProjectSummaryInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(BROWSE_DATASET_API_URL + 'project-summary', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });
  return response.data;
};

export const requestAccess = async (data: AccessDetails): Promise<AccessDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(BROWSE_DATASET_API_URL + 'apply-request', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
