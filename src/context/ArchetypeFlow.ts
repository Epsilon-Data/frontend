// context/FlowContext.ts
import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { BackgroundVariant, Edge, FitViewOptions, Node, NodeProps } from 'reactflow';
import type { EdgeProps } from 'reactflow';

export type FlowMode = 'editable' | 'readonly' | 'mapping';

export type ArchetypeFlowContextType = {
  mode: FlowMode;
  nodeTypes: Record<string, (props: NodeProps) => JSX.Element>;
  edgeTypes: Record<string, (props: EdgeProps) => JSX.Element>;
  isValidEdge: (source: Node, target: Node, edges: Edge[]) => boolean;
  enhanceNodes?: (p: {
    nodes: Node[];
    edges: Edge[];
    columns?: string[];
    setEdges: Dispatch<SetStateAction<Edge[]>>;
  }) => Node[];
  onConnectPost?: (p: { source: Node; target: Node; setEdges: Dispatch<SetStateAction<Edge[]>> }) => void;
  columns?: string[];
  setColumns?: Dispatch<SetStateAction<string[]>>;
  options?: { fitView: boolean; fitViewOptions: FitViewOptions; nodeOrigin: number[] };
  bgVariant: BackgroundVariant;
} | null;

export const ArchetypeFlowContext = createContext<ArchetypeFlowContextType>(null);
