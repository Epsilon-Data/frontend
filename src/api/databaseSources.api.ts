import { OverallDatabaseInfoValues } from '@app/interfaces/interfaces';
import { Priority } from '../constants/enums/priorities';
import { SourceStatus } from '@app/constants/enums/sourceStatus';
import { DATE_FORMAT } from '@app/constants/databaseSource';
import { format } from 'date-fns';

import { httpClient, getCsrfHeader } from './http.api';

// const API_URL = 'http://localhost:3333/database-source';

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
  projectId: number;
  projectName: string;
  databaseName: string;
  connectDate: Date;
  sourceStatus?: Tag;
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

export const getSourceList = async (pagination: Pagination): Promise<SourceListData> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get('/hub/database-source/list', {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  const formattedData = response.data.map((item: { connectDate: Date; sourceStatus: number }) => {
    let statusTag = { value: 'Pending', priority: Priority.INFO };
    switch (item.sourceStatus) {
      case SourceStatus.PENDING:
        break;
      case SourceStatus.CRAWL:
        statusTag = { value: 'Crawling', priority: Priority.DISABLED };
        break;
      case SourceStatus.ACTIVE:
        statusTag = { value: 'Active', priority: Priority.LOW };
        break;
    }
    return {
      ...item,
      connectDate: item.connectDate ? format(item.connectDate, DATE_FORMAT) : '-',
      sourceStatus: statusTag,
    };
  });

  return { data: formattedData, pagination: { ...pagination, total: formattedData.length } };
};

export const getProjectName = async (projectId: string | undefined): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get('/hub/database-source/project-name', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });
  return response.data.name;
};

export const getDbSummary = async (projectId: string | undefined): Promise<DatabaseSummaryInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get('/hub/database-source/summary', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });
  return response.data;
};

export const updateDbSummary = async (data: DatabaseSummaryInfo): Promise<DatabaseSummaryInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch('/hub/database-source/update', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  // const response = await axios.patch(`${API_URL}/update`, data);
  return response.data;
};

export const getDbTableInfo = async (projectId: string | undefined): Promise<DatabaseTableInfo[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get('/hub/database-source/tables', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });
  // const response = await axios.get(`${API_URL}/tables`, {
  // params: {
  //   projectId: projectId,
  // },
  // });
  return response.data;
};

export const addDbTemplate = async (
  projectId: string | undefined,
  template: string,
): Promise<{ projectId: string; template: string }> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    '/hub/database-source/add-template',
    { projectId: projectId, template: template },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  // const response = await axios.post(`${API_URL}/add-template`, {
  // projectId: projectId,
  // template: template,
  // });
  return response.data;
};

export const getDbColumns = async (projectId: string | undefined): Promise<string[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get('/hub/database-source/columns', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });
  // const response = await axios.get(`${API_URL}/columns`, {
  //   params: {
  //     projectId: projectId,
  //   },
  // });
  return response.data;
};
