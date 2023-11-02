import { Priority } from '../constants/enums/priorities';

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

export const getSourceList = (pagination: Pagination): Promise<SourceListData> => {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: [
          {
            projectId: 1,
            projectName: 'Project 1',
            databaseName: 'PostgreSQL',
            connectDate: new Date(2023, 3, 26),
            sourceStatus: { value: 'Active', priority: Priority.LOW },
          },
          {
            projectId: 2,
            projectName: 'Project 2',
            databaseName: 'MySQL',
            connectDate: new Date(2023, 5, 10),
            sourceStatus: { value: 'Crawling', priority: Priority.DISABLED },
          },
        ],
        pagination: { ...pagination, total: 2 },
      });
    }, 1000);
  });
};
