import { BellOutlined, DollarOutlined, SecurityScanOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';

interface ProfileNavItem {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: 'primary' | 'error' | 'warning' | 'success';
  href: string;
}

export const profileNavData: ProfileNavItem[] = [
  {
    id: 1,
    name: 'profile.nav.personalInfo.title',
    icon: <UserOutlined rev={undefined} />,
    color: 'primary',
    href: 'personal-info',
  },
  {
    id: 2,
    name: 'profile.nav.securitySettings.title',
    icon: <SecurityScanOutlined rev={undefined} />,
    color: 'success',
    href: 'security-settings',
  },
  {
    id: 3,
    name: 'profile.nav.notifications.title',
    icon: <BellOutlined rev={undefined} />,
    color: 'error',
    href: 'notifications',
  },
  {
    id: 4,
    name: 'profile.nav.payments.title',
    icon: <DollarOutlined rev={undefined} />,
    color: 'warning',
    href: 'payments',
  },
];
