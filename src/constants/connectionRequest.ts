import { RequestDetails } from '@app/interfaces/interfaces';
import { t } from 'i18next';

export const DATE_FORMAT = 'dd/MM/yyyy';
export const CONNECTION_REQUEST_API_URL = '/hub/connection-request/';

export const INITIAL_REQUEST_VALUES: RequestDetails = {
  projectInfo: {
    customId: '',
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

export const DATABASE_TYPES = [
  {
    value: 'postgres',
    label: t('connectionRequests.details.databaseInfo.postgres'),
  },
  {
    value: 'mysql',
    label: t('connectionRequests.details.databaseInfo.mysql'),
  },
  {
    value: 'mongo',
    label: t('connectionRequests.details.databaseInfo.mongo'),
  },
];
