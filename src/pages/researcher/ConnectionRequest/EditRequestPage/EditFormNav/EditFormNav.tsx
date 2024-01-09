import React from 'react';
import { ProjectInfo } from './nav/ProjectInfo/ProjectInfo';
import { DatabaseInfo } from './nav/DatabaseInfo/DatabaseInfo';
import { DataInfo } from './nav/DataInfo/DataInfo';
import { OrgAdminInfo } from './nav/OrgAdminInfo/OrgAdminInfo';
import { AdditionalInfo } from './nav/AdditionalInfo/AdditionalInfo';
import { RequestDetails } from '@app/interfaces/interfaces';

interface EditFormNavProps {
  menu: string;
  values: RequestDetails;
  setValues: (value: RequestDetails) => void;
}

export const EditFormNav: React.FC<EditFormNavProps> = ({ menu, values, setValues }) => {
  let currentMenu;

  switch (menu) {
    case 'project-info': {
      currentMenu = <ProjectInfo formValue={values} setFormValue={setValues} />;
      break;
    }

    case 'database-info': {
      currentMenu = <DatabaseInfo formValue={values} setFormValue={setValues} />;
      break;
    }

    case 'data-info': {
      currentMenu = <DataInfo formValue={values} setFormValue={setValues} />;
      break;
    }

    case 'org-admin-info': {
      currentMenu = <OrgAdminInfo formValue={values} setFormValue={setValues} />;
      break;
    }

    case 'add-info': {
      currentMenu = <AdditionalInfo formValue={values} setFormValue={setValues} />;
      break;
    }

    default: {
      currentMenu = null;
    }
  }

  return currentMenu;
};
