import type { Edge, Node } from '@xyflow/react';

const VALID: Record<string, string[]> = {
  object: ['category'],
  category: ['subcategory'],
  subcategory: ['column'],
  column: ['subcategory'],
};

export function isValidEdgeBase(source: Node, target: Node, edges: Edge[]) {
  if (!source || !target) return false;
  if (source.id === target.id) return false;

  const edgeExists = edges.some(
    (e) => (e.source === source.id && e.target === target.id) || (e.source === target.id && e.target === source.id),
  );

  if (edgeExists) return false;

  const sourceType = source.type;
  const targetType = target.type;

  if (!sourceType || !targetType) return false;

  return VALID[sourceType]?.includes(targetType) ?? false;
}
