import {
  BG_VARIANT,
  createNodeTypes,
  EDGE_TYPES,
  FlowProps,
  isValidEdge,
  nodeDrag,
  nodeDragStop,
  REACT_FLOW_OPTIONS,
} from '@app/constants/reactflow';
import { Button, Typography } from 'antd';
import { t } from 'i18next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { LuRedo, LuUndo } from 'react-icons/lu';
import { PiLightbulbBold } from 'react-icons/pi';
import { TiWarningOutline } from 'react-icons/ti';
import ReactFlow, {
  ReactFlowProvider,
  Node,
  Edge,
  ReactFlowInstance,
  Connection,
  addEdge,
  Background,
  NodeChange,
  EdgeChange,
  Panel,
  useReactFlow,
} from 'reactflow';

const { Text } = Typography;

const ElementsSidebar: React.FC<{ templateName: string }> = ({ templateName }) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <>
      <Panel position="top-left">
        <div className="flex text-start bg-white border border-[#ddd] rounded-lg text-base p-3 w-60 mb-4 shadow-xl">
          {templateName}
        </div>
        <div className="flex flex-col bg-white border border-[#ddd] rounded-lg p-3 w-60 mb-4 shadow-xl">
          <div className="text-sm text-start mb-2">{t('project.createTemplate.form.step2.sidebar.blocks')}</div>
          <div
            className="dndnode object bg-element-categoryBg text-center mb-2 rounded-lg py-2 w-5/6 text-white"
            onDragStart={(event) => onDragStart(event, 'category')}
            draggable
          >
            {t('project.createTemplate.form.step2.sidebar.category')}
          </div>
          <div
            className="dndnode object bg-element-subcategoryBg text-center mb-2 rounded-lg py-2 w-5/6 text-white"
            onDragStart={(event) => onDragStart(event, 'subcategory')}
            draggable
          >
            {t('project.createTemplate.form.step2.sidebar.subcategory')}
          </div>
          <div className="text-sm text-start my-2">{t('project.createTemplate.form.step2.sidebar.rules')}</div>
          <div className="font-light text-gray text-xs pb-0">
            <Text className="font-bold text-blueDark mr-2">•</Text> Parent → Category
          </div>
          <div className="font-light text-gray text-xs">
            <Text className="font-bold text-blueDark mr-2">•</Text> Category → Sub-category
          </div>
          <div className="flex items-center mt-2">
            <TiWarningOutline size={18} className="text-red-500 mr-2" />
            <Text className="font-light text-gray text-xs">No direct parent → Sub-category</Text>
          </div>
          <div className="flex items-center mt-2">
            <PiLightbulbBold size={30} className="text-[#1890ff] mr-2" />
            <Text className="font-light text-gray text-xs">
              Press Alt/Option key while dragging to duplicate an element
            </Text>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-[#ddd] rounded-lg text-base w-10 shadow-xl">
          <Button className="border-none bg-transparent shadow-none" icon={<LuUndo />} />
          <Button className="border-none bg-transparent shadow-none" icon={<LuRedo />} />
        </div>
      </Panel>
    </>
  );
};

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

const Flow: React.FC<FlowProps & { templateName: string }> = ({
  nodes,
  edges,
  setEdges,
  setNodes,
  onEdgesChange,
  onNodesChange,
  templateName,
}) => {
  const nodeTypes = useMemo(() => createNodeTypes(), []);
  const edgeTypes = useMemo(() => EDGE_TYPES, []);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  let nodeId = nodes.length;
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceNode = nodes.find((n) => n.id == params.source);
      const targetNode = nodes.find((n) => n.id == params.target);

      if (sourceNode && targetNode && isValidEdge(sourceNode, targetNode, nodes, edges)) {
        console.log(nodes);
        console.log(edges);
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
      <ElementsSidebar templateName={templateName} />
      <CustomZoomControls />
      <Background variant={BG_VARIANT} />
    </ReactFlow>
  );
};

export const CreateTemplate: React.FC<{
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
  templateName: string;
}> = ({ nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, templateName }) => {
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
            templateName={templateName}
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
};
