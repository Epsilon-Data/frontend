import { ColumnInfo, DatabaseTableInfo } from '@app/api/database.api';

export const getColumnKey = (column: Pick<ColumnInfo, 'name' | 'table'>) =>
  `${column.table.trim().toLowerCase()}.${column.name.trim().toLowerCase()}`;

export const tableColumnId = (schema: string, table: string, column: string) => `${schema}.${table}.${column}`;

export const flattenTableColumns = (tables: DatabaseTableInfo[]): ColumnInfo[] =>
  tables.flatMap((table) =>
    table.columns.map((column) => ({
      id: tableColumnId(table.schema, table.name, column.name),
      name: column.name,
      table: `${table.schema}.${table.name}`,
    })),
  );

export const databaseColumnsFromSources = (tables: DatabaseTableInfo[], columns: ColumnInfo[]): ColumnInfo[] => {
  // Prioritize columns endpoint data (has actual column GUIDs from Atlas)
  // Fall back to flattening tables only if columns endpoint returns no data
  return columns.length > 0 ? columns : flattenTableColumns(tables);
};
