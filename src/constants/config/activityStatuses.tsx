import React from 'react';
import { DollarOutlined, PlusOutlined, ReadOutlined } from '@ant-design/icons';
import { ActivityStatusType } from '@app/interfaces/interfaces';

interface ActivityStatusItem {
  name: ActivityStatusType;
  title: string;
  color: 'success' | 'warning' | 'secondary';
  icon: React.ReactNode;
}

export const activityStatuses: ActivityStatusItem[] = [
  {
    name: 'sold',
    title: 'nft.status.sold',
    color: 'success',
    icon: <DollarOutlined rev={undefined} />,
  },
  {
    name: 'added',
    title: 'nft.status.added',
    color: 'warning',
    icon: <PlusOutlined rev={undefined} />,
  },
  {
    name: 'booked',
    title: 'nft.status.booked',
    color: 'secondary',
    icon: <ReadOutlined rev={undefined} />,
  },
];
