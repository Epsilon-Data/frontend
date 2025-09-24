import type { Edge, Node } from 'reactflow';

export interface NodeLabelData {
  label: string;
}

export type TempEdge = Edge & { className?: string };

export type RFNode = Node<NodeLabelData>;
export type RFEdge = Edge;
