import { Input, Segmented, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { IoSearch } from 'react-icons/io5';
import { Node, Edge } from '@xyflow/react';
import { useCallback, useMemo, useState } from 'react';
import { graphToTableRows, TableRow } from '@app/constants/reactflow/helpers';
import { ToggleRadio } from '@app/components/common/Modal/ToggleRadio/ToggleRadio';

type SetPermissionsStepProps = {
  nodes: Node[];
  edges: Edge[];
};

type Mode = 'apply' | 'override';

const RADIO_W = 160;
const TOGGLE_W = 200;

export const SetPermissionsStep = ({ nodes, edges }: SetPermissionsStepProps) => {
  const { t } = useTranslation();
  const rows = useMemo(() => graphToTableRows(nodes, edges), [nodes, edges]);

  const { byId, childrenById, topKeys } = useMemo(() => {
    const byId = new Map<string, TableRow>();
    const childrenById = new Map<string, string[]>();
    const topKeys: string[] = rows.map((r) => r.key);

    const walk = (r: TableRow) => {
      byId.set(r.key, r);
      if (r.children?.length) {
        childrenById.set(
          r.key,
          r.children.map((c) => c.key),
        );
        r.children.forEach(walk);
      }
    };
    rows.forEach(walk);
    return { byId, childrenById, topKeys };
  }, [rows]);

  const [modeByTop, setModeByTop] = useState<Record<string, Mode>>({});
  const [parentChecked, setParentChecked] = useState<Record<string, boolean>>({});
  const [leafChecked, setLeafChecked] = useState<Record<string, boolean>>({});

  const setMode = useCallback((topId: string, m: Mode) => {
    setModeByTop((prev) => ({ ...prev, [topId]: m }));
  }, []);

  const findDescendantLeaf = useCallback(
    (catId: string) => {
      const q = [catId];
      const out: string[] = [];
      while (q.length) {
        const cur = q.pop()!;
        const kids = childrenById.get(cur) ?? [];
        for (const k of kids) {
          const n = byId.get(k)!;
          if (n.kind === 'leaf') out.push(n.key);
          if (n.kind === 'leaf' || n.kind === 'category') q.push(n.key);
        }
      }
      return out;
    },
    [byId, childrenById],
  );

  const isEnabled = (row: TableRow) => {
    const topId = row.topCategoryId ?? row.key;
    const mode = modeByTop[topId] ?? 'apply';
    const isTop = topKeys.includes(row.key);

    if (mode === 'apply') {
      return isTop;
    } else {
      return row.kind === 'leaf' && !isTop;
    }
  };

  const onHighRadio = (row: TableRow, next: boolean) => {
    const topId = row.topCategoryId ?? row.key;
    setMode(topId, 'apply');
    setParentChecked((prev) => ({ ...prev, [row.key]: next }));
    const leaves = findDescendantLeaf(row.key);
    if (leaves.length) {
      setLeafChecked((prev) => {
        const copy = { ...prev };
        for (const id of leaves) copy[id] = next;
        return copy;
      });
    }
  };

  const onDetailRadio = (row: TableRow, next: boolean) => {
    const topId = byId.get(row.key)!.topCategoryId ?? row.key;
    setMode(topId, 'override');
    setLeafChecked((prev) => ({ ...prev, [row.key]: next }));
  };

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
      title: t('project.createTemplate.form.step4.table.header.analysis.highLevel'),
      key: 'high',
      width: RADIO_W,
      align: 'center' as const,
      render: (_: unknown, row: TableRow) => (
        <ToggleRadio
          checked={!!parentChecked[row.key]}
          disabled={!isEnabled(row)}
          onChange={(next) => onHighRadio(row, next)}
        />
      ),
    },
    {
      title: t('project.createTemplate.form.step4.table.header.analysis.detail'),
      key: 'detail',
      width: RADIO_W,
      align: 'center' as const,
      render: (_: unknown, row: TableRow) => (
        <ToggleRadio
          checked={!!leafChecked[row.key]}
          disabled={!isEnabled(row)}
          onChange={(next) => onDetailRadio(row, next)}
        />
      ),
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
      width: TOGGLE_W,
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
    <div className="h-[33rem] py-12 px-10 overflow-y-auto flex flex-col justify-start">
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
          bordered
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
