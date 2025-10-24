import { DatabaseTableInfo } from '@app/api/database.api';
import { OverallDatabaseInfoValues } from '@app/interfaces/interfaces';

export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATABASE_API_URL = '/hub/database';

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
