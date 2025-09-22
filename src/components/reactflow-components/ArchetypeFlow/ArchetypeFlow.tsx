import { ElementsSidebar } from '@app/components/reactflow-components/ElementsSidebar/ElementsSidebar';
import { ZoomControls } from '@app/components/reactflow-components/ZoomControls/ZoomControls';
import { FlowMode } from '@app/context/ArchetypeFlow';
import { useArchetypeFlow } from '@app/hooks/useArchetypeFlow';
import { ArchetypeFlowProvider } from '@app/providers/ArchetypeFlowProvider';
import React, { Dispatch, SetStateAction } from 'react';
import ReactFlow, { Background, Edge, EdgeChange, Node, NodeChange } from 'reactflow';

export interface ArchetypeProps {
  mode: FlowMode;
  name?: string;
  columns?: string[];
  setColumns?: React.Dispatch<React.SetStateAction<string[]>>;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (value: NodeChange[]) => void;
  onEdgesChange: (value: EdgeChange[]) => void;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}

export const ArchetypeFlow: React.FC<ArchetypeProps> = ({
  mode,
  name,
  columns,
  setColumns,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  ...rest
}) => {
  return (
    <ArchetypeFlowProvider mode={mode} columns={columns} setColumns={setColumns}>
      <InnerFlow
        name={name}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        columns={columns}
        {...rest}
      />
    </ArchetypeFlowProvider>
  );
};

const InnerFlow: React.FC<Omit<ArchetypeProps, 'mode' | 'setColumns'>> = ({
  name,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  columns,
  setNodes,
  setEdges,
  ...rest
}) => {
  const {
    computedNodes,
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
  } = useArchetypeFlow({ nodes, edges, setNodes: setNodes, setEdges: setEdges, columns });

  return (
    <ReactFlow
      {...rest}
      nodes={computedNodes}
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
      {name && <ElementsSidebar name={name} />}
      <ZoomControls />
      <Background variant={bgVariant} />
    </ReactFlow>
  );
};
