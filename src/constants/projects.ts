import { AccessDetails } from '@app/interfaces/interfaces';

export const DATE_FORMAT = 'dd/MM/yyyy';
export const PROJECT_API_URL = '/hub/project';

export const INITIAL_DETAIL_VALUES = {
  name: '',
  lead: '',
  members: [],
  university: '',
  faculty: '',
  ethicsId: '',
  description: '',
};

export const INITIAL_ACCESS_VALUES: AccessDetails = {
  id: '',
  customId: '',
  name: '',
  accessPurpose: '',
  requestorName: '',
  email: '',
  orgName: '',
  position: '',
  projectName: '',
  projectDuration: [],
  projectBackground: '',
  projectObjective: '',
  projectHypotheses: '',
  projectOutcome: '',
  projectMembers: [],
  ethicsId: '',
  requestor: '',
};
