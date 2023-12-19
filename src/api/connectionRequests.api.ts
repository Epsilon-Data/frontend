import axios from 'axios';
import { Priority } from '../constants/enums/priorities';
import { RequestDetails } from '@app/interfaces/interfaces';
import { RequestStatus } from '@app/constants/enums/requestStatus';
import { Dates } from '@app/constants/Dates';

const API_URL = 'http://127.0.0.1:5000/api';
const DATE_FORMAT = 'D/M/YYYY';

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
  const formattedData = response.data.map((item: { requestStatus: number }) => {
    let requestStatus = { value: 'Pending', priority: Priority.INFO };
    switch (item.requestStatus) {
      case RequestStatus.PENDING:
        break;
      case RequestStatus.REVISION:
        requestStatus = { value: 'Requires Revision', priority: Priority.HIGH };
        break;
      case RequestStatus.APPROVED:
        requestStatus = { value: 'Approved', priority: Priority.LOW };
        break;
    }
    return { ...item, requestStatus };
  });
  return { data: formattedData, pagination: { ...pagination, total: formattedData.length } };
};

export const getRequestDetails = async (id: string | undefined): Promise<RequestDetails> => {
  const response = await axios.get(`${API_URL}/request-details`, {
    params: {
      id,
    },
  });
  response.data.date = Dates.getDate(response.data.date, DATE_FORMAT);
  response.data.projectInfo.duration = [
    Dates.getDate(response.data.projectInfo.duration[0], DATE_FORMAT),
    Dates.getDate(response.data.projectInfo.duration[1], DATE_FORMAT),
  ];
  response.data.dataInfo.collectionDuration = [
    Dates.getDate(response.data.dataInfo.collectionDuration[0], DATE_FORMAT),
    Dates.getDate(response.data.dataInfo.collectionDuration[1], DATE_FORMAT),
  ];

  return response.data;
};
