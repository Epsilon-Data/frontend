import {
  DatabaseOutlined,
  PieChartOutlined,
  PlusSquareOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';

interface EditRequestNavItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: 'primary' | 'error' | 'warning' | 'success';
  href: string;
}

export const editRequestNavData: EditRequestNavItem[] = [
  {
    id: 1,
    name: 'connectionRequests.details.projectInfo.title',
    icon: <ProjectOutlined rev={undefined} />,
    color: 'primary',
    href: 'project-info',
  },
  {
    id: 2,
    name: 'connectionRequests.details.databaseInfo.title',
    icon: <DatabaseOutlined rev={undefined} />,
    color: 'primary',
    href: 'database-info',
  },
  {
    id: 3,
    name: 'connectionRequests.details.dataInfo.title',
    icon: <PieChartOutlined rev={undefined} />,
    color: 'primary',
    href: 'data-info',
  },
  {
    id: 4,
    name: 'connectionRequests.details.orgAdminInfo.title',
    icon: <UserOutlined rev={undefined} />,
    color: 'primary',
    href: 'org-admin-info',
  },
  {
    id: 5,
    name: 'connectionRequests.details.addInfo.title',
    icon: <PlusSquareOutlined rev={undefined} />,
    color: 'primary',
    href: 'add-info',
  },
];
