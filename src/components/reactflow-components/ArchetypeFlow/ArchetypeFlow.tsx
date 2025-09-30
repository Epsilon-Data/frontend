import { ElementsSidebar } from '@app/components/reactflow-components/ElementsSidebar/ElementsSidebar';
import { ZoomControls } from '@app/components/reactflow-components/ZoomControls/ZoomControls';
import { FlowMode } from '@app/context/ArchetypeFlow';
import { useArchetypeFlow } from '@app/hooks/useArchetypeFlow';
import { ArchetypeFlowProvider } from '@app/providers/ArchetypeFlowProvider';
import React, { Dispatch, SetStateAction } from 'react';
import ReactFlow, { Background, Edge, EdgeChange, Node, NodeChange } from 'reactflow';
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
  ...rest
}) => {
  const {
    nodeTypes,
    edgeTypes,
    onConnect,
    onDrop,
    onDragOver,
    onNodeDrag,
    onNodeDragStop,
    setReactFlowInstance,
    options,
    bgVariant,
  } = useArchetypeFlow({ nodes, edges, setNodes, setEdges });

  return (
    <ReactFlow
      {...rest}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onConnect={onConnect}
      onInit={setReactFlowInstance}
      onDrop={onDrop}
      onDragOver={onDragOver}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodeOrigin={options?.nodeOrigin as [number, number]}
      fitView={options?.fitView}
      fitViewOptions={options?.fitViewOptions}
      proOptions={{ hideAttribution: true }}
    >
      {name && <ElementsSidebar name={name} mode={mode} />}
      <ZoomControls />
      <Background variant={bgVariant} />
      <ReactflowBridge onUpdate={(a) => onAnchorChange?.(a)} />
    </ReactFlow>
  );
};
