import axios from 'axios';
import { Priority } from '../constants/enums/priorities';
import { RequestDetails } from '@app/interfaces/interfaces';
import { RequestStatus } from '@app/constants/enums/requestStatus';
import { format } from 'date-fns';

const API_URL = 'http://localhost:3333/connection-request';
export const DATE_FORMAT = 'dd/MM/yyyy';

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
  id: number;
  requestor?: number;
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
  userType: string,
  userId?: number,
): Promise<RequestTableData> => {
  const response = await axios.get(`${API_URL}/summary`, {
    params: {
      userId: userId,
      userType: userType,
    },
  });
  const formattedData = response.data.map(
    (item: { id: number; requestor?: number; status: number; createdDate: Date; Project: { name: string } }) => {
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
        id: item.id,
        requestor: item.requestor,
        statusTag: statusTag,
        createdDate: format(item.createdDate, DATE_FORMAT),
        projectName: item.Project.name,
      };
    },
  );
  return { data: formattedData, pagination: { ...pagination, total: formattedData.length } };
};

export const getRequestDetails = async (id: string | undefined): Promise<RequestDetails> => {
  const response = await axios.get(`${API_URL}/details`, {
    params: {
      requestId: id,
    },
  });
  return response.data;
};

export const createRequest = async (data: RequestDetails): Promise<RequestDetails> => {
  const response = await axios.post<RequestDetails>(`${API_URL}/create`, data);
  return response.data;
};
