import React, { useEffect, useMemo, useRef } from 'react';
import { ReactFlowState, useStore } from '@xyflow/react';

export type Anchor = { left: number; top: number; selectedId: string; flowPos: { x: number; y: number } } | null;

function isSame(a: Anchor, b: Anchor) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.left === b.left && a.top === b.top && a.selectedId === b.selectedId;
}

export const ReactflowBridge: React.FC<{ onUpdate: (a: Anchor) => void }> = ({ onUpdate }) => {
  const transform = useStore((s) => s.transform);

  const selected = useStore((s: ReactFlowState) => s.nodes.find((n) => n.selected && n.type === 'subcategory') ?? null);

  const anchor = useMemo<Anchor>(() => {
    if (!selected) return null;
    const [tx, ty, zoom] = transform;
    const abs = selected.position;
    const w = selected.width ?? 0;
    const h = selected.height ?? 0;
    if (!abs || !w) return null;
    return {
      left: abs.x * zoom + tx + (w * zoom) / 2 + 20,
      top: abs.y * zoom + ty + (h * zoom) / 2 - 60,
      selectedId: selected.id,
      flowPos: { x: abs.x, y: abs.y },
    };
  }, [selected, transform]);

  const last = useRef<Anchor>(null);
  useEffect(() => {
    if (isSame(last.current, anchor)) return;
    last.current = anchor;
    onUpdate(anchor);
  }, [anchor, onUpdate]);

  return null;
};
