import type { Edge } from '@xyflow/react';

export type NodeData = {
  label: string;
  level: number;
  table?: string;
};

export type TempEdge = Edge & { className?: string };
