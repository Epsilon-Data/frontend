import { Priority } from '../constants/enums/priorities';
import { DatabaseConnectionDetails, DatabaseInfoFormValues, RequestDetails } from '@app/interfaces/interfaces';
import { RequestStatus } from '@app/constants/enums/requestStatus';
import { format } from 'date-fns';
import { DATE_FORMAT, CONNECTION_REQUEST_API_URL } from '@app/constants/connectionRequest';
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

export interface RequestTableRow {
  key: number;
  id: string;
  projectId?: string;
  projectCustomId: string;
  dbStatus?: number;
  requestor?: string;
  createdDate: string;
  statusTag: Tag;
  projectName: string;
}

export interface RequestTableData {
  data: RequestTableRow[];
  pagination: Pagination;
  isAdmin: boolean;
}

export const getRequestTableData = async (pagination: Pagination): Promise<RequestTableData> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(CONNECTION_REQUEST_API_URL + 'summary', {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  const formattedData = response.data.requests.map(
    (
      item: {
        id: number;
        requestor?: string;
        dbStatus?: number;
        status: number;
        createdDate: Date;
        Project: { id?: string; customId: string; name: string };
      },
      index: number,
    ) => {
      let statusTag = { value: 'Pending', priority: Priority.INFO };
      switch (item.status) {
        case RequestStatus.PENDING:
          break;
        case RequestStatus.REVISION:
          statusTag = { value: 'Requires Revision', priority: Priority.HIGH };
          break;
        case RequestStatus.APPROVED:
          statusTag = { value: 'Approved', priority: Priority.LOW };
          break;
      }
      return {
        key: index + 1,
        id: item.id,
        requestor: item.requestor,
        projectId: item.Project.id,
        projectCustomId: item.Project.customId,
        dbStatus: item.dbStatus,
        statusTag: statusTag,
        createdDate: format(item.createdDate, DATE_FORMAT),
        projectName: item.Project.name,
      };
    },
  );
  return {
    data: formattedData,
    pagination: { ...pagination, total: formattedData.length },
    isAdmin: response.data.isAdmin,
  };
};

export const getRequestDetails = async (requestId: string | undefined): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(CONNECTION_REQUEST_API_URL + 'details', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      requestId: requestId,
    },
  });
  return response.data;
};

export const isValidProjectId = async (projectId: string): Promise<boolean> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(CONNECTION_REQUEST_API_URL + 'valid-project-id', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      projectId: projectId,
    },
  });
  return response.data;
};

export const createRequest = async (data: RequestDetails): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(CONNECTION_REQUEST_API_URL + 'create', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const editRequest = async (data: RequestDetails): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch(CONNECTION_REQUEST_API_URL + 'edit', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const deleteRequest = async (requestId: string | undefined): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(CONNECTION_REQUEST_API_URL + 'delete', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      requestId: requestId,
    },
  });
  return response.data;
};

export const reviseRequest = async (data: {
  requestId: string | undefined;
  revisionInfo: string;
}): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch(CONNECTION_REQUEST_API_URL + 'revision', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const approveRequest = async (data: DatabaseInfoFormValues, id: string | undefined): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch(CONNECTION_REQUEST_API_URL + 'approve', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      requestId: id,
    },
  });
  return response.data;
};

export const testConnection = async (data: DatabaseConnectionDetails): Promise<unknown> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(CONNECTION_REQUEST_API_URL + 'test-connection', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
