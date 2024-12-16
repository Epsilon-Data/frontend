/* eslint-disable @typescript-eslint/no-explicit-any */
import { OverallDatabaseInfoValues, TemplatePermissions } from '@app/interfaces/interfaces';
import { Priority } from '../constants/enums/priorities';
import { CrawlStatus } from '@app/constants/enums/crawlStatus';
import { DATE_FORMAT, DATASOURCE_API_URL } from '@app/constants/datasource';
import { format } from 'date-fns';
import { httpClient, getCsrfHeader } from './http.api';
import { AxiosProgressEvent } from 'axios';
import { RcFile } from 'antd/es/upload';
import { ProjectDetails } from '@app/store/slices/projectSlice';

export interface Tag {
  value: string;
  priority: Priority;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface SourceListItem {
  projectId: string;
  projectCustomId: string;
  projectName: string;
  dbId: string;
  databaseName: string;
  connectDate: Date | string;
  crawlStatus: Tag;
  statusMsg: string;
  statusPercent: number;
}

export interface SourceListData {
  data: SourceListItem[];
  pagination: Pagination;
}

export interface DatabaseSummaryInfo {
  overall: OverallDatabaseInfoValues;
  diagram: string;
}

export interface DatabaseTableInfo {
  name: string;
  colCount: number;
  schema: string;
  columns: ColumnTableRow[];
}

export interface ColumnTableRow {
  name: string;
  type: string;
  nullable: boolean;
  primary: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCrawlStatus = (status: number) => {
  let statusTag = { value: 'Pending', priority: Priority.INFO, status: CrawlStatus.PENDING };

  switch (status) {
    case CrawlStatus.PENDING:
      break;
    case CrawlStatus.CRAWL:
      statusTag = { value: 'Crawling', priority: Priority.DISABLED, status: CrawlStatus.CRAWL };
      break;
    case CrawlStatus.ACTIVE:
      statusTag = { value: 'Active', priority: Priority.LOW, status: CrawlStatus.ACTIVE };
      break;
    // Add more cases if needed
    default:
      break;
  }

  return statusTag;
};

export const getSourceList = async (pagination: Pagination): Promise<SourceListData> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATASOURCE_API_URL, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  let formattedData = response.data.map((item: any) => {
    const result = {
      ...item,
      connectDate: item && item.connectDate ? format(new Date(item.connectDate), DATE_FORMAT) : '-',
      crawlStatus:
        item && item.crawlStatus ? updateCrawlStatus(item.crawlStatus) : { value: 'Pending', priority: Priority.INFO },
    };
    return result;
  });

  formattedData = formattedData.filter((item: any) => item.databaseName);

  return { data: formattedData, pagination: { ...pagination, total: formattedData.length } };
};

export const getProjectDetails = async (projectId: string | undefined): Promise<ProjectDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATASOURCE_API_URL}/${projectId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  if (response.data.cover) {
    response.data.cover = [
      {
        uid: '1',
        name: 'cover.jpg',
        status: 'done',
        url: response.data.cover,
        thumbUrl: response.data.cover,
      },
    ];
  } else {
    response.data.cover = [];
  }

  if (response.data.visualisations) {
    response.data.visualisations = JSON.parse(response.data.visualisations);
    response.data.visualisations = response.data.visualisations.map((item: { url: string }) => ({
      ...item,
      url: item.url.replace('https://', ''),
    }));
  } else {
    response.data.visualisations = [];
  }

  return response.data;
};

export const getDbSummary = async (projectId: string | undefined): Promise<DatabaseSummaryInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATASOURCE_API_URL}/${projectId}/summary`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const getDbTableInfo = async (projectId: string | undefined): Promise<DatabaseTableInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATASOURCE_API_URL}/${projectId}/tables`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const getDbColumns = async (projectId: string | undefined): Promise<any> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATASOURCE_API_URL}/${projectId}/columns`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const getAccessPermissions = async (projectId: string | undefined): Promise<TemplatePermissions[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATASOURCE_API_URL}/${projectId}/permissions`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const addAccessPermissions = async (
  projectId: string | undefined,
  permissions: TemplatePermissions[],
): Promise<{ projectId: string; permissions: TemplatePermissions[] }> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(`${DATASOURCE_API_URL}/${projectId}/permissions`, permissions, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const uploadProjectCover = async (
  projectId: string | undefined,
  file: string | Blob | RcFile,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
): Promise<Buffer> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const formData = new FormData();
  formData.append('file', file);
  const response = await httpClient.post(DATASOURCE_API_URL + '/upload-cover', formData, {
    headers: { [csrfHeaderName]: `${csrf}`, 'Content-Type': 'multipart/form-data' },
    params: {
      projectId: projectId,
    },
    onUploadProgress: onUploadProgress,
  });
  return response.data;
};

export const uploadVis = async (projectId: string | undefined, visList: string): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    DATASOURCE_API_URL + 'upload-vis',
    { projectId: projectId, vis: visList },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};

export const deleteCover = async (projectId: string | undefined): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(DATASOURCE_API_URL + '/delete-cover', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });

  return response.data;
};

export const syncDatasource = async (projectId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(`${DATASOURCE_API_URL}/${projectId}/sync`, null, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
