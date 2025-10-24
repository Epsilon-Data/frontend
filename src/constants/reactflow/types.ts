import type { Edge } from '@xyflow/react';
import { TextNode } from '@app/components/reactflow-components/TextNode/TextNode';
import { ColumnNode } from '@app/components/reactflow-components/ColumnNode/ColumnNode';

export type NodeData = {
  label: string;
  level: number;
  table?: string;
};

export type TempEdge = Edge & { className?: string };

export const nodeTypes = {
  root: TextNode,
  category: TextNode,
  column: ColumnNode,
};
