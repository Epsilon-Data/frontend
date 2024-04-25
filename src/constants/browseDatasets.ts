import { ProjectInfo } from '@app/api/browseDatasets.api';
import { t } from 'i18next';

export const DATE_FORMAT = 'dd/MM/yyyy';
export const BROWSE_DATASET_API_URL = '/hub/browse-dataset/';

export const INITIAL_DETAIL_VALUES: ProjectInfo = {
  name: '',
  duration: [],
  lead: '',
  members: [],
  university: '',
  faculty: '',
  ethicsId: '',
  description: '',
  dataDescription: '',
  collectionDuration: [],
  dataKeywords: [],
  dataParticipantsNum: 0,
  archetype: { id: '', name: '', nodes: [], edges: [] },
};

export const SEARCH_FIELDS = [
  { value: 'all', label: t('browse.topSearch.fields.all') },
  { value: 'name', label: t('browse.topSearch.fields.projectTitle') },
  { value: 'keywords', label: t('browse.topSearch.fields.keywords') },
  { value: 'organisation', label: t('browse.topSearch.fields.organisation') },
];
