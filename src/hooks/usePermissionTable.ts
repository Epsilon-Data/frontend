import { useMemo, useCallback } from 'react';
import type { PermissionTableRow } from '@app/utils/reactflow/helpers';
import { buildPermissionTree } from '@app/utils/reactflow/helpers';
import { Node, Edge } from '@xyflow/react';

type AnalysisColKey = 'high' | 'detail';
type ColKey = AnalysisColKey | 'none';
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
  const { rows, byId, childrenById, parentById, topKeys, findDescendants } = useMemo(
    () => buildPermissionTree(nodes, edges),
    [nodes, edges],
  );

  const otherCol = (col: AnalysisColKey): AnalysisColKey => (col === 'high' ? 'detail' : 'high');

  const clearOpposite = useCallback(
    (col: AnalysisColKey, bucket: 'parent' | 'leaf', updates: Record<string, boolean>) => {
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

  const setNoneFor = useCallback(
    (row: PermissionTableRow, next: boolean) => {
      const bucket = row.kind === 'category' ? 'parent' : 'leaf';

      setCheckedByCol((prev) => {
        const nextBucket = { ...prev.none[bucket] };
        if (next) nextBucket[row.key] = true;
        else delete nextBucket[row.key];

        return {
          ...prev,
          none: {
            ...prev.none,
            [bucket]: nextBucket,
          },
        };
      });
    },
    [setCheckedByCol],
  );

  const setNoneForMany = useCallback(
    (ids: string[], bucket: 'parent' | 'leaf', next: boolean) => {
      if (!ids.length) return;

      setCheckedByCol((prev) => {
        const nextBucket = { ...prev.none[bucket] };
        for (const id of ids) {
          if (next) nextBucket[id] = true;
          else delete nextBucket[id];
        }
        return {
          ...prev,
          none: {
            ...prev.none,
            [bucket]: nextBucket,
          },
        };
      });
    },
    [setCheckedByCol],
  );

  const onParentToggle = useCallback(
    (col: AnalysisColKey, row: PermissionTableRow, next: boolean) => {
      setParentChecked(col, { [row.key]: next });

      const { cats, leafs } = findDescendants(row.key);

      const parentIds = [row.key, ...cats];
      const leafIds = leafs;

      if (parentIds.length > 0) {
        const parentUpdates: Record<string, boolean> = {};
        for (const id of parentIds) parentUpdates[id] = next;
        setParentChecked(col, parentUpdates);
      }

      if (leafIds.length > 0) {
        const leafUpdates: Record<string, boolean> = {};
        for (const id of leafIds) leafUpdates[id] = next;
        setLeafChecked(col, leafUpdates);
      }

      if (next) {
        const parentMap: Record<string, boolean> = {};
        for (const id of parentIds) parentMap[id] = true;
        clearOpposite(col, 'parent', parentMap);

        const leafMap: Record<string, boolean> = {};
        for (const id of leafIds) leafMap[id] = true;
        if (leafIds.length) clearOpposite(col, 'leaf', leafMap);

        setNoneFor(row, false);
        setNoneForMany(cats, 'parent', false);
        setNoneForMany(leafIds, 'leaf', false);
      } else {
        setNoneFor(row, true);
        setNoneForMany(cats, 'parent', true);
        setNoneForMany(leafIds, 'leaf', true);
      }
    },
    [findDescendants, setParentChecked, setLeafChecked, clearOpposite, setNoneFor, setNoneForMany],
  );

  const onLeafToggle = useCallback(
    (col: AnalysisColKey, row: PermissionTableRow, next: boolean) => {
      setLeafChecked(col, { [row.key]: next });

      if (next) {
        clearOpposite(col, 'leaf', { [row.key]: true });
        setNoneFor(row, false);
      } else {
        const other = otherCol(col);
        const stillOther = !!checkedByCol[other].leaf[row.key] || !!checkedByCol[other].parent[row.key];

        if (!stillOther) {
          setNoneFor(row, true);
        }
      }
    },
    [setLeafChecked, clearOpposite, setNoneFor, checkedByCol],
  );

  const getChecked = useCallback(
    (col: AnalysisColKey, row: PermissionTableRow) =>
      row.kind === 'category' ? !!checkedByCol[col].parent[row.key] : !!checkedByCol[col].leaf[row.key],
    [checkedByCol],
  );

  return {
    rows,
    topKeys,
    byId,
    childrenById,
    parentById,
    getChecked,
    onParentToggle,
    onLeafToggle,
  };
}
