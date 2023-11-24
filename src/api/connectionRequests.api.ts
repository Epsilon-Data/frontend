import axios from 'axios';
import { Priority } from '../constants/enums/priorities';

const API_URL = 'http://127.0.0.1:5000/api';

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
  projectName: string;
  requestor?: string;
  requestDate: string;
  requestStatus: Tag;
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
  const response = await axios.get(`${API_URL}/request-list`, {
    params: {
      id: userId,
      type: userType,
    },
  });
  const formattedData = response.data.map(
    (item: { id: number; projectName: string; date: string; requestStatus: number }) => {
      let requestStatus = { value: 'Pending', priority: Priority.INFO };
      switch (item.requestStatus) {
        case 1:
          break;
        case 2:
          requestStatus = { value: 'Requires Revision', priority: Priority.HIGH };
          break;
        case 3:
          requestStatus = { value: 'Approved', priority: Priority.LOW };
          break;
      }
      return { ...item, requestStatus };
    },
  );
  return { data: formattedData, pagination: { ...pagination, total: formattedData.length } };
};

export const getRequestDetails = async (id: number): Promise<RequestTableRow> => {
  const response = await axios.get(`${API_URL}/request-details`, {
    params: {
      id,
    },
  });
  return response.data;
};
