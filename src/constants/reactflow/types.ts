import type { Edge } from '@xyflow/react';

export type NodeData = {
  label: string;
  level: number;
};

export type TempEdge = Edge & { className?: string };
