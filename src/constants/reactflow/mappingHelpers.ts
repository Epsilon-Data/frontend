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
