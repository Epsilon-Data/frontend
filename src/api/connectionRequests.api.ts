import { Priority } from '../constants/enums/priorities';
import { DatabaseConnectionDetails, DatabaseInfoFormValues, RequestDetails } from '@app/interfaces/interfaces';
import { RequestStatus } from '@app/constants/enums/requestStatus';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@app/constants/connectionRequest';

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
  const response = await httpClient.get('/hub/connection-request/summary', {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  const formattedData = response.data.requests.map(
    (
      item: { id: number; requestor?: number; status: number; createdDate: Date; Project: { name: string } },
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
  const response = await httpClient.get('/hub/connection-request/details', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      requestId: requestId,
    },
  });
  return response.data;
};

export const createRequest = async (data: RequestDetails): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post('/hub/connection-request/create', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const editRequest = async (data: RequestDetails): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch('/hub/connection-request/edit', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const deleteRequest = async (requestId: string | undefined): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete('/hub/connection-request/delete', {
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
  const response = await httpClient.patch('/hub/connection-request/revision', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const approveRequest = async (data: DatabaseInfoFormValues, id: string | undefined): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch('/hub/connection-request/approve', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      requestId: id,
    },
  });
  return response.data;
};

export const testConnection = async (data: DatabaseConnectionDetails): Promise<unknown> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post('/hub/connection-request/test-connection', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
