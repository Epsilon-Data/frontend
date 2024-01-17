import axios from 'axios';
import { OverallDatabaseInfo } from '@app/interfaces/interfaces';
import { Priority } from '../constants/enums/priorities';
import { SourceStatus } from '@app/constants/enums/sourceStatus';
import { DATE_FORMAT } from '@app/constants/databaseSource';
import { format } from 'date-fns';

const API_URL = 'http://localhost:3333/database-source';

export interface Tag {
  value: string;
  priority: Priority;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface SourceListItem {
  projectId: number;
  projectName: string;
  databaseName: string;
  connectDate: Date;
  sourceStatus?: Tag;
}

export interface SourceListData {
  data: SourceListItem[];
  pagination: Pagination;
}

export interface DatabaseSummaryInfo {
  overall: OverallDatabaseInfo;
  diagram: string;
}

export const getSourceList = async (pagination: Pagination, userId?: number): Promise<SourceListData> => {
  const response = await axios.get(`${API_URL}/list`, {
    params: {
      userId: userId,
    },
  });

  const formattedData = response.data.map((item: { connectDate: Date; sourceStatus: number }) => {
    let statusTag = { value: 'Pending', priority: Priority.INFO };
    switch (item.sourceStatus) {
      case SourceStatus.PENDING:
        break;
      case SourceStatus.CRAWL:
        statusTag = { value: 'Crawling', priority: Priority.DISABLED };
        break;
      case SourceStatus.ACTIVE:
        statusTag = { value: 'Active', priority: Priority.LOW };
        break;
    }
    return {
      ...item,
      connectDate: item.connectDate ? format(item.connectDate, DATE_FORMAT) : '-',
      sourceStatus: statusTag,
    };
  });

  return { data: formattedData, pagination: { ...pagination, total: formattedData.length } };
};

export const getDbSummary = async (dbId: string | undefined): Promise<DatabaseSummaryInfo> => {
  const response = await axios.get(`${API_URL}/summary`, {
    params: {
      dbId: dbId,
    },
  });
  return response.data;
};
