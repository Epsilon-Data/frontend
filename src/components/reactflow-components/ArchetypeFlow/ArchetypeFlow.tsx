import { ElementsSidebar } from '@app/components/reactflow-components/ElementsSidebar/ElementsSidebar';
import { MapEdge } from '@app/components/reactflow-components/MapEdge/MapEdge';
import { ZoomControls } from '@app/components/reactflow-components/ZoomControls/ZoomControls';
import {
  BG_VARIANT,
  createNodeTypes,
  FlowProps,
  isValidEdge,
  nodeDrag,
  nodeDragStop,
  REACT_FLOW_OPTIONS,
} from '@app/constants/reactflow';
import { t } from 'i18next';
import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, { Edge, ReactFlowInstance, Connection, addEdge, Background, EdgeProps } from 'reactflow';

export interface ArchetypeProps extends FlowProps {
  mode: 'mapping' | 'readonly' | 'editable';
  name?: string;
  columns?: string[];
  setColumns?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ArchetypeFlow: React.FC<ArchetypeProps> = ({
  nodes,
  edges,
  setEdges,
  setNodes,
  onEdgesChange,
  onNodesChange,
  mode,
  name,
  columns,
  setColumns,
}) => {
  console.log('ArchetypeFlow columns:', columns);
  setColumns && console.log('ArchetypeFlow setColumns is provided');

  const nodeTypes = useMemo(() => createNodeTypes(mode), [mode]);
  const edgeTypes = useMemo(
    () => ({
      default: (edgeProps: EdgeProps) => <MapEdge {...edgeProps} mode={mode} />,
    }),
    [mode],
  );
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  let nodeId = nodes.length;
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceNode = nodes.find((n) => n.id == params.source);
      const targetNode = nodes.find((n) => n.id == params.target);

      if (sourceNode && targetNode && isValidEdge(sourceNode, targetNode, nodes, edges)) {
        setEdges(addEdge(params, edges));
      }
    },
    [edges, nodes, setEdges],
  );

  const onDragOver = useCallback((event: { preventDefault: () => void; dataTransfer: { dropEffect: string } }) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { getData: (arg0: string) => unknown };
      clientX: unknown;
      clientY: unknown;
    }) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type !== 'string') {
        console.error('Invalid type:', type);
        return;
      }

      if (reactFlowInstance) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX as number,
          y: event.clientY as number,
        });
        const newNode = {
          id: `node_${nodeId++}`,
          type,
          position,
          data: { label: t('databaseSources.describeDataset.elementSidebar.' + type) },
        };

        setNodes(nodes.concat(newNode));
      }
    },
    [nodeId, nodes, reactFlowInstance, setNodes],
  );

  const onNodeDrag = useCallback(
    (_: unknown, node: unknown) => {
      nodeDrag(_, node, nodes, setEdges, edges);
    },
    [edges, nodes, setEdges],
  );

  const onNodeDragStop = useCallback(
    (_: unknown, node: unknown) => {
      nodeDragStop(_, node, nodes, edges, setEdges);
    },
    [edges, nodes, setEdges],
  );
  return (
    <ReactFlow
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
      nodeOrigin={REACT_FLOW_OPTIONS.nodeOrigin as [number, number]}
      fitView={REACT_FLOW_OPTIONS.fitView}
      fitViewOptions={REACT_FLOW_OPTIONS.fitViewOptions}
      proOptions={{ hideAttribution: true }}
    >
      {name && <ElementsSidebar name={name} />}
      <ZoomControls />
      <Background variant={BG_VARIANT} />
    </ReactFlow>
  );
};
