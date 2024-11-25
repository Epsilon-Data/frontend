/* eslint-disable @typescript-eslint/no-explicit-any */
import { Priority } from '../constants/enums/priorities';
import { RequestStatus } from '@app/constants/enums/requestStatus';
import { format } from 'date-fns';
import { DATE_FORMAT, ACCESS_REQUEST_API_URL } from '@app/constants/accessRequest';
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

export const getRequestDetails = async (requestId: string | undefined): Promise<AccessDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${ACCESS_REQUEST_API_URL}/${requestId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const getRequestTableData = async (
  pagination: Pagination,
  userId?: string,
): Promise<{ sent: RequestTableData; receive: RequestTableData }> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(ACCESS_REQUEST_API_URL, {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      userId: userId,
    },
  });

  const formatRequests = (requests: any[]) => {
    return requests.map(
      (
        item: {
          id: string;
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
  };

  const formattedReceiveData = formatRequests(response.data.requests.receive);
  const formattedSentData = formatRequests(response.data.requests.sent);
  return {
    sent: { data: formattedSentData, pagination: { ...pagination, total: formattedSentData.length } },
    receive: { data: formattedReceiveData, pagination: { ...pagination, total: formattedReceiveData.length } },
  };
};

export const reviseRequest = async (data: { requestId: string | undefined; revisionInfo: string }): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.put(`${ACCESS_REQUEST_API_URL}/${data.requestId}/revision`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const approveRequest = async (data: { requestId: string | undefined; isApproved: boolean }): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.patch(
    `${ACCESS_REQUEST_API_URL}/${data.requestId}`,
    { isApproved: data.isApproved },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};

export const editRequest = async (data: AccessDetails): Promise<AccessDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  console.log(JSON.stringify(data));
  const response = await httpClient.put(`${ACCESS_REQUEST_API_URL}/${data.id}`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const deleteRequest = async (requestId: string | undefined): Promise<AccessDetails> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(`${ACCESS_REQUEST_API_URL}/${requestId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
