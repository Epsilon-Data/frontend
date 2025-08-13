import { BG_VARIANT, createNodeTypes, FlowProps, isValidEdge, REACT_FLOW_OPTIONS } from '@app/constants/reactflow';
import { NodeData } from '@app/components/reactflow-components/SubcategoryNode/SubcategoryNode';
import { Button } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import ReactFlow, {
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  addEdge,
  Background,
  NodeChange,
  EdgeChange,
  Panel,
  useReactFlow,
  EdgeProps,
} from 'reactflow';
import { MapEdge } from '@app/components/reactflow-components/MapEdge/MapEdge';

const CustomZoomControls = () => {
  const { zoomIn, zoomOut, getZoom } = useReactFlow();
  const [zoomLevel, setZoomLevel] = useState<number>(Math.round(getZoom() * 100));

  useEffect(() => {
    const interval = setInterval(() => {
      setZoomLevel(Math.round(getZoom() * 100));
    }, 200);
    return () => clearInterval(interval);
  }, [getZoom]);

  return (
    <Panel position="bottom-right">
      <div className="flex items-center bg-white border border-[#ddd] rounded-lg text-base p-1">
        <Button icon={<FaPlus />} size="small" onClick={() => zoomIn()} className="border-none bg-transparent mr-2.5" />
        <span className="w-12 text-center inline-block">{zoomLevel}%</span>
        <Button
          icon={<FaMinus />}
          size="small"
          onClick={() => zoomOut()}
          className="border-none bg-transparent ml-2.5"
        />
      </div>
    </Panel>
  );
};

const Flow: React.FC<
  FlowProps & {
    columns: string[];
  }
> = ({ nodes, edges, setEdges, onEdgesChange, onNodesChange, columns }) => {
  const nodeTypes = useMemo(() => createNodeTypes('mapping'), []);
  const edgeTypes = useMemo(
    () => ({
      default: (edgeProps: EdgeProps) => <MapEdge {...edgeProps} mode={'mapping'} />,
    }),
    [],
  );

  const updatedNodes = useMemo(() => {
    return nodes.map((node) => {
      if (node.type === 'subcategory') {
        const connectedColumns = edges
          .filter((edge) => edge.source === node.id || edge.target === node.id)
          .map((edge) => {
            const otherNodeId = edge.source === node.id ? edge.target : edge.source;
            const otherNode = nodes.find((n) => n.id === otherNodeId);
            return otherNode?.data.label;
          })
          .filter(Boolean);

        const availableColumns = columns.filter((col) => !connectedColumns.includes(col));

        return {
          ...node,
          data: {
            ...node.data,
            availableColumns,
            onColumnSelect: (columnName: string) => {
              const columnNode = nodes.find((n) => n.type === 'column' && n.data.label === columnName);
              if (columnNode) {
                setEdges((eds) =>
                  eds.filter(
                    (e) =>
                      e.source !== node.id &&
                      e.target !== node.id &&
                      e.source !== columnNode.id &&
                      e.target !== columnNode.id,
                  ),
                );

                const newEdge = {
                  id: `edge-${node.id}-${columnNode.id}`,
                  source: node.id,
                  target: columnNode.id,
                  type: 'default',
                };
                setEdges((eds) => [...eds, newEdge]);
              }
            },
          } as NodeData,
        };
      }
      return node;
    });
  }, [nodes, edges, columns, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceNode = nodes.find((n) => n.id == params.source);
      const targetNode = nodes.find((n) => n.id == params.target);

      if (sourceNode && targetNode && isValidEdge(sourceNode, targetNode, nodes, edges)) {
        // For subcategory-column connections, ensure one-to-one mapping
        if (
          (sourceNode.type === 'subcategory' && targetNode.type === 'column') ||
          (sourceNode.type === 'column' && targetNode.type === 'subcategory')
        ) {
          // Remove any existing connections for both nodes
          setEdges((eds) =>
            eds.filter(
              (e) =>
                e.source !== sourceNode.id &&
                e.target !== sourceNode.id &&
                e.source !== targetNode.id &&
                e.target !== targetNode.id,
            ),
          );
        }

        setEdges((eds: Edge[]) => addEdge(params, eds));
      }
    },
    [edges, nodes, setEdges],
  );

  return (
    <ReactFlow
      nodes={updatedNodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodeOrigin={REACT_FLOW_OPTIONS.nodeOrigin as [number, number]}
      fitView={REACT_FLOW_OPTIONS.fitView}
      fitViewOptions={REACT_FLOW_OPTIONS.fitViewOptions}
      proOptions={{ hideAttribution: true }}
    >
      <CustomZoomControls />
      <Background variant={BG_VARIANT} />
    </ReactFlow>
  );
};

export const ColumnMapping: React.FC<{
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<
    React.SetStateAction<
      Node<
        {
          label: string;
        },
        string | undefined
      >[]
    >
  >;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: (value: NodeChange[]) => void;
  onEdgesChange: (value: EdgeChange[]) => void;
  columns: string[];
}> = ({ nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, columns }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg">
      <ReactFlowProvider>
        <div className="h-[30rem] w-full">
          <Flow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setNodes={setNodes}
            setEdges={setEdges}
            columns={columns}
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
};
