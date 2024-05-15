import { AccessDetails } from '@app/interfaces/interfaces';

export const DATE_FORMAT = 'dd/MM/yyyy';
export const USER_REQUEST_API_URL = '/hub/user-request/';

export const INITIAL_REQUEST_VALUES: AccessDetails = {
  id: '',
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
  status: 0,
  createdDate: new Date(),
};
