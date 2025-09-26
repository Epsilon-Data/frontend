import { ElementsSidebar } from '@app/components/reactflow-components/ElementsSidebar/ElementsSidebar';
import { ZoomControls } from '@app/components/reactflow-components/ZoomControls/ZoomControls';
import { FlowMode } from '@app/context/ArchetypeFlow';
import { useArchetypeFlow } from '@app/hooks/useArchetypeFlow';
import { ArchetypeFlowProvider } from '@app/providers/ArchetypeFlowProvider';
import React, { Dispatch, SetStateAction } from 'react';
import ReactFlow, { Background, Edge, EdgeChange, Node, NodeChange } from 'reactflow';
import { ColumnSidebar } from '../ColumnSidebar/ColumnSidebar';

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
        mode={mode}
        name={name}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        columns={columns}
        setColumns={setColumns}
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
  columns,
  setColumns,
  setNodes,
  setEdges,
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
  } = useArchetypeFlow({ nodes, edges, setNodes, setEdges, columns });

  const selectedSubcat = [...nodes].reverse().find((n) => n.selected && n.type === 'subcategory') || null;

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
      <ColumnSidebar
        selectedSubcat={selectedSubcat}
        setNodes={setNodes}
        setEdges={setEdges}
        mode={mode}
        columns={columns || []}
        setColumns={setColumns || undefined}
      />
      <ZoomControls />
      <Background variant={bgVariant} />
    </ReactFlow>
  );
};
