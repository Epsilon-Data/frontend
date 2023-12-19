import React from 'react';
import { ProjectInfo } from './nav/ProjectInfo/ProjectInfo';
import { DatabaseInfo } from './nav/DatabaseInfo/DatabaseInfo';
import { DataInfo } from './nav/DataInfo/DataInfo';
import { OrgAdminInfo } from './nav/OrgAdminInfo/OrgAdminInfo';

interface ProfileFormNavProps {
  menu: string;
}

export const ProfileFormNav: React.FC<ProfileFormNavProps> = ({ menu }) => {
  let currentMenu;

  switch (menu) {
    case 'project': {
      currentMenu = <ProjectInfo />;
      break;
    }

    case 'database': {
      currentMenu = <DatabaseInfo />;
      break;
    }

    case 'data': {
      currentMenu = <DataInfo />;
      break;
    }

    case 'orgAdmin': {
      currentMenu = <OrgAdminInfo />;
      break;
    }

    default: {
      currentMenu = null;
    }
  }

  return currentMenu;
};
