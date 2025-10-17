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

export function buildAdjacency(edges: Edge[]) {
  const out = new Map<string, string[]>();
  const inMap = new Map<string, string[]>();
  for (const e of edges) {
    (out.get(e.source) ?? out.set(e.source, []).get(e.source)!).push(e.target);
    (inMap.get(e.target) ?? inMap.set(e.target, []).get(e.target)!).push(e.source);
  }
  return { out, inMap };
}

export function graphToTableRows(nodes: Node[], edges: Edge[]): TableRow[] {
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
      children: children.length ? children : undefined,
    };
  };

  const rows = topCats.map((tc) => buildCategory(tc, tc)).sort((a, b) => a.label.localeCompare(b.label));
  return rows;
}
