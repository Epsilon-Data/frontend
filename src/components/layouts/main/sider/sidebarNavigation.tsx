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
    title: 'connectionRequests.dbRequestList',
    key: 'requests/database',
    url: '/requests/database',
  },
  {
    title: 'connectionRequests.userRequestList',
    key: 'requests/user',
    url: '/requests/user',
  },
];

const sourceNavigation: SidebarNavigationItem[] = [
  { title: 'databaseSources.metadata.title', key: 'metadata' },
  { title: 'databaseSources.describeDataset.title', key: 'describe-dataset' },
  { title: 'databaseSources.accessPermissions.title', key: 'access-permissions' },
  { title: 'databaseSources.otherSettings.title', key: 'other-settings' },
];

// const browseNavigation: SidebarNavigationItem[] = [];

export function returnCurrentNav(key: string, isAdmin: boolean): SidebarNavigationItem[] {
  if (key === 'connect' && !isAdmin) {
    return connectNavigation;
  } else if (key === 'home') {
    return homeNavigation;
  } else if (key === 'database') {
    return sourceNavigation;
  }
  return [];
}

export function updateUrlById(id: string): void {
  sourceNavigation.forEach((item: SidebarNavigationItem) => {
    item.url = '/database-sources/' + item.key + '/' + id;
  });
}
