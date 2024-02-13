/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import * as S from './Step2.styles';
import { getDbColumns } from '@app/api/databaseSources.api';
import { ColumnSidebar } from './ColumnSidebar/ColumnSidebar';
import { useMounted } from '@app/hooks/useMounted';
import { ColumnNode } from '../../ColumnNode/ColumnNode';
import { notificationController } from '@app/controllers/notificationController';

export const Step2: React.FC<{
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
  const { isMounted } = useMounted();
  const [columns, setColumns] = useState<string[]>([]);
  const nodeTypes = useMemo(
    () => ({ object: TextNode, category: TextNode, subcategory: TextNode, column: ColumnNode }),
    [],
  );
  const edgeTypes = useMemo(() => ({ default: MapEdge }), []);

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<any, any> | null>(null);

  const fetch = useCallback(
    (id: string | undefined) => {
      getDbColumns(id).then((res) => {
        if (isMounted.current) {
          setColumns(res);
        }
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

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
          edgeSource?.id === node.id || edgeTarget?.id === node.id ? false : true;

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

      const data = event.dataTransfer.getData('application/reactflow');

      if (typeof data === 'undefined' || !data) {
        return;
      }

      const parsed = JSON.parse(data);

      if (reactFlowInstance) {
        const allNewNodes: Node[] = [];
        let positionOffset = 0;
        for (let i = 0; i < parsed.length; i++) {
          const label = parsed[i];
          const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY + positionOffset,
          });
          const newNode = {
            id: `${label}_${nodes.length + i}`,
            type: 'column',
            position,
            data: { label: label },
          };
          allNewNodes.push(newNode);
          positionOffset += 100;
        }
        setNodes((nds: Node[]) => nds.concat(allNewNodes));
      }
    },
    [nodes, reactFlowInstance, setNodes],
  );

  const onConnectStart = (event: { preventDefault: () => void }, { nodeId }: any) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node && node.connectable === false) {
      event.preventDefault();
    }
  };

  const onSaveMapping = () => {
    if (columns.length == 0) {
      setStep(2);
    } else {
      notificationController.error({
        message: t('databaseSources.describeDataset.mapAllColumnsNotify'),
      });
      setStep(2);
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
          <ColumnSidebar columns={columns} setColumns={setColumns} />
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
                  onConnectStart={onConnectStart}
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
              <BaseButton block type="primary" onClick={onSaveMapping}>
                {t('databaseSources.describeDataset.saveMapping')}
              </BaseButton>
            </BaseCol>
          </BaseRow>
        </S.ViewportCol>
      </BaseRow>
    </>
  );
};
