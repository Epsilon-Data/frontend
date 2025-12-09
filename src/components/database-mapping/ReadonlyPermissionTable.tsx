// components/ReadOnlyPermissionsTable.tsx
import { Input, Radio, Space, Table, Tooltip } from 'antd';
import { useMemo, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import type { Node, Edge } from '@xyflow/react';

import { graphToTableRows, permissionsToCheckedByCol, type PermissionTableRow } from '@app/utils/reactflow/helpers';
import { type Permission } from '@app/api/archetypes.api';
import { getColors } from '@app/constants/reactflow/reactflowOptions';
import { RxQuestionMarkCircled } from 'react-icons/rx';
import { useTranslation } from 'react-i18next';

type Props = {
  nodes: Node[];
  edges: Edge[];
  permissions: Permission[];
};

export function ReadOnlyPermissionsTable({ nodes, edges, permissions }: Props) {
  const { t } = useTranslation();
  const rows = useMemo(() => graphToTableRows(nodes, edges), [nodes, edges]);
  const checkedByCol = useMemo(
    () => permissionsToCheckedByCol(permissions, nodes, edges).checkedByCol,
    [permissions, nodes, edges],
  );

  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    if (!q) return rows;
    const term = q.toLowerCase();
    const filterTree = (rs: PermissionTableRow[]): PermissionTableRow[] =>
      rs
        .map((r) => {
          const kids = r.children ? filterTree(r.children) : [];
          const match = r.label.toLowerCase().includes(term);
          return match || kids.length ? { ...r, children: kids.length ? kids : undefined } : null;
        })
        .filter(Boolean) as PermissionTableRow[];
    return filterTree(rows);
  }, [q, rows]);

  const renderRadio = (col: 'high' | 'detail') => {
    const RadioRenderer = (_: unknown, row: PermissionTableRow) => {
      const checked = row.kind === 'category' ? !!checkedByCol[col].parent[row.key] : !!checkedByCol[col].leaf[row.key];
      return <Radio checked={checked} />;
    };
    RadioRenderer.displayName = `RadioRenderer(${col})`;
    return RadioRenderer;
  };

  const columns = [
    {
      title: (
        <span className="font-light">
          {t('project.createTemplate.form.step4.table.header.parent', {
            name: nodes.find((n) => n.type === 'root')?.data.label ?? '',
          })}
        </span>
      ),
      dataIndex: 'label',
      key: 'label',
      align: 'left' as const,
      render: (text: string) => (
        <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis" title={text}>
          {text}
        </span>
      ),
    },
    {
      title: (
        <div className="flex flex-row font-light items-center">
          <span>{t('project.createTemplate.form.step4.table.header.analysis.high.title')}</span>
          <Tooltip title={t('project.createTemplate.form.step4.table.header.analysis.high.tooltip')} placement="bottom">
            <RxQuestionMarkCircled size={18} className="ml-2" />
          </Tooltip>
        </div>
      ),
      key: 'high',
      align: 'center' as const,
      render: renderRadio('high'),
    },
    {
      title: (
        <div className="flex flex-row font-light items-center">
          <span>{t('project.createTemplate.form.step4.table.header.analysis.detail.title')}</span>
          <Tooltip
            title={t('project.createTemplate.form.step4.table.header.analysis.detail.tooltip')}
            placement="bottom"
          >
            <RxQuestionMarkCircled size={18} className="ml-2" />
          </Tooltip>
        </div>
      ),
      key: 'detail',
      align: 'center' as const,
      render: renderRadio('detail'),
    },
    {
      title: (
        <Space.Compact className="rounded-lg">
          <Input
            className="px-2 py-1 text-xs font-inter h-8 font-light"
            prefix={<IoSearch className="text-grey-1 mr-2" />}
            placeholder={t('project.createTemplate.form.step4.table.header.searchPlaceholder')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </Space.Compact>
      ),
      key: 'mode',
      width: 200,
      align: 'right' as const,
    },
  ];

  return (
    <Table<PermissionTableRow>
      size="small"
      rowKey="key"
      columns={columns}
      dataSource={filtered}
      pagination={false}
      tableLayout="fixed"
      expandable={{
        expandRowByClick: true,
        defaultExpandAllRows: true,
        indentSize: 16,
      }}
      onRow={(row) => {
        if (row.kind === 'category' && row.children?.length) {
          const { levelColor, textColor } = getColors(row.level ?? 0);
          return {
            style: {
              ['--row-bg' as string]: levelColor,
              ['--row-fg' as string]: textColor,
            },
          };
        }
        return {};
      }}
      rowClassName={(row) =>
        row.kind === 'category' && row.children?.length
          ? [
              '[&_.ant-table-cell]:bg-[var(--row-bg)]',
              '[&_.ant-table-cell]:text-[var(--row-fg)]',
              'hover:[&_.ant-table-cell]:bg-[var(--row-bg)]',
              'hover:[&_.ant-table-cell]:text-[var(--row-fg)]',
              '[&_.ant-table-cell:first-child]:rounded-l-lg',
              '[&_.ant-table-cell:last-child]:rounded-r-lg',
              '[&_.ant-table-cell]:overflow-hidden',
              '[&_.ant-table-cell]:border-0',
              'mb-1',
              'transition-colors',
              'duration-200',
            ].join(' ')
          : ''
      }
      className="
            [&_.ant-table-tbody_tr:hover_td]:!bg-[var(--row-bg)]
            [&_.ant-table-tbody_tr:hover_.ant-table-cell]:!bg-[var(--row-bg)]
            [&_.ant-table-tbody_tr:hover_.ant-table-cell]:!text-[var(--row-fg)]
          "
    />
  );
}
