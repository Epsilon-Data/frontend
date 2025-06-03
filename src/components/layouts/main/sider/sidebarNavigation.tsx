import React from 'react';
import { PiCirclesThreeBold } from 'react-icons/pi';
import { TiPointOfInterest } from 'react-icons/ti';
import { FaRegUser } from 'react-icons/fa6';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

const homeNavigation: SidebarNavigationItem[] = [
  {
    title: 'dashboard.sidebar.projects',
    key: 'projects',
    url: '/',
    icon: <PiCirclesThreeBold size={17} />,
  },
  {
    title: 'dashboard.sidebar.browserHub.title',
    key: 'browse',
    children: [
      {
        title: 'dashboard.sidebar.browserHub.browseProjects',
        key: 'browse/projects',
        url: '/browse',
      },
      {
        title: 'dashboard.sidebar.browserHub.trackRequests',
        key: 'browse/track-requests',
        url: '/track-requests',
      },
    ],
    icon: <TiPointOfInterest size={17} />,
  },
  {
    title: 'dashboard.sidebar.profile',
    key: 'profile',
    url: '/profile',
    icon: <FaRegUser size={17} />,
  },
];

const connectNavigation: SidebarNavigationItem[] = [
  {
    title: 'connectionRequests.dbRequestSidebar.main',
    key: 'requests/database',
    children: [
      {
        title: 'connectionRequests.dbRequestSidebar.sent',
        key: 'requests/database/sent',
        url: '/requests/database/sent',
      },
    ],
  },
  {
    title: 'connectionRequests.accessRequestSidebar.main',
    key: 'requests/user',
    children: [
      {
        title: 'connectionRequests.accessRequestSidebar.sent',
        key: 'requests/user/sent',
        url: '/requests/user/sent',
      },
      {
        title: 'connectionRequests.accessRequestSidebar.receive',
        key: 'requests/user/receive',
        url: '/requests/user/receive',
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

export function returnCurrentNav(key: string, admin: boolean): SidebarNavigationItem[] {
  if (key === 'connect' && !admin) {
    return connectNavigation;
  } else if (key === 'connect' && admin) {
    const receiveChild = {
      title: 'connectionRequests.dbRequestSidebar.receive',
      key: 'requests/database/receive',
      url: '/requests/database/receive',
    };
    const updatedNav = connectNavigation.map((item) => {
      if (item.key === 'requests/database') {
        return {
          ...item,
          children: item.children ? [...item.children, receiveChild] : [receiveChild],
        };
      }
      return item;
    });
    return updatedNav;
  } else if (key === 'home') {
    return homeNavigation;
  } else if (key === 'database') {
    return sourceNavigation;
  } else if (key === 'dataset') {
    return datasetNavigation;
  }
  return [];
}

export function updateUrlById(id: string, selectedKey: string, admin: boolean): void {
  let prefixUrl = '';
  const currentNav = returnCurrentNav(selectedKey, admin);
  if (selectedKey == 'database') {
    prefixUrl = '/database-sources/';
  } else if (selectedKey == 'dataset') {
    prefixUrl = '/datasets/';
  }
  currentNav.forEach((item: SidebarNavigationItem) => {
    item.url = prefixUrl + item.key + '/' + id;
  });
}
