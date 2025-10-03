import React, { useEffect, useMemo, useRef } from 'react';
import { useStore } from 'reactflow';

export type Anchor = { left: number; top: number; selectedId: string; flowPos: { x: number; y: number } } | null;

function isSame(a: Anchor, b: Anchor) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.left === b.left && a.top === b.top && a.selectedId === b.selectedId;
}

export const ReactflowBridge: React.FC<{ onUpdate: (a: Anchor) => void }> = ({ onUpdate }) => {
  const transform = useStore((s) => s.transform);

  const selectedInternal = useStore((s) => {
    for (const n of s.nodeInternals.values()) {
      if (n.selected && n.type === 'subcategory') return n;
    }
    return null;
  });

  const anchor = useMemo<Anchor>(() => {
    if (!selectedInternal) return null;
    const [tx, ty, zoom] = transform;
    const abs = selectedInternal.positionAbsolute ?? selectedInternal.position;
    const w = selectedInternal.width ?? 0;
    const h = selectedInternal.height ?? 0;
    if (!abs || !w) return null;
    return {
      left: abs.x * zoom + tx + (w * zoom) / 2 + 20,
      top: abs.y * zoom + ty + (h * zoom) / 2 - 60,
      selectedId: selectedInternal.id,
      flowPos: { x: abs.x, y: abs.y },
    };
  }, [selectedInternal, transform]);

  const last = useRef<Anchor>(null);
  useEffect(() => {
    if (isSame(last.current, anchor)) return;
    last.current = anchor;
    onUpdate(anchor);
  }, [anchor, onUpdate]);

  return null;
};
