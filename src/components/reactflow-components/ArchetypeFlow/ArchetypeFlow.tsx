import { ArchetypeSidebar } from '@app/components/reactflow-components/ArchetypeSidebar/ArchetypeSidebar';
import { ZoomControls } from '@app/components/reactflow-components/ZoomControls/ZoomControls';
import { FlowMode } from '@app/context/ArchetypeFlow';
import { useArchetypeFlow } from '@app/hooks/useArchetypeFlow';
import { ArchetypeFlowProvider } from '@app/providers/ArchetypeFlowProvider';
import React, { Dispatch, SetStateAction } from 'react';
import { Background, Edge, EdgeChange, Node, NodeChange, ReactFlow } from '@xyflow/react';
import { Anchor, ReactflowBridge } from '../ColumnToolbar/ReactflowBridge/ReactflowBridge';

export interface ArchetypeProps {
  mode: FlowMode;
  name?: string;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (value: NodeChange[]) => void;
  onEdgesChange: (value: EdgeChange[]) => void;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onAnchorChange?: (a: Anchor) => void;
  onLeafNodeBecameParent?: (nodeId: string) => void;
}

export const ArchetypeFlow: React.FC<ArchetypeProps> = ({
  mode,
  name,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onAnchorChange,
  ...rest
}) => {
  return (
    <ArchetypeFlowProvider mode={mode}>
      <InnerFlow
        mode={mode}
        name={name}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onAnchorChange={onAnchorChange}
        {...rest}
      />
    </ArchetypeFlowProvider>
  );
};

const InnerFlow: React.FC<ArchetypeProps> = ({
  mode,
  name,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
  onAnchorChange,
  onLeafNodeBecameParent,
  ...rest
}) => {
  const {
    nodeTypes,
    edgeTypes,
    onConnect,
    onConnectEnd,
    nodesConnectable,
    isValidConnection,
    setReactFlowInstance,
    options,
    bgVariant,
  } = useArchetypeFlow({
    nodes,
    edges,
    setNodes,
    setEdges,
    mode,
    onLeafNodeBecameParent,
  });

  const isReadonly = mode === 'readonly';

  return (
    <ReactFlow
      {...rest}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      onInit={setReactFlowInstance}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodeOrigin={options?.nodeOrigin as [number, number]}
      fitView={options?.fitView}
      fitViewOptions={options?.fitViewOptions}
      proOptions={{ hideAttribution: true }}
      nodesConnectable={nodesConnectable}
      isValidConnection={isValidConnection}
      nodesDraggable={!isReadonly}
      elementsSelectable={!isReadonly}
    >
      {name && <ArchetypeSidebar name={name} mode={mode} />}
      <ZoomControls />
      <Background variant={bgVariant} />
      <ReactflowBridge onUpdate={(a) => onAnchorChange?.(a)} />
    </ReactFlow>
  );
};
