import type { Edge } from 'reactflow';

export interface NodeData {
  label: string;
  level: number;
}

export type TempEdge = Edge & { className?: string };
