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
    url: '/connection-requests/create/project-info',
  },
];

const sourceNavigation: SidebarNavigationItem[] = [
  { title: 'databaseSources.metadata.title', key: 'metadata' },
  { title: 'databaseSources.describeDataset.title', key: 'describe-dataset' },
  { title: 'databaseSources.accessPermissions', key: 'access-permissions' },
];

// const browseNavigation: SidebarNavigationItem[] = [];

export function returnCurrentNav(key: string): SidebarNavigationItem[] {
  if (key === 'connect') {
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
