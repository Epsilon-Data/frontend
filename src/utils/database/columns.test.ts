import { describe, expect, it } from 'vitest';
import { databaseColumnsFromSources, flattenTableColumns } from './columns';
import { ColumnInfo, DatabaseTableInfo } from '@app/api/database.api';

describe('database column helpers', () => {
  const tables: DatabaseTableInfo[] = [
    {
      schema: 'public',
      name: 'users',
      colCount: 2,
      columns: [
        { name: 'id', type: 'uuid', nullable: false, primary: true },
        { name: 'email', type: 'text', nullable: false, primary: false },
      ],
    },
  ];

  it('flattens table metadata into picker columns', () => {
    expect(flattenTableColumns(tables)).toEqual([
      { id: 'public.users.id', name: 'id', table: 'public.users' },
      { id: 'public.users.email', name: 'email', table: 'public.users' },
    ]);
  });

  it('prefers nested table columns over the standalone column endpoint', () => {
    const fallbackColumns: ColumnInfo[] = [{ id: 'legacy-id', name: 'legacy', table: 'legacy_table' }];

    expect(databaseColumnsFromSources(tables, fallbackColumns)).toEqual([
      { id: 'public.users.id', name: 'id', table: 'public.users' },
      { id: 'public.users.email', name: 'email', table: 'public.users' },
    ]);
  });

  it('uses standalone columns when table metadata has no columns', () => {
    const fallbackColumns: ColumnInfo[] = [{ id: 'legacy-id', name: 'legacy', table: 'legacy_table' }];

    expect(databaseColumnsFromSources([], fallbackColumns)).toEqual(fallbackColumns);
  });
});
