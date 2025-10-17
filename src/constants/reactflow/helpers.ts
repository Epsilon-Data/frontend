import { Node, Edge } from '@xyflow/react';

const COLUMN_Y_OFFSET = 150;
const ROW_GAP = 64;
const COL_GAP = 220;
const MAX_ROWS = 6;

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
