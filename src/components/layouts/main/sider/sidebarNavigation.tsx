import React from 'react';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

const homeNavigation: SidebarNavigationItem[] = [];

const connectNavigation: SidebarNavigationItem[] = [
  {
    title: 'connectionRequests.create.title',
    key: 'create',
    url: '/r-connection-requests/create/project-info',
  },
  // {
  //   title: 'connectionRequests.oaTitle',
  //   key: 'oa-connection-requests',
  //   url: '/oa-connection-requests',
  // },
];

const manageNavigation: SidebarNavigationItem[] = [
  {
    title: 'databaseSources.title',
    key: 'database-sources',
    children: [{ title: 'databaseSources.sourceList', key: 'list', url: '/database-sources/list' }],
  },
];

// const browseNavigation: SidebarNavigationItem[] = [];

export function returnCurrentNav(key: string): SidebarNavigationItem[] {
  if (key === 'connect') {
    return connectNavigation;
  } else if (key === 'manage') {
    return manageNavigation;
  } else if (key === 'home') {
    return homeNavigation;
  }
  return [];
}
