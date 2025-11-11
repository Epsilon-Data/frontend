// hooks/usePermissionMatrix.ts
import { useMemo, useState, useCallback } from 'react';
import type { PermissionTableRow } from '@app/utils/reactflow/helpers';
import { buildPermissionTree } from '@app/utils/reactflow/helpers';
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
  const otherCol = (col: ColKey): ColKey => (col === 'high' ? 'detail' : 'high');

  const clearOpposite = useCallback(
    (col: ColKey, bucket: 'parent' | 'leaf', updates: Record<string, boolean>) => {
      const o = otherCol(col);
      const off: Record<string, boolean> = {};
      for (const k of Object.keys(updates)) off[k] = false;

      setCheckedByCol((prev) => ({
        ...prev,
        [o]: {
          ...prev[o],
          [bucket]: {
            ...prev[o][bucket],
            ...off,
          },
        },
      }));
    },
    [setCheckedByCol],
  );

  const hasAnyCategoryDescendants = useCallback(
    (id: string) => {
      const q = [...(childrenById.get(id) ?? [])];
      while (q.length) {
        q.pop()!;
        return true;
      }
      return false;
    },
    [childrenById],
  );

  const isEnabled = useCallback(
    (row: PermissionTableRow) => {
      const topId = row.topCategoryId ?? row.key;
      const mode = modeByTop[topId] ?? 'apply';

      const isTop = topKeys.includes(row.key);
      if (isTop && !hasAnyCategoryDescendants(row.key)) return true;

      if (mode === 'apply') return row.kind === 'category';
      return row.kind === 'leaf';
    },
    [hasAnyCategoryDescendants, modeByTop, topKeys],
  );

  const setMode = useCallback(
    (topId: string, m: Mode) => {
      setModeByTop((prev) => ({ ...prev, [topId]: m }));
      if (m === 'override') {
        const { cats } = findDescendants(topId);
        const targets = [topId, ...cats];
        const off: Record<string, boolean> = {};
        for (const id of targets) off[id] = false;

        setCheckedByCol((prev) => ({
          ...prev,
          high: {
            ...prev.high,
            parent: { ...prev.high.parent, ...off },
          },
          detail: {
            ...prev.detail,
            parent: { ...prev.detail.parent, ...off },
          },
        }));
      }
    },
    [findDescendants, setCheckedByCol],
  );

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
    (col: ColKey, row: PermissionTableRow, next: boolean) => {
      const topId = row.topCategoryId ?? row.key;
      setMode(topId, 'apply');

      setParentChecked(col, { [row.key]: next });

      const { cats, leafs } = findDescendants(row.key);
      if (cats.length) {
        const x: Record<string, boolean> = {};
        for (const id of cats) x[id] = next;
        setParentChecked(col, x);
        if (next) clearOpposite(col, 'parent', { [row.key]: true, ...x });
      } else {
        if (next) clearOpposite(col, 'parent', { [row.key]: true });
      }
      if (leafs.length) {
        const y: Record<string, boolean> = {};
        for (const id of leafs) y[id] = next;
        setLeafChecked(col, y);
        if (next) clearOpposite(col, 'leaf', y);
      }
    },
    [setMode, setParentChecked, findDescendants, clearOpposite, setLeafChecked],
  );

  const onLeafToggle = useCallback(
    (col: ColKey, row: PermissionTableRow, next: boolean) => {
      const topId = row.topCategoryId ?? row.key;
      setMode(topId, 'override');

      setLeafChecked(col, { [row.key]: next });

      if (next) clearOpposite(col, 'leaf', { [row.key]: true });

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
    [setMode, setLeafChecked, clearOpposite, setCheckedByCol, ancestorsUpToTop, allDescLeafsChecked],
  );

  return {
    rows,
    topKeys,
    byId,
    childrenById,
    parentById,
    modeByTop,
    setMode,
    hasAnyCategoryDescendants,
    isEnabled,
    getChecked: (col: ColKey, row: PermissionTableRow) =>
      row.kind === 'category' ? !!checkedByCol[col].parent[row.key] : !!checkedByCol[col].leaf[row.key],
    onParentToggle,
    onLeafToggle,
  };
}
