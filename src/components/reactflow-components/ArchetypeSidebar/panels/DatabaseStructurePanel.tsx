import { useArchetypeModalContext } from '@app/hooks/useArchetypeModalContext';
import { Badge, Collapse, Input, Skeleton, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuDatabase, LuSearch } from 'react-icons/lu';

export const DatabaseStructurePanel: React.FC = () => {
  const { tables, tablesLoading } = useArchetypeModalContext();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const uniqueTables = useMemo(() => {
    const seen = new Set<string>();
    return tables.filter((table) => {
      const key = `${table.schema}.${table.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [tables]);

  const filteredTables = useMemo(() => {
    if (!search.trim()) return uniqueTables;
    const query = search.toLowerCase();
    return uniqueTables.filter(
      (table) =>
        table.name.toLowerCase().includes(query) ||
        table.columns.some((col) => col.name.toLowerCase().includes(query)),
    );
  }, [uniqueTables, search]);

  const collapseItems = useMemo(
    () =>
      filteredTables.map((table) => ({
        key: `${table.schema}.${table.name}`,
        label: (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-medium truncate">{table.name}</span>
            <Badge count={table.colCount} showZero color="#6366f1" size="small" className="ml-1" />
          </div>
        ),
        children: (
          <div className="flex flex-col gap-0.5">
            <Typography.Text type="secondary" className="text-[10px] mb-1">
              {table.schema}
            </Typography.Text>
            {table.columns.map((col) => (
              <div key={col.name} className="flex items-center justify-between py-0.5 px-1 rounded hover:bg-gray-50">
                <span className="text-[11px] truncate">{col.name}</span>
                <span className="text-[10px] text-gray-400 ml-1 shrink-0">{col.type}</span>
              </div>
            ))}
          </div>
        ),
      })),
    [filteredTables],
  );

  return (
    <div
      className={[
        'flex flex-col bg-white rounded-lg w-80 shadow-xl',
        'transition-all duration-500 ease-in-out will-change-transform origin-left',
        'mb-4 border border-[#ddd] p-3 translate-x-0 opacity-100',
      ].join(' ')}
    >
      <div className="flex items-center gap-1.5 text-sm text-start mb-2">
        <LuDatabase className="text-gray-500" size={14} />
        {t('archetype.databaseStructure')}
      </div>

      <Input
        size="small"
        placeholder={t('archetype.searchTables')}
        prefix={<LuSearch className="text-gray-400" size={12} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        className="mb-2"
      />

      {tablesLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} title={false} />
      ) : filteredTables.length === 0 ? (
        <Typography.Text type="secondary" className="text-xs text-center py-2">
          {t('archetype.noTablesFound')}
        </Typography.Text>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          <Collapse
            size="small"
            ghost
            items={collapseItems}
            className="[&_.ant-collapse-header]:!py-1 [&_.ant-collapse-header]:!px-1 [&_.ant-collapse-content-box]:!p-1"
          />
        </div>
      )}
    </div>
  );
};
