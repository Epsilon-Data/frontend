import { Input, Segmented, Space, Table, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { IoSearch } from 'react-icons/io5';
import { Node, Edge } from '@xyflow/react';
import { useMemo, useState } from 'react';
import { PermissionTableRow } from '@app/utils/reactflow/helpers';
import { usePermissionTable } from '@app/hooks/usePermissionTable';
import { RxQuestionMarkCircled } from 'react-icons/rx';
import { getColors } from '@app/constants/reactflow/reactflowOptions';
import { CheckedByCol } from '@app/hooks/usePermissionTable';
import { ToggleRadio } from '@app/components/common/Modal/ToggleRadio/ToggleRadio';

type SetPermissionsStepProps = {
  nodes: Node[];
  edges: Edge[];
  checkedByCol: CheckedByCol;
  setCheckedByCol: React.Dispatch<React.SetStateAction<CheckedByCol>>;
};

type Mode = 'apply' | 'override';

export const SetPermissionsStep = ({ nodes, edges, checkedByCol, setCheckedByCol }: SetPermissionsStepProps) => {
  const { t } = useTranslation();

  const {
    rows,
    topKeys,
    modeByTop,
    setMode,
    hasAnyCategoryDescendants,
    isEnabled,
    getChecked,
    onParentToggle,
    onLeafToggle,
  } = usePermissionTable(nodes, edges, checkedByCol, setCheckedByCol);
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

  const renderRadio = (col: 'high' | 'detail') => (_: unknown, row: PermissionTableRow) => {
    const enabled = isEnabled(row);
    const checked = getChecked(col, row);
    const onChange = (next: boolean) =>
      row.kind === 'category' ? onParentToggle(col, row, next) : onLeafToggle(col, row, next);
    return <ToggleRadio checked={checked} disabled={!enabled} onChange={onChange} />;
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
      render: (_: unknown, row: PermissionTableRow) => {
        if (!topKeys.includes(row.key)) return null;
        if (!hasAnyCategoryDescendants(row.key)) return null;

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
              className="
                [&_.ant-segmented-thumb]:!bg-black
                [&_.ant-segmented-item-selected]:!bg-black
                [&_.ant-segmented-item-selected]:!text-white
              "
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
      </div>
    </div>
  );
};
