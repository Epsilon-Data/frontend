import React from 'react';
import { PiCirclesThreeBold, PiEyeBold } from 'react-icons/pi';
import { TiPointOfInterest } from 'react-icons/ti';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { AiOutlineDatabase } from 'react-icons/ai';
import { LuSettings } from 'react-icons/lu';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
  dbReadyRequired?: boolean;
}

const homeNavigation: SidebarNavigationItem[] = [
  {
    title: 'dashboard.sidebar.projects',
    key: 'home',
    url: '/',
    icon: <PiCirclesThreeBold size={17} />,
  },
  {
    title: 'dashboard.sidebar.browserHub.title',
    key: 'browse-hub',
    children: [
      {
        title: 'dashboard.sidebar.browserHub.browseProjects',
        key: 'browse',
        url: '/browse',
      },
      {
        title: 'dashboard.sidebar.browserHub.trackRequests',
        key: 'track-requests',
        url: '/track-requests',
      },
    ],
    icon: <TiPointOfInterest size={17} />,
  },
  // {
  //   title: 'dashboard.sidebar.profile',
  //   key: 'profile',
  //   url: '/profile',
  //   icon: <FaRegUser size={17} />,
  // },
  {
    title: 'common.logout',
    key: 'logout',
    url: '/logout',
    icon: <RiLogoutCircleLine size={17} />,
  },
];

const projectNavigation: SidebarNavigationItem[] = [
  {
    title: 'project.sidebar.projectDb.title',
    key: 'project',
    icon: <AiOutlineDatabase size={17} />,
    children: [
      {
        title: 'project.sidebar.projectDb.dbMapping',
        key: 'project/db-mapping',
        url: '/project/db-mapping',
      },
      {
        title: 'project.sidebar.projectDb.metadata',
        key: 'project/metadata',
        url: '/project/metadata',
        dbReadyRequired: true,
      },
    ],
  },
  {
    title: 'project.sidebar.projectAccess',
    key: 'project-access',
    url: '/project/access',
    icon: <PiEyeBold size={17} />,
    dbReadyRequired: true,
  },
  // {
  //   title: 'project.sidebar.team',
  //   key: 'team',
  //   url: '/project/team',
  //   dbReadyRequired: true,
  // },
  {
    title: 'project.sidebar.settings',
    key: 'settings',
    url: '/project/settings',
    dbReadyRequired: true,
    icon: <LuSettings size={17} />,
  },
  {
    title: 'common.logout',
    key: 'logout',
    url: '/logout',
    icon: <RiLogoutCircleLine size={17} />,
  },
];

const sidebarNavigation: { [key: string]: SidebarNavigationItem[] } = {
  home: homeNavigation,
  project: projectNavigation,
};

export function returnCurrentNav(selectedNav: string): SidebarNavigationItem[] {
  return sidebarNavigation[selectedNav] || [];
}

export function findKeyByUrl(url: string): string {
  const section = url.split('/')[1];
  if (section in sidebarNavigation) {
    return section;
  }
  return 'home';
}
