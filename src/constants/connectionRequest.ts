import { RequestDetails } from '@app/interfaces/interfaces';

export const DATE_FORMAT = 'dd/MM/yyyy';

export const INITIAL_REQUEST_VALUES: RequestDetails = {
  projectInfo: {
    name: '',
    duration: [],
    lead: '',
    members: [],
    university: '',
    faculty: '',
    ethicsId: '',
    description: '',
    isOwnData: null,
  },
  dataInfo: {
    collectionDuration: [],
    participantsNumber: null,
    description: '',
    keywords: [],
  },
};
