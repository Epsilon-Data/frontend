import axios from 'axios';
import { Priority } from '../constants/enums/priorities';
import { RequestDetails } from '@app/interfaces/interfaces';
import moment from 'moment';

export enum ConnectionRequestStatus {
  PENDING = 1,
  REVISION = 2,
  APPROVED = 3,
}

const API_URL = 'http://127.0.0.1:5000/api';
const DATE_FORMAT = 'DD/MM/YYYY';

const convertDate = (dateString: string) => {
  return moment(dateString, DATE_FORMAT, 'en-GB').toDate();
};

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
      case ConnectionRequestStatus.PENDING:
        break;
      case ConnectionRequestStatus.REVISION:
        requestStatus = { value: 'Requires Revision', priority: Priority.HIGH };
        break;
      case ConnectionRequestStatus.APPROVED:
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
  response.data.date = convertDate(response.data.date);
  response.data.projectDuration = [
    convertDate(response.data.projectDuration[0]),
    convertDate(response.data.projectDuration[1]),
  ];
  response.data.dataInfo.collectionDuration = [
    convertDate(response.data.dataInfo.collectionDuration[0]),
    convertDate(response.data.dataInfo.collectionDuration[1]),
  ];

  return response.data;
};
