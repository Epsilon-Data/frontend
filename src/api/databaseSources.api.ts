import { OverallDatabaseInfoValues, Template, TemplatePermissions } from '@app/interfaces/interfaces';
import { Priority } from '../constants/enums/priorities';
import { SourceStatus } from '@app/constants/enums/sourceStatus';
import { DATE_FORMAT, DATABASE_SOURCE_API_URL } from '@app/constants/databaseSource';
import { format } from 'date-fns';
import { httpClient, getCsrfHeader } from './http.api';

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
  projectCustomId: string;
  projectName: string;
  databaseName: string;
  connectDate: Date;
  sourceStatus: Tag;
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
  const response = await httpClient.get(DATABASE_SOURCE_API_URL + 'list', {
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

export const addTemplate = async (projectId: string | undefined, template: string): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    DATABASE_SOURCE_API_URL + 'add-template',
    { projectId: projectId, template: template },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );

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

export const deleteTemplate = async (
  projectId: string | undefined,
  templateId: string,
): Promise<{ projectId: string; templates: string }> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    DATABASE_SOURCE_API_URL + 'delete-template',
    { projectId: projectId, templateId: templateId },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );

  return response.data;
};

export const addColumnMapping = async (
  projectId: string | undefined,
  columnMapping: string,
  templateId: string | undefined,
): Promise<{ projectId: string; columnMapping: string }> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    DATABASE_SOURCE_API_URL + 'add-column-mapping',
    { projectId: projectId, columnMapping: columnMapping, templateId: templateId },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );

  return response.data;
};

export const getDbColumns = async (projectId: string | undefined): Promise<string[]> => {
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
