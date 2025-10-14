import type { Edge, XYPosition } from '@xyflow/react';

export interface NodeData {
  id: string;
  position: XYPosition;
  data: {
    label: string;
    level: number;
  };
  type: string;
}

export type TempEdge = Edge & { className?: string };
