/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { TextNode } from '../../TextNode/TextNode';
import { MapEdge } from '../../MapEdge/MapEdge';
import ReactFlow, {
  Connection,
  Edge,
  ReactFlowInstance,
  Node,
  addEdge,
  ReactFlowProvider,
  Controls,
  Background,
  BackgroundVariant,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import { useTranslation } from 'react-i18next';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import * as S from './Step1.styles';
import { notificationController } from '@app/controllers/notificationController';
import { addDbTemplate } from '@app/api/databaseSources.api';
import { ElementSidebar } from './ElementSidebar/ElementSidebar';

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
function convertToHierarchy(nodes: Node[], edges: Edge[]) {
  const hierarchy: { object: { name: any; categories: { name: string; subcategories: { name: string }[] }[] } }[] = [];
  const filteredNodes = [];
  const filteredEdges = [];

  for (const node of nodes) {
    if (node.type === 'object') {
      const objectNode = {
        object: {
          name: node.data.label,
          categories: [] as { name: string; subcategories: { name: string }[] }[],
        },
      };
      filteredNodes.push(node);
      for (const edge of edges) {
        if (edge.source === node.id) {
          const targetNode = nodes.find((n) => n.id === edge.target);

          if (targetNode) {
            const categoryNode = {
              name: targetNode.data.label,
              subcategories: [] as { name: string }[],
            };
            filteredNodes.push(targetNode);
            filteredEdges.push(edge);
            for (const subEdge of edges) {
              if (subEdge.source === targetNode.id) {
                const subcategoryNode = nodes.find((n) => n.id === subEdge.target);

                if (subcategoryNode) {
                  categoryNode.subcategories.push({ name: subcategoryNode.data.label });
                  filteredNodes.push(subcategoryNode);
                  filteredEdges.push(subEdge);
                }
              }
            }

            objectNode.object.categories.push(categoryNode);
          }
        } else if (edge.target === node.id) {
          const sourceNode = nodes.find((n) => n.id === edge.source);

          if (sourceNode) {
            const categoryNode = {
              name: sourceNode.data.label,
              subcategories: [] as { name: string }[],
            };
            filteredNodes.push(sourceNode);
            filteredEdges.push(edge);
            for (const subEdge of edges) {
              if (subEdge.source === sourceNode.id) {
                const subcategoryNode = nodes.find((n) => n.id === subEdge.target);

                if (subcategoryNode) {
                  categoryNode.subcategories.push({ name: subcategoryNode.data.label });
                  filteredNodes.push(subcategoryNode);
                  filteredEdges.push(subEdge);
                }
              }
            }

            objectNode.object.categories.push(categoryNode);
          }
        }
      }

      hierarchy.push(objectNode);
    }
  }

  return { hierarchy, filteredNodes, filteredEdges };
}

export const Step1: React.FC<{
  id: string | undefined;
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
}> = ({ id, setStep, setIsFormModalOpen, nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange }) => {
  const { t } = useTranslation();
  const nodeTypes = useMemo(() => ({ object: TextNode, category: TextNode, subcategory: TextNode }), []);
  const edgeTypes = useMemo(() => ({ default: MapEdge }), []);

  let nodeId = 0;
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<any, any> | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      function isValidEdge(source: Node, target: Node) {
        if (!source || !target || source.type === target.type) return false;

        const isCategory = (node: Node) => node?.type === 'category';
        const isObject = (node: Node) => node?.type === 'object';
        const isSubcategory = (node: Node) => node?.type === 'subcategory';

        if ((isObject(source) || isObject(target)) && (isSubcategory(source) || isSubcategory(target))) {
          return false;
        }

        const isInvalidEdge = (edgeSource: Node, edgeTarget: Node, node: Node) =>
          edgeSource?.type === node.type || edgeTarget?.type === node.type ? false : true;

        const relatedEdges = edges.filter(
          (edge) =>
            edge.source === source.id ||
            edge.target === target.id ||
            edge.source === target.id ||
            edge.target === source.id,
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
      const sourceNode = nodes.find((n) => n.id == params.source);
      const targetNode = nodes.find((n) => n.id == params.target);

      if (sourceNode && targetNode && isValidEdge(sourceNode, targetNode)) {
        setEdges((eds: Edge[]) => addEdge(params, eds));
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
          id: `dndnode_${nodeId++}`,
          type,
          position,
          data: { label: t('databaseSources.describeDataset.elementSidebar.' + type) },
        };

        setNodes((nds: Node[]) => nds.concat(newNode));
      }
    },
    [nodeId, reactFlowInstance, setNodes, t],
  );

  const onSaveTemplate = () => {
    const duplicateNames = checkDuplicateNames(nodes);
    if (duplicateNames) {
      notificationController.error({
        message: t('databaseSources.describeDataset.duplicateElementsNotify', { names: duplicateNames }),
      });
    } else {
      const template = convertToHierarchy(nodes, edges);
      if (template.hierarchy.length !== 0) {
        addDbTemplate(id, JSON.stringify(template.hierarchy)).then(() => {
          setStep(1);
          setNodes(template.filteredNodes);
          setEdges(template.filteredEdges);
        });
      } else {
        notificationController.error({
          message: t('databaseSources.describeDataset.noObjectNotify'),
        });
      }
    }
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
      <BaseRow style={{ padding: '0 2rem' }} justify="space-between">
        <S.SidebarCol span={6}>
          <ElementSidebar />
        </S.SidebarCol>
        <S.ViewportCol span={17}>
          <BaseRow>
            <ReactFlowProvider>
              <S.MapWrapper ref={reactFlowWrapper}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onInit={setReactFlowInstance}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  nodeOrigin={[0.5, 0.5]}
                  fitView
                  fitViewOptions={{ maxZoom: 1.2 }}
                >
                  <Controls />
                  <Background color="#f1f1f1" variant={BackgroundVariant.Cross} />
                </ReactFlow>
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
    </>
  );
};
