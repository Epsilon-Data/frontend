import React from 'react';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const homeNavigation: SidebarNavigationItem[] = [
  {
    title: 'breadcrumbs.home',
    key: 'medical-dashboard',
    url: '/',
  },
];

export const connectNavigation: SidebarNavigationItem[] = [
  {
    title: 'connectionRequests.oaTitle',
    key: 'oa-connection-requests',
    url: '/oa-connection-requests',
  },
  {
    title: 'connectionRequests.rTitle',
    key: 'r-connection-requests',
    url: '/r-connection-requests',
  },
];

export const manageNavigation: SidebarNavigationItem[] = [
  {
    title: 'databaseSources.title',
    key: 'database-sources',
    children: [{ title: 'databaseSources.sourceList', key: 'list', url: '/database-sources/list' }],
  },
];

// export const browseNavigation: SidebarNavigationItem[] = [];
