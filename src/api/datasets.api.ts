import { DATASET_API_URL, DATE_FORMAT } from '@app/constants/datasets';
import { Priority } from '@app/constants/enums/priorities';
import { format } from 'date-fns';
import { getCsrfHeader, httpClient } from './http.api';

export interface Tag {
  value: string;
  priority: Priority;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface DatasetListItem {
  id: string;
  projectId: string;
  projectCustomId: string;
  projectName: string;
  connectDate: string;
}

export interface AnalysisTableRow {
  key: number;
  id: string;
  name: string;
  createdDate: string;
  updatedDate: string;
  lastUpdated: string;
}

export interface DatasetListData {
  data: DatasetListItem[];
  pagination: Pagination;
}

export interface AnalysisTableData {
  data: AnalysisTableRow[];
  pagination: Pagination;
}

export const getDatasetList = async (pagination: Pagination): Promise<DatasetListData> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATASET_API_URL, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  const formattedData = response.data.map(
    (item: { id: string; projectId: string; projectCustomId: string; projectName: string; connectDate: Date }) => {
      return {
        ...item,
        connectDate: item.connectDate ? format(item.connectDate, DATE_FORMAT) : '-',
      };
    },
  );

  return { data: formattedData, pagination: { ...pagination, total: formattedData.length } };
};

export const getAnalysisTableData = async (
  pagination: Pagination,
  userRequestId: string | undefined,
): Promise<AnalysisTableData> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATASET_API_URL}/${userRequestId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  const formattedData = response.data.map(
    (
      item: {
        id: string;
        name: string;
        createdDate: Date;
        lastUpdated: Date;
        lastUpdatedUser: string;
      },
      index: number,
    ) => {
      return {
        key: index + 1,
        id: item.id,
        name: item.name,
        createdDate: format(item.createdDate, DATE_FORMAT),
        updatedDate: format(new Date(item.lastUpdated), DATE_FORMAT + "', ' h.mma"),
        lastUpdated: item.lastUpdatedUser,
      };
    },
  );
  return {
    data: formattedData,
    pagination: { ...pagination, total: formattedData.length },
  };
};

export const getAnalysisColumns = async (userRequestId: string | undefined): Promise<string[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATASET_API_URL}/columns/${userRequestId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const downloadDataset = async (userRequestId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATASET_API_URL}/download/${userRequestId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'dataset.zip'); // or the file name you expect from the server
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const viewReport = async (scriptId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${DATASET_API_URL}/reports/${scriptId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  const link = document.createElement('a');
  link.href = response.data;
  link.setAttribute('download', 'report.html');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
