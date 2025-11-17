import { Priority } from '../constants/enums/priorities';
import { DATABASE_API_URL } from '@app/constants/database';
import { httpClient, getCsrfHeader } from './http.api';
import { AxiosProgressEvent } from 'axios';
import { RcFile } from 'antd/es/upload';

export interface OverallDatabaseInfo {
  created?: Date;
  schemaCount: number;
  totalTableCount: number;
  totalColCount: number;
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
  overall: OverallDatabaseInfo;
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

export interface ColumnInfo {
  id: string;
  name: string;
  table: string;
}

export const getDbSummary = async (projectId: string | undefined): Promise<DatabaseSummaryInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATABASE_API_URL}/${projectId}/summary`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const getDbTableInfo = async (projectId: string | undefined): Promise<DatabaseTableInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATABASE_API_URL}/${projectId}/tables`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const getDbColumns = async (projectId: string | undefined): Promise<ColumnInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATABASE_API_URL}/${projectId}/columns`, {
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
  const response = await httpClient.post(DATABASE_API_URL + '/upload-cover', formData, {
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
    DATABASE_API_URL + 'upload-vis',
    { projectId: projectId, vis: visList },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};

export const deleteCover = async (projectId: string | undefined): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(DATABASE_API_URL + '/delete-cover', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });

  return response.data;
};

export const syncDatasource = async (projectId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(`${DATABASE_API_URL}/${projectId}/sync`, null, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
