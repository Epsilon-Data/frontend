/* eslint-disable @typescript-eslint/no-explicit-any */
import { OverallDatabaseInfoValues, ProjectSettings, Template, TemplatePermissions } from '@app/interfaces/interfaces';
import { Priority } from '../constants/enums/priorities';
import { CrawlStatus } from '@app/constants/enums/crawlStatus';
import { DATE_FORMAT, DATABASE_SOURCE_API_URL } from '@app/constants/databaseSource';
import { format } from 'date-fns';
import { httpClient, getCsrfHeader } from './http.api';
import { AxiosProgressEvent } from 'axios';
import { RcFile } from 'antd/es/upload';

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
  connectDate: Date;
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
  const response = await httpClient.get(DATABASE_SOURCE_API_URL + 'list', {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  const formattedData = response.data.map((item: { connectDate: Date; crawlStatus: number }) => {
    return {
      ...item,
      connectDate: item.connectDate ? format(item.connectDate, DATE_FORMAT) : '-',
      crawlStatus: updateCrawlStatus(item.crawlStatus),
    };
  });

  return { data: formattedData, pagination: { ...pagination, total: formattedData.length } };
};

export const getProjectId = async (id: string | undefined): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATABASE_SOURCE_API_URL + 'project-id', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      id: id,
    },
  });
  return response.data.customId;
};

export const getDbSummary = async (projectId: string | undefined): Promise<DatabaseSummaryInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATABASE_SOURCE_API_URL + 'summary', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });
  return response.data;
};

export const getDbTableInfo = async (projectId: string | undefined): Promise<DatabaseTableInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATABASE_SOURCE_API_URL + 'tables', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });
  return response.data;
};

export const getTemplateNames = async (projectId: string | undefined): Promise<string[][]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATABASE_SOURCE_API_URL + 'template-names', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });

  return response.data;
};

export const getTemplates = async (projectId: string | undefined): Promise<Template[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATABASE_SOURCE_API_URL + 'templates', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });

  return response.data;
};

export const deleteTemplate = async (projectId: string | undefined, templateId: string): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.post(
    DATABASE_SOURCE_API_URL + 'delete-template',
    { projectId: projectId, templateId: templateId },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
};

export const addArchetype = async (
  projectId: string | undefined,
  columnMapping: string,
  template: string,
): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.post(
    DATABASE_SOURCE_API_URL + 'add-archetype',
    { projectId: projectId, columnMapping: columnMapping, template: template },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
};

export const getDbColumns = async (projectId: string | undefined): Promise<any> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATABASE_SOURCE_API_URL + 'columns', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });

  return response.data;
};

export const getAccessPermissions = async (projectId: string | undefined): Promise<TemplatePermissions[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATABASE_SOURCE_API_URL + 'permissions', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });
  return response.data;
};

export const addAccessPermissions = async (
  projectId: string | undefined,
  permissions: string,
): Promise<{ projectId: string; permissions: string }> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    DATABASE_SOURCE_API_URL + 'add-permissions',
    { projectId: projectId, permissions: permissions },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};

export const getProjectSettings = async (projectId: string | undefined): Promise<ProjectSettings> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATABASE_SOURCE_API_URL + 'settings', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
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

export const uploadProjectCover = async (
  projectId: string | undefined,
  file: string | Blob | RcFile,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
): Promise<Buffer> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const formData = new FormData();
  formData.append('file', file);
  const response = await httpClient.post(DATABASE_SOURCE_API_URL + 'upload-cover', formData, {
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
    DATABASE_SOURCE_API_URL + 'upload-vis',
    { projectId: projectId, vis: visList },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};

export const deleteCover = async (projectId: string | undefined): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(DATABASE_SOURCE_API_URL + 'delete-cover', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });

  return response.data;
};
