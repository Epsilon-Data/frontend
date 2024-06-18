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
    title: 'connectionRequests.dbRequest',
    key: 'requests/database',
    url: '/requests/database',
  },
  {
    title: 'connectionRequests.accessRequestSidebar.main',
    key: 'requests/user',
    children: [
      {
        title: 'connectionRequests.accessRequestSidebar.received',
        key: 'received',
        url: '/requests/user/receive',
      },
      {
        title: 'connectionRequests.accessRequestSidebar.sent',
        key: 'sent',
        url: '/requests/user/sent',
      },
    ],
  },
];

const sourceNavigation: SidebarNavigationItem[] = [
  { title: 'databaseSources.metadata.title', key: 'metadata' },
  { title: 'databaseSources.describeDataset.title', key: 'describe-dataset' },
  { title: 'databaseSources.accessPermissions.title', key: 'access-permissions' },
  { title: 'databaseSources.otherSettings.title', key: 'other-settings' },
];

const datasetNavigation: SidebarNavigationItem[] = [
  { title: 'dataset.analysis.title', key: 'analysis' },
  { title: 'dataset.standard.title', key: 'standard' },
];

export function returnCurrentNav(key: string): SidebarNavigationItem[] {
  if (key === 'connect') {
    return connectNavigation;
  } else if (key === 'home') {
    return homeNavigation;
  } else if (key === 'database') {
    return sourceNavigation;
  } else if (key === 'dataset') {
    return datasetNavigation;
  }
  return [];
}

export function updateUrlById(id: string, selectedKey: string): void {
  let prefixUrl = '';
  const currentNav = returnCurrentNav(selectedKey);
  if (selectedKey == 'database') {
    prefixUrl = '/database-sources/';
  } else if (selectedKey == 'dataset') {
    prefixUrl = '/datasets/';
  }
  currentNav.forEach((item: SidebarNavigationItem) => {
    item.url = prefixUrl + item.key + '/' + id;
  });
}
