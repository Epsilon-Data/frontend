import { FileTextOutlined, PieChartOutlined, ProjectOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';

interface requestAccessNavItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: 'primary' | 'error' | 'warning' | 'success';
  href: string;
}

export const requestAccessNavData: requestAccessNavItem[] = [
  {
    id: 1,
    name: 'browse.access.dataset.title',
    icon: <PieChartOutlined rev={undefined} />,
    color: 'primary',
    href: 'dataset',
  },
  {
    id: 2,
    name: 'browse.access.requestor.title',
    icon: <UserOutlined rev={undefined} />,
    color: 'primary',
    href: 'requestor',
  },
  {
    id: 3,
    name: 'browse.access.project.title',
    icon: <ProjectOutlined rev={undefined} />,
    color: 'primary',
    href: 'project',
  },
  {
    id: 4,
    name: 'browse.access.ethics.title',
    icon: <FileTextOutlined rev={undefined} />,
    color: 'primary',
    href: 'ethics',
  },
];
