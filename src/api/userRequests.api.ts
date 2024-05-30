/* eslint-disable @typescript-eslint/no-explicit-any */
import { Priority } from '../constants/enums/priorities';
import { RequestStatus } from '@app/constants/enums/requestStatus';
import { format } from 'date-fns';
import { DATE_FORMAT, USER_REQUEST_API_URL } from '@app/constants/userRequest';
import { httpClient, getCsrfHeader } from './http.api';
import { AccessDetails } from '@app/interfaces/interfaces';

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
  requestor: string;
  statusTag: Tag;
  createdDate: string;
  projectName: string;
  requestingProjectId: string;
  requestingProject: string;
}

export interface RequestTableData {
  data: RequestTableRow[];
  pagination: Pagination;
}

export const getRequestTableData = async (
  pagination: Pagination,
  page: string | undefined,
): Promise<RequestTableData> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(USER_REQUEST_API_URL + 'summary', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      mode: page,
    },
  });

  const formattedData = response.data.requests.map(
    (
      item: {
        id: number;
        requestorName: string;
        status: number;
        createdDate: Date;
        projectName: string;
        Project: { id: string; name: string };
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
        case RequestStatus.REJECTED:
          statusTag = { value: 'Rejected', priority: Priority.DISABLED };
          break;
      }

      return {
        key: index + 1,
        id: item.id,
        requestor: item.requestorName,
        statusTag: statusTag,
        createdDate: format(item.createdDate, DATE_FORMAT),
        projectName: item.projectName,
        requestingProjectId: item.Project.id,
        requestingProject: item.Project.name,
      };
    },
  );
  return {
    data: formattedData,
    pagination: { ...pagination, total: formattedData.length },
  };
};

export const getRequestDetails = async (requestId: string | undefined): Promise<AccessDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(USER_REQUEST_API_URL + 'details', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      requestId: requestId,
    },
  });
  return response.data;
};

export const reviseRequest = async (data: { requestId: string | undefined; revisionInfo: string }): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch(USER_REQUEST_API_URL + 'revision', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const proceedRequest = async (data: { requestId: string | undefined; isApproved: boolean }): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch(USER_REQUEST_API_URL + 'proceed', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const deleteRequest = async (requestId: string | undefined): Promise<AccessDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(USER_REQUEST_API_URL + 'delete', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      requestId: requestId,
    },
  });
  return response.data;
};

export const editRequest = async (data: AccessDetails): Promise<AccessDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch(USER_REQUEST_API_URL + 'edit', data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
