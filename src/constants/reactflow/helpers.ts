import { Permission } from '@app/api/archetypes.api';
import { Node, Edge } from '@xyflow/react';

const COLUMN_Y_OFFSET = 150;
const ROW_GAP = 64;
const COL_GAP = 220;
const MAX_ROWS = 6;

export type RowType = 'category' | 'leaf';

export type TableRow = {
  key: string;
  label: string;
  kind: RowType;
  parentId?: string;
  topCategoryId?: string;
  level?: number;
  children?: TableRow[];
};

export function computeNextColumnPosition(
  subcatId: string,
  nodes: Node[],
  edges: Edge[],
  baseX: number,
  baseY: number,
) {
  const connectedIds = edges
    .filter((e) => e.source === subcatId || e.target === subcatId)
    .map((e) => (e.source === subcatId ? e.target : e.source));

  const connectedCols = connectedIds
    .map((id) => nodes.find((n) => n.id === id))
    .filter((n): n is Node => Boolean(n && n.type === 'column'));

  const count = connectedCols.length;

  const colIndex = Math.floor(count / MAX_ROWS);
  const rowIndex = count % MAX_ROWS;

  const x = baseX + colIndex * COL_GAP;
  const y = baseY + COLUMN_Y_OFFSET + rowIndex * ROW_GAP;

  return { x, y };
}

export function findUnmappedLeafs(nodes: Node[], edges: Edge[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const missing: string[] = [];
  const outMap = new Map<string, Edge[]>();
  edges.forEach((e) => {
    const arr = outMap.get(e.source);
    if (arr) arr.push(e);
    else outMap.set(e.source, [e]);
  });

  nodes.forEach((n) => {
    if (n.type !== 'category') return;

    const outs = outMap.get(n.id) ?? [];
    const hasCategoryChild = outs.some((e) => byId.get(e.target)?.type === 'category');

    if (!hasCategoryChild) {
      const columnLinks = outs.filter((e) => byId.get(e.target)?.type === 'column').length;
      if (columnLinks !== 1) {
        const label = (n.data as { label: string })?.label ?? n.id;
        missing.push(label);
      }
    }
  });

  return missing;
}

export function findDuplicateChildLabels(nodes: Node[], edges: Edge[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const childLabelsByParent = new Map<string, string[]>();
  edges.forEach((e) => {
    const parent = byId.get(e.source);
    const child = byId.get(e.target);
    if (!parent || !child) return;

    const parentType = parent.type ?? '';
    if (parentType !== 'category' && parentType !== 'root') return;

    const label = (child.data as { label?: string })?.label?.trim();
    if (!label) return;

    const list = childLabelsByParent.get(parent.id);
    if (list) list.push(label);
    else childLabelsByParent.set(parent.id, [label]);
  });

  const issues: Array<{
    parentId: string;
    parentLabel: string;
    labels: string[];
    conflictsWithParent: string[];
  }> = [];

  for (const [parentId, childLabels] of childLabelsByParent.entries()) {
    const parentNode = byId.get(parentId);
    const parentLabelRaw = (parentNode?.data as { label?: string })?.label ?? parentId;
    const parentLabel = parentLabelRaw.trim();

    const counts = new Map<string, number>();
    childLabels.forEach((l) => counts.set(l, (counts.get(l) ?? 0) + 1));
    const dupChildLabels = [...counts.entries()].filter(([, c]) => c > 1).map(([l]) => l);

    const conflictsWithParent = Array.from(new Set(childLabels.filter((l) => l === parentLabel)));

    if (dupChildLabels.length || conflictsWithParent.length) {
      issues.push({
        parentId,
        parentLabel,
        labels: dupChildLabels,
        conflictsWithParent,
      });
    }
  }

  return issues;
}

function buildAdjacency(edges: Edge[]) {
  const out = new Map<string, string[]>();
  const inMap = new Map<string, string[]>();
  for (const e of edges) {
    (out.get(e.source) ?? out.set(e.source, []).get(e.source)!).push(e.target);
    (inMap.get(e.target) ?? inMap.set(e.target, []).get(e.target)!).push(e.source);
  }
  return { out, inMap };
}

function graphToTableRows(nodes: Node[], edges: Edge[]): TableRow[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const { out, inMap } = buildAdjacency(edges);
  const childrenOf = (id: string) => out.get(id) ?? [];
  const labelOf = (id: string) => String((byId.get(id)?.data as { label: string })?.label ?? id);

  const rootIds = nodes.filter((n) => n.type === 'root').map((n) => n.id);
  const catUnderRoot = new Set<string>();
  for (const r of rootIds) for (const c of childrenOf(r)) if (byId.get(c)?.type === 'category') catUnderRoot.add(c);

  const categories = nodes.filter((n) => n.type === 'category');
  const topCats = catUnderRoot.size
    ? [...catUnderRoot]
    : categories.filter((n) => !(inMap.get(n.id) ?? []).some((p) => byId.get(p)?.type === 'category')).map((n) => n.id);

  const isLeafCategory = (catId: string) => childrenOf(catId).some((cid) => byId.get(cid)?.type === 'column');

  const getNodeLevel = (id: string): number => {
    const raw = (byId.get(id)?.data as { level: number })?.level;
    return Number(raw);
  };

  const buildCategory = (id: string, topId: string, parentId?: string): TableRow => {
    const subcats = childrenOf(id)
      .map((cid) => byId.get(cid))
      .filter((n) => n && n.type === 'category') as Node[];

    const children = subcats.map((n) => buildCategory(n.id, topId, id)).sort((a, b) => a.label.localeCompare(b.label));

    return {
      key: id,
      label: labelOf(id),
      kind: isLeafCategory(id) ? 'leaf' : 'category',
      parentId,
      topCategoryId: topId,
      level: getNodeLevel(id),
      children: children.length ? children : undefined,
    };
  };

  const rows = topCats.map((tc) => buildCategory(tc, tc)).sort((a, b) => a.label.localeCompare(b.label));
  return rows;
}

export function buildPermissionTree(nodes: Node[], edges: Edge[]) {
  const rows = graphToTableRows(nodes, edges);

  const byId = new Map<string, TableRow>();
  const childrenById = new Map<string, string[]>();
  const parentById = new Map<string, string>();
  const topKeys = rows.map((r) => r.key);

  const walk = (r: TableRow) => {
    byId.set(r.key, r);
    if (r.children?.length) {
      childrenById.set(
        r.key,
        r.children.map((c) => c.key),
      );
      for (const c of r.children) {
        parentById.set(c.key, r.key);
        walk(c);
      }
    }
  };
  rows.forEach(walk);

  const findDescendants = (catId: string) => {
    const q = [catId];
    const cats: string[] = [];
    const leafs: string[] = [];
    while (q.length) {
      const cur = q.pop()!;
      const kids = childrenById.get(cur) ?? [];
      for (const k of kids) {
        const n = byId.get(k)!;
        if (n.kind === 'category') {
          cats.push(n.key);
          q.push(n.key);
        } else if (n.kind === 'leaf') {
          leafs.push(n.key);
        }
      }
    }
    return { cats, leafs };
  };

  const ancestorsUpToTop = (nodeId: string) => {
    const res: string[] = [];
    let cur: string | undefined = nodeId;
    while (true) {
      const p = parentById.get(cur!);
      if (!p) break;
      res.push(p);
      cur = p;
    }
    return res;
  };

  const allDescLeafsChecked = (catId: string, leafCheckedMap: Record<string, boolean>) => {
    const { leafs } = findDescendants(catId);
    if (leafs.length === 0) return false;
    return leafs.every((id) => !!leafCheckedMap[id]);
  };

  return { rows, byId, childrenById, parentById, topKeys, findDescendants, ancestorsUpToTop, allDescLeafsChecked };
}

export function permissionsFromChecked(
  checkedByCol: {
    high: { parent: Record<string, boolean>; leaf: Record<string, boolean> };
    detail: { parent: Record<string, boolean>; leaf: Record<string, boolean> };
  },
  childrenById: Map<string, string[]>,
  topKeys: string[],
): Permission[] {
  const out: Permission[] = [];
  const covered = new Set<string>();

  const coverSubtree = (id: string) => {
    const stack = [id];
    while (stack.length) {
      const cur = stack.pop()!;
      if (covered.has(cur)) continue;
      covered.add(cur);
      const kids = childrenById.get(cur);
      if (kids?.length) stack.push(...kids);
    }
  };

  const subtreeHasCovered = (id: string): boolean => {
    const stack = [id];
    while (stack.length) {
      const cur = stack.pop()!;
      if (covered.has(cur)) return true;
      const kids = childrenById.get(cur);
      if (kids?.length) stack.push(...kids);
    }
    return false;
  };

  for (const [id, checked] of Object.entries(checkedByCol.detail.parent)) {
    if (!checked || covered.has(id)) continue;
    out.push({ id, permission: 'DETAILED' });
    coverSubtree(id);
  }

  for (const [id, checked] of Object.entries(checkedByCol.detail.leaf)) {
    if (!checked || covered.has(id)) continue;
    out.push({ id, permission: 'DETAILED' });
    covered.add(id);
  }

  for (const [id, checked] of Object.entries(checkedByCol.high.parent)) {
    if (!checked || covered.has(id)) continue;
    out.push({ id, permission: 'HIGH_LEVEL' });
    coverSubtree(id);
  }

  for (const [id, checked] of Object.entries(checkedByCol.high.leaf)) {
    if (!checked || covered.has(id)) continue;
    out.push({ id, permission: 'HIGH_LEVEL' });
    covered.add(id);
  }

  const emitNonePreorder = (id: string) => {
    if (!subtreeHasCovered(id)) {
      out.push({ id, permission: 'NONE' });
      coverSubtree(id);
      return;
    }
    const kids = childrenById.get(id) ?? [];
    for (const k of kids) {
      if (!covered.has(k)) emitNonePreorder(k);
    }
  };

  for (const topId of topKeys) {
    if (!covered.has(topId)) emitNonePreorder(topId);
  }

  return out;
}
