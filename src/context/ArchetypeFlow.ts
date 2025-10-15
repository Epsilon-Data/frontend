import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { BackgroundVariant, Edge, EdgeTypes, FitViewOptions, Node, NodeTypes } from '@xyflow/react';

export type FlowMode = 'editable' | 'readonly' | 'mapping';

export type ArchetypeFlowContextType = {
  mode: FlowMode;
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
  onConnectPost?: (p: { source: Node; target: Node; setEdges: Dispatch<SetStateAction<Edge[]>> }) => void;
  options?: { fitView: boolean; fitViewOptions: FitViewOptions; nodeOrigin: number[] };
  bgVariant: BackgroundVariant;
} | null;

export const ArchetypeFlowContext = createContext<ArchetypeFlowContextType>(null);
