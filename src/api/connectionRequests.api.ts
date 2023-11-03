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

export interface RequestTableRow {
  id: number;
  projectName: string;
  requestor?: string;
  requestDate: Date;
  requestStatus: Tag;
}

export interface RequestTableData {
  data: RequestTableRow[];
  pagination: Pagination;
}

export const getRequestTableData = (pagination: Pagination, user: string): Promise<RequestTableData> => {
  if (user === 'orgAdmin') {
    return getOrgAdminRequests(pagination);
  } else if (user === 'researcher') {
    return getResearcherRequests(pagination);
  }

  return Promise.resolve({ data: [], pagination });
};

const getOrgAdminRequests = (pagination: Pagination): Promise<RequestTableData> => {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: [
          {
            id: 1,
            projectName: 'Project 1',
            requestor: 'Researcher 1',
            requestDate: new Date(2023, 3, 12),
            requestStatus: { value: 'Pending', priority: Priority.INFO },
          },
          {
            id: 2,
            projectName: 'Project 2',
            requestor: 'Researcher 2',
            requestDate: new Date(2023, 5, 6),
            requestStatus: { value: 'Requires Revision', priority: Priority.HIGH },
          },
          {
            id: 3,
            projectName: 'Project 3',
            requestor: 'Researcher 3',
            requestDate: new Date(2023, 7, 22),
            requestStatus: { value: 'Approved', priority: Priority.LOW },
          },
        ],
        pagination: { ...pagination, total: 3 },
      });
    }, 1000);
  });
};

const getResearcherRequests = (pagination: Pagination): Promise<RequestTableData> => {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: [
          {
            id: 1,
            projectName: 'Project 1',
            requestDate: new Date(2023, 3, 12),
            requestStatus: { value: 'Pending', priority: Priority.INFO },
          },
          {
            id: 2,
            projectName: 'Project 2',
            requestDate: new Date(2023, 5, 6),
            requestStatus: { value: 'Requires Revision', priority: Priority.HIGH },
          },
          {
            id: 3,
            projectName: 'Project 3',
            requestDate: new Date(2023, 7, 22),
            requestStatus: { value: 'Approved', priority: Priority.LOW },
          },
        ],
        pagination: { ...pagination, total: 3 },
      });
    }, 1000);
  });
};
