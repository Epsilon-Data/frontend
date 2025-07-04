/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useMemo, useState } from 'react';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import ReactFlow, {
  Connection,
  Edge,
  ReactFlowInstance,
  Node,
  addEdge,
  ReactFlowProvider,
  Controls,
  Background,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import * as S from './Step1.styles';
import { notificationController } from '@app/controllers/notificationController';
import { ElementSidebar } from './ElementSidebar/ElementSidebar';
import { Input } from 'antd';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {
  BG_VARIANT,
  createNodeTypes,
  EDGE_TYPES,
  FlowProps,
  nodeDrag,
  nodeDragStop,
  REACT_FLOW_OPTIONS,
} from '@app/constants/reactflow';
import { t } from 'i18next';

function checkDuplicateNames(nodes: Node[]) {
  const nameSet = new Set();
  const duplicateNames = new Set();

  for (const node of nodes) {
    if (nameSet.has(node.data.label)) {
      duplicateNames.add(node.data.label);
    }
    nameSet.add(node.data.label);
  }

  if (duplicateNames.size > 0) {
    return [...duplicateNames].join(', ');
  } else {
    return null;
  }
}

function hasEmptyLabel(nodes: Node[]): boolean {
  return nodes.some((node) => node.data.label.trim() === '');
}

function isValidEdge(source: Node, target: Node, nodes: Node[], edges: Edge[]) {
  if (!source || !target || source.type === target.type) return false;

  const isCategory = (node: Node) => node?.type === 'category';
  const isObject = (node: Node) => node?.type === 'object';
  const isSubcategory = (node: Node) => node?.type === 'subcategory';

  if ((isObject(source) || isObject(target)) && (isSubcategory(source) || isSubcategory(target))) {
    return false;
  }

  const isInvalidEdge = (edgeSource: Node, edgeTarget: Node, node: Node) => {
    if (edgeSource?.type != node.type && edgeTarget?.type != node.type) {
      return false;
    }
    if (edgeSource.id === node.id || edgeTarget.id === node.id) {
      return false;
    }

    return true;
  };

  const relatedEdges = edges.filter(
    (edge) =>
      edge.source === source.id || edge.target === target.id || edge.source === target.id || edge.target === source.id,
  );

  for (let i = 0; i < relatedEdges.length; i++) {
    const edgeSource = nodes.find((n) => n.id === relatedEdges[i].source);
    const edgeTarget = nodes.find((n) => n.id === relatedEdges[i].target);

    if (edgeSource && edgeTarget) {
      if ((isCategory(source) || isCategory(target)) && (isObject(source) || isObject(target))) {
        if (isObject(source) && isInvalidEdge(edgeSource, edgeTarget, source)) return false;
        if (isObject(target) && isInvalidEdge(edgeSource, edgeTarget, target)) return false;
      } else if ((isCategory(source) || isCategory(target)) && (isSubcategory(source) || isSubcategory(target))) {
        if (isCategory(source) && isInvalidEdge(edgeSource, edgeTarget, source)) return false;
        if (isCategory(target) && isInvalidEdge(edgeSource, edgeTarget, target)) return false;
      }
    }
  }

  return true;
}

function filterNodesEdges(nodes: Node[], edges: Edge[]) {
  const filteredNodes: Node[] = [];
  const filteredEdges: Edge[] = [];
  let objectWithoutCategory = false;
  let haveMultipleObjects = false;
  let objectCount = 0;

  function addNodeAndEdges(node: Node, edge: Edge) {
    if (!filteredNodes.some((n) => n.id === node.id)) {
      filteredNodes.push(node);
    }
    if (!filteredEdges.some((e) => e.id === edge.id)) {
      filteredEdges.push(edge);
    }
  }

  for (const node of nodes) {
    if (node.type === 'object') {
      objectCount++;
      objectWithoutCategory = true;
      filteredNodes.push(node);
      for (const edge of edges) {
        if (edge.source === node.id || edge.target === node.id) {
          const subNode = nodes.find((n) => n.id === (edge.source === node.id ? edge.target : edge.source));
          if (subNode) {
            objectWithoutCategory = false;
            addNodeAndEdges(subNode, edge);
            for (const subEdge of edges) {
              if (subEdge.source === subNode.id || subEdge.target === subNode.id) {
                const subcategoryNode = nodes.find(
                  (n) => n.id === (subEdge.source === subNode.id ? subEdge.target : subEdge.source),
                );
                if (subcategoryNode) {
                  addNodeAndEdges(subcategoryNode, subEdge);
                }
              }
            }
          }
        }
      }
    }
  }

  if (objectCount > 1) {
    haveMultipleObjects = true;
  }

  return { objectWithoutCategory, haveMultipleObjects, filteredNodes, filteredEdges };
}

const Flow: React.FC<FlowProps> = ({ nodes, edges, setEdges, setNodes, onEdgesChange, onNodesChange }) => {
  const nodeTypes = useMemo(() => createNodeTypes(), []);
  const edgeTypes = useMemo(() => EDGE_TYPES, []);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<any, any> | null>(null);

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
      dataTransfer: { getData: (arg0: string) => any };
      clientX: any;
      clientY: any;
    }) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (reactFlowInstance) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
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
    (_: any, node: any) => {
      nodeDrag(_, node, nodes, setEdges, edges);
    },
    [edges, nodes, setEdges],
  );

  const onNodeDragStop = useCallback(
    (_: any, node: any) => {
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
    >
      <Controls />
      <Background variant={BG_VARIANT} />
    </ReactFlow>
  );
};

export const Step1: React.FC<{
  setStep: (value: number) => void;
  setIsFormModalOpen: (value: boolean) => void;
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
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  onNodesChange: (value: NodeChange[]) => void;
  onEdgesChange: (value: EdgeChange[]) => void;
  setTemplate: (value: string) => void;
}> = ({ setStep, setIsFormModalOpen, nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, setTemplate }) => {
  const { t } = useTranslation();
  const [templateName, setTemplateName] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSaveError = (message: string, obj?: any) => {
    notificationController.error({
      message: t(`databaseSources.describeDataset.notify.${message}`, obj).toString(),
    });
    setSaveLoading(false);
  };

  const onSaveTemplate = () => {
    setSaveLoading(true);
    const containsEmptyLabel = hasEmptyLabel(nodes);
    const duplicateNames = checkDuplicateNames(nodes);

    if (!templateName) {
      handleSaveError('specifyTemplateName');
      return;
    }

    if (containsEmptyLabel) {
      handleSaveError('emptyLabels');
      return;
    }

    if (duplicateNames) {
      handleSaveError('duplicateElements', { names: duplicateNames });
      return;
    }

    const template = filterNodesEdges(nodes, edges);
    if (template.filteredNodes.length === 0) {
      handleSaveError('noObject');
      return;
    }

    if (template.haveMultipleObjects) {
      handleSaveError('onlyOneObject');
      return;
    }

    if (template.objectWithoutCategory) {
      handleSaveError('specifyCategory');
      return;
    }

    setTemplate(JSON.stringify({ name: templateName, nodes: template.filteredNodes, edges: template.filteredEdges }));
    setStep(1);
    setNodes(template.filteredNodes);
    setEdges(template.filteredEdges);
  };

  return (
    <>
      <BaseRow style={{ padding: '0 2rem' }}>
        <S.InstructionCard>
          <S.Header>{t('databaseSources.describeDataset.instructions.title')}</S.Header>
          <S.Content>{t('databaseSources.describeDataset.instructions.description')}</S.Content>
          <br />
          <S.ExampleLink onClick={() => setIsFormModalOpen(true)}>
            {t('databaseSources.describeDataset.instructions.example')}
          </S.ExampleLink>
        </S.InstructionCard>
      </BaseRow>
      <Spin
        spinning={saveLoading}
        indicator={<LoadingOutlined spin rev={undefined} />}
        size="large"
        style={{ width: '100%' }}
      >
        <BaseRow style={{ padding: '0 2rem' }} justify="space-between">
          <S.SidebarCol span={6}>
            <ElementSidebar />
          </S.SidebarCol>
          <S.ViewportCol span={17}>
            <BaseRow style={{ margin: '0.5rem 1rem 1rem' }}>
              <BaseCol
                style={{ paddingRight: '0.7rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                span={5}
              >
                <S.InputHeader>{t('databaseSources.describeDataset.templateName')}</S.InputHeader>
              </BaseCol>
              <BaseCol span={19}>
                <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
              </BaseCol>
            </BaseRow>
            <BaseRow>
              <ReactFlowProvider>
                <S.MapWrapper>
                  <Flow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    setNodes={setNodes}
                    setEdges={setEdges}
                  />
                </S.MapWrapper>
              </ReactFlowProvider>
            </BaseRow>
            <BaseRow style={{ padding: '1rem' }} wrap={false} hidden={nodes.length == 0}>
              <BaseCol span={12} style={{ paddingRight: '1rem' }}>
                <BaseButton
                  block
                  type="default"
                  onClick={() => {
                    setNodes([]);
                    setEdges([]);
                  }}
                >
                  {t('databaseSources.describeDataset.clear')}
                </BaseButton>
              </BaseCol>
              <BaseCol span={12} style={{ paddingLeft: '1rem' }}>
                <BaseButton block type="primary" onClick={onSaveTemplate}>
                  {t('databaseSources.describeDataset.saveTemplate')}
                </BaseButton>
              </BaseCol>
            </BaseRow>
          </S.ViewportCol>
        </BaseRow>
      </Spin>
    </>
  );
};
