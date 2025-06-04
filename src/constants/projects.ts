import { AccessDetails } from '@app/interfaces/interfaces';

export const PROJECT_API_URL = '/hub/project';

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

export const DB_TYPE_LABELS: Record<string, string> = {
  postgres: 'dbTypeLabels.relational',
  mysql: 'dbTypeLabels.relational',
  mongodb: 'dbTypeLabels.document',
  neo4j: 'dbTypeLabels.graph',
  csv: 'dbTypeLabels.flatFile',
};
