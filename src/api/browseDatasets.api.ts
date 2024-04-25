import { BROWSE_DATASET_API_URL } from '@app/constants/browseDatasets';
import { getCsrfHeader, httpClient } from './http.api';
import { Template } from '@app/interfaces/interfaces';

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
  keywords: string[];
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

export const getProjectDetails = async (projectId: string | undefined): Promise<ProjectInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(BROWSE_DATASET_API_URL + 'project-details', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });

  return response.data;
};
