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
  const tableColumns = flattenTableColumns(tables);
  return tableColumns.length > 0 ? tableColumns : columns;
};
