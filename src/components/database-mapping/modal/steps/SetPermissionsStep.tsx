import { Input, Segmented, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { IoSearch } from 'react-icons/io5';
import { Node, Edge } from '@xyflow/react';
import { useMemo, useState } from 'react';
import { TableRow } from '@app/constants/reactflow/helpers';
import { ToggleRadio } from '@app/components/common/Modal/ToggleRadio/ToggleRadio';
import { usePermissionTable } from '@app/hooks/usePermissionTable';

type SetPermissionsStepProps = {
  nodes: Node[];
  edges: Edge[];
};

type Mode = 'apply' | 'override';

export const SetPermissionsStep = ({ nodes, edges }: SetPermissionsStepProps) => {
  const { t } = useTranslation();

  const { rows, topKeys, modeByTop, setMode, isEnabled, getChecked, onParentToggle, onLeafToggle } = usePermissionTable(
    nodes,
    edges,
  );

  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    if (!q) return rows;
    const term = q.toLowerCase();
    const filterTree = (rs: TableRow[]): TableRow[] =>
      rs
        .map((r) => {
          const kids = r.children ? filterTree(r.children) : [];
          const match = r.label.toLowerCase().includes(term);
          return match || kids.length ? { ...r, children: kids.length ? kids : undefined } : null;
        })
        .filter(Boolean) as TableRow[];
    return filterTree(rows);
  }, [q, rows]);

  const renderRadio = (col: 'high' | 'detail') => (_: unknown, row: TableRow) => {
    const enabled = isEnabled(row);
    const checked = getChecked(col, row);
    const onChange = (next: boolean) =>
      row.kind === 'category' ? onParentToggle(col, row, next) : onLeafToggle(col, row, next);
    return <ToggleRadio checked={checked} disabled={!enabled} onChange={onChange} />;
  };

  const columns = [
    {
      title: t('project.createTemplate.form.step4.table.header.parent', {
        name: nodes.find((n) => n.type === 'root')?.data.label ?? '',
      }),
      dataIndex: 'label',
      key: 'label',
      render: (text: string) => (
        <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis" title={text}>
          {text}
        </span>
      ),
    },
    {
      title: t('project.createTemplate.form.step4.table.header.analysis.high'),
      key: 'high',
      width: 150,
      align: 'center' as const,
      render: renderRadio('high'),
    },
    {
      title: t('project.createTemplate.form.step4.table.header.analysis.detail'),
      key: 'detail',
      width: 150,
      align: 'center' as const,
      render: renderRadio('detail'),
    },
    {
      title: (
        <Space.Compact className="rounded-lg">
          <Input
            className="px-2 py-1 text-xs font-inter h-8"
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
      render: (_: unknown, row: TableRow) => {
        if (!topKeys.includes(row.key)) return null;
        const mode = modeByTop[row.key] ?? 'apply';
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Segmented
              size="small"
              options={[
                { label: 'Apply all', value: 'apply' },
                { label: 'Override', value: 'override' },
              ]}
              value={mode}
              onChange={(v) => setMode(row.key, v as Mode)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-[33rem] p-10 overflow-y-auto flex flex-col justify-start">
      <div className="mb-8">
        <div className="font-medium font-sans text-grey-1 text-lg">
          {t('project.createTemplate.form.step4.instruction.title')}
        </div>
        <div className="font-medium font-inter text-red-800 text-sm">
          {t('project.createTemplate.form.step4.instruction.subtitle')}
        </div>
      </div>
      <div>
        <Table<TableRow>
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
        />
      </div>
    </div>
  );
};
