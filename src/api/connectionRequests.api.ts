/* eslint-disable @typescript-eslint/no-explicit-any */
import { Priority } from '../constants/enums/priorities';
import { DatabaseConnectionDetails, DatabaseInfoFormValues, RequestDetails } from '@app/interfaces/interfaces';
import { RequestStatus } from '@app/constants/enums/requestStatus';
import { format } from 'date-fns';
import { DATE_FORMAT, CONNECTION_REQUEST_API_URL } from '@app/constants/connectionRequest';
import { httpClient, getCsrfHeader } from './http.api';
import { getUsers } from './admin.api';

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
}

export const getRequestTableData = async (
  pagination: Pagination,
  isAdmin: boolean,
): Promise<{ sent: RequestTableData; receive: RequestTableData }> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(CONNECTION_REQUEST_API_URL, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  let users: any[] = [];
  if (isAdmin) {
    users = await getUsers().then((res: any) => {
      return res.map((user: { id: string; firstName: string; lastName: string }) => ({
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
      }));
    });
  }

  const formatRequests = (requests: any[], users: any[]) => {
    return requests.map(
      (
        item: {
          id: string;
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

        const userFullName = users.find((user) => user.id === item.requestor)?.fullName;

        return {
          key: index + 1,
          id: item.id,
          requestor: userFullName,
          projectId: item.Project.id,
          projectCustomId: item.Project.customId,
          dbStatus: item.dbStatus,
          statusTag: statusTag,
          createdDate: format(item.createdDate, DATE_FORMAT),
          projectName: item.Project.name,
        };
      },
    );
  };

  const formattedReceiveData = formatRequests(response.data.requests.receive, users);
  const formattedSentData = formatRequests(response.data.requests.sent, users);

  return {
    sent: {
      data: formattedSentData,
      pagination: { ...pagination, total: formattedSentData.length },
    },
    receive: {
      data: formattedReceiveData,
      pagination: { ...pagination, total: formattedReceiveData.length },
    },
  };
};

export const createRequest = async (data: RequestDetails): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.post(CONNECTION_REQUEST_API_URL, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const getRequestDetails = async (requestId: string | undefined): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${CONNECTION_REQUEST_API_URL}/${requestId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const editRequest = async (data: RequestDetails): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.put(`${CONNECTION_REQUEST_API_URL}/${data.id}`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const deleteRequest = async (requestId: string | undefined): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(`${CONNECTION_REQUEST_API_URL}/${requestId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const approveRequest = async (data: DatabaseInfoFormValues, requestId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.patch(`${CONNECTION_REQUEST_API_URL}/${requestId}`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const reviseRequest = async (data: {
  requestId: string | undefined;
  revisionInfo: string;
}): Promise<RequestDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.put(`${CONNECTION_REQUEST_API_URL}/${data.requestId}/revision`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const testConnection = async (data: DatabaseConnectionDetails): Promise<unknown> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(`${CONNECTION_REQUEST_API_URL}/test`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const isValidProjectId = async (projectId: string): Promise<boolean> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(`${CONNECTION_REQUEST_API_URL}/${projectId}`, null, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
