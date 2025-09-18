import type { Edge, Node } from 'reactflow';
import type { Dispatch, SetStateAction } from 'react';
import { TempEdge } from './types';

export const MIN_DISTANCE = 160;

function closestEdge(node: Node, nodes: Node[]): Edge | null {
  const current = nodes.find((n) => n.id === node.id);
  if (!current) return null;

  type Acc = { distance: number; node: Node | null };
  const closest: Acc = nodes.reduce<Acc>(
    (acc, n) => {
      if (n.id === current.id) return acc;
      const dx = n.position.x - current.position.x;
      const dy = n.position.y - current.position.y;
      const d = Math.hypot(dx, dy);
      return d < acc.distance && d < MIN_DISTANCE ? { distance: d, node: n } : acc;
    },
    { distance: Number.MAX_VALUE, node: null },
  );

  if (!closest.node) return null;

  const closeIsLeft = closest.node.position.x < current.position.x;
  const source = closeIsLeft ? closest.node.id : node.id;
  const target = closeIsLeft ? node.id : closest.node.id;

  const id = `reactflow__edge-${source}-${target}`;
  return { id, source, target };
}

export function nodeDrag(_evt: unknown, node: Node, nodes: Node[], setEdges: Dispatch<SetStateAction<Edge[]>>): void {
  const close = closestEdge(node, nodes);

  setEdges((prev) => {
    const next = (prev as TempEdge[]).filter((e) => e.className !== 'temp');

    if (!close) return next;

    const exists = next.some((e) => e.source === close.source && e.target === close.target);
    if (exists) return next;

    const temp: TempEdge = { ...close, className: 'temp' };
    return [...next, temp];
  });
}

export function nodeDragStop(
  _evt: unknown,
  node: Node,
  nodes: Node[],
  _edges: Edge[],
  setEdges: Dispatch<SetStateAction<Edge[]>>,
): void {
  const close = closestEdge(node, nodes);

  setEdges((prev) => {
    const prevWithClass = prev as TempEdge[];
    const next = prevWithClass.filter((e) => e.className !== 'temp');
    const wasTemp = prevWithClass.some((e) => e.className === 'temp' && e.id === close?.id);
    return close && wasTemp ? [...next, close] : next;
  });
}
