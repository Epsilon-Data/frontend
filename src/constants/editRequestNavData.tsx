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
    name: 'editRequest.nav.projectInfo.title',
    icon: <ProjectOutlined rev={undefined} />,
    color: 'primary',
    href: 'project-info',
  },
  {
    id: 2,
    name: 'editRequest.nav.databaseInfo.title',
    icon: <DatabaseOutlined rev={undefined} />,
    color: 'primary',
    href: 'database-info',
  },
  {
    id: 3,
    name: 'editRequest.nav.dataInfo.title',
    icon: <PieChartOutlined rev={undefined} />,
    color: 'primary',
    href: 'data-info',
  },
  {
    id: 4,
    name: 'editRequest.nav.orgAdminInfo.title',
    icon: <UserOutlined rev={undefined} />,
    color: 'primary',
    href: 'org-admin-info',
  },
  {
    id: 5,
    name: 'editRequest.nav.additionalInfo.title',
    icon: <PlusSquareOutlined rev={undefined} />,
    color: 'primary',
    href: 'add-info',
  },
];
