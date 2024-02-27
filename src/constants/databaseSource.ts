import { DatabaseTableInfo } from '@app/api/databaseSources.api';
import { OverallDatabaseInfoValues } from '@app/interfaces/interfaces';

export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATABASE_SOURCE_API_URL = '/hub/database-source/';

export const INITIAL_OVERALL_DB_INFO: OverallDatabaseInfoValues = {
  schemaCount: 0,
  totalTableCount: 0,
  totalColCount: 0,
};

export const INITIAL_TABLE_INFO: DatabaseTableInfo = {
  name: '',
  colCount: 0,
  schema: '',
  columns: [],
};
