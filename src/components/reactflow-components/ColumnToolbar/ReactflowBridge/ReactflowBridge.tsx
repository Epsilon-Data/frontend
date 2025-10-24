import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Node, ReactFlowState, useStore } from '@xyflow/react';

export type Anchor = { left: number; top: number; selectedId: string; flowPos: { x: number; y: number } } | null;

function isSame(a: Anchor, b: Anchor) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.left === b.left && a.top === b.top && a.selectedId === b.selectedId;
}

const isCategory = (n?: Node | null) => n?.type === 'category';

export const ReactflowBridge: React.FC<{ onUpdate: (a: Anchor) => void }> = ({ onUpdate }) => {
  const transform = useStore((s) => s.transform);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const selected = useStore((s: ReactFlowState) => s.nodes.find((n) => n.selected && n.type === 'category') ?? null);
  const nodesById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const isLeafHierarchyNode = useCallback(
    (n: Node | null) => {
      if (!n || !isCategory(n)) return false;
      const lvl = (n!.data as { level: number }).level;
      if (typeof lvl !== 'number') return false;

      return !edges.some((e) => {
        if (e.source !== n.id) return false;
        const t = nodesById.get(e.target) || null;
        const tLvl = (t!.data as { level: number }).level;
        return isCategory(t) && typeof tLvl === 'number' && tLvl > lvl;
      });
    },
    [edges, nodesById],
  );

  const anchor = useMemo<Anchor>(() => {
    if (!selected || !isLeafHierarchyNode(selected)) return null;

    const [tx, ty, zoom] = transform;
    const abs = selected.position;
    const w = selected.measured?.width ?? 0;
    const h = selected.measured?.height ?? 0;
    if (!abs || !w) return null;

    return {
      left: abs.x * zoom + tx + (w * zoom) / 2 + 20,
      top: abs.y * zoom + ty + (h * zoom) / 2 - 60,
      selectedId: selected.id,
      flowPos: { x: abs.x, y: abs.y },
    };
  }, [isLeafHierarchyNode, selected, transform]);

  const last = useRef<Anchor>(null);
  useEffect(() => {
    if (isSame(last.current, anchor)) return;
    last.current = anchor;
    onUpdate(anchor);
  }, [anchor, onUpdate]);

  return null;
};
