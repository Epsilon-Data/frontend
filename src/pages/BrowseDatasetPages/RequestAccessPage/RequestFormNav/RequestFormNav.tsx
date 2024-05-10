import React from 'react';
import { RequestDataset } from './nav/RequestDataset/RequestDataset';
import { RequestorDetails } from './nav/RequestorDetails/RequestorDetails';
import { ProjectDetails } from './nav/ProjectDetails/ProjectDetails';
import { Ethics } from './nav/Ethics/Ethics';
import { AccessDetails } from '@app/interfaces/interfaces';

interface RequestFormNavProps {
  menu: string;
  values: AccessDetails;
  setValues: (value: AccessDetails) => void;
}

export const RequestFormNav: React.FC<RequestFormNavProps> = ({ menu, values, setValues }) => {
  let currentMenu;

  switch (menu) {
    case 'dataset': {
      currentMenu = <RequestDataset formValue={values} setFormValue={setValues} />;
      break;
    }

    case 'requestor': {
      currentMenu = <RequestorDetails formValue={values} setFormValue={setValues} />;
      break;
    }

    case 'project': {
      currentMenu = <ProjectDetails formValue={values} setFormValue={setValues} />;
      break;
    }

    case 'ethics': {
      currentMenu = <Ethics formValue={values} setFormValue={setValues} />;
      break;
    }

    default: {
      currentMenu = null;
    }
  }

  return currentMenu;
};
