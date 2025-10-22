// hooks/usePermissionMatrix.ts
import { useMemo, useState, useCallback } from 'react';
import type { TableRow } from '@app/constants/reactflow/helpers';
import { buildPermissionTree } from '@app/constants/reactflow/helpers';
import { Node, Edge } from '@xyflow/react';

export type Mode = 'apply' | 'override';

type ColKey = 'high' | 'detail';

type Checked = {
  parent: Record<string, boolean>;
  leaf: Record<string, boolean>;
};

export type CheckedByCol = Record<ColKey, Checked>;

export function usePermissionTable(
  nodes: Node[],
  edges: Edge[],
  checkedByCol: CheckedByCol,
  setCheckedByCol: React.Dispatch<React.SetStateAction<CheckedByCol>>,
) {
  const { rows, byId, childrenById, parentById, topKeys, findDescendants, ancestorsUpToTop, allDescLeafsChecked } =
    useMemo(() => buildPermissionTree(nodes, edges), [nodes, edges]);

  const [modeByTop, setModeByTop] = useState<Record<string, Mode>>({});

  const isEnabled = useCallback(
    (row: TableRow) => {
      const topId = row.topCategoryId ?? row.key;
      const mode = modeByTop[topId] ?? 'apply';
      if (mode === 'apply') return row.kind === 'category';
      return row.kind === 'leaf';
    },
    [modeByTop],
  );

  const setMode = useCallback((topId: string, m: Mode) => {
    setModeByTop((prev) => ({ ...prev, [topId]: m }));
  }, []);

  const setParentChecked = useCallback(
    (col: ColKey, updates: Record<string, boolean>) => {
      setCheckedByCol((prev) => ({
        ...prev,
        [col]: { ...prev[col], parent: { ...prev[col].parent, ...updates } },
      }));
    },
    [setCheckedByCol],
  );

  const setLeafChecked = useCallback(
    (col: ColKey, updates: Record<string, boolean>) => {
      setCheckedByCol((prev) => ({
        ...prev,
        [col]: { ...prev[col], leaf: { ...prev[col].leaf, ...updates } },
      }));
    },
    [setCheckedByCol],
  );

  const onParentToggle = useCallback(
    (col: ColKey, row: TableRow, next: boolean) => {
      const topId = row.topCategoryId ?? row.key;
      setMode(topId, 'apply');

      setParentChecked(col, { [row.key]: next });

      const { cats, leafs } = findDescendants(row.key);
      if (cats.length) {
        const x: Record<string, boolean> = {};
        for (const id of cats) x[id] = next;
        setParentChecked(col, x);
      }
      if (leafs.length) {
        const y: Record<string, boolean> = {};
        for (const id of leafs) y[id] = next;
        setLeafChecked(col, y);
      }
    },
    [findDescendants, setMode, setParentChecked, setLeafChecked],
  );

  const onLeafToggle = useCallback(
    (col: ColKey, row: TableRow, next: boolean) => {
      const topId = row.topCategoryId ?? row.key;
      setMode(topId, 'override');

      setLeafChecked(col, { [row.key]: next });

      setCheckedByCol((prev) => {
        const copy = { ...prev };
        const colState = copy[col];
        const toRecompute = ancestorsUpToTop(row.key);
        for (const catId of toRecompute) {
          colState.parent[catId] = allDescLeafsChecked(catId, { ...colState.leaf, [row.key]: next });
        }
        return copy;
      });
    },
    [setMode, setLeafChecked, setCheckedByCol, ancestorsUpToTop, allDescLeafsChecked],
  );

  return {
    rows,
    topKeys,
    byId,
    childrenById,
    parentById,
    modeByTop,
    setMode,
    isEnabled,
    getChecked: (col: ColKey, row: TableRow) =>
      row.kind === 'category' ? !!checkedByCol[col].parent[row.key] : !!checkedByCol[col].leaf[row.key],
    onParentToggle,
    onLeafToggle,
  };
}
