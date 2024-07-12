/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { TextNode } from '@app/components/reactflow-components/TextNode/TextNode';
import { MapEdge } from '@app/components/reactflow-components/MapEdge/MapEdge';
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
import { ColumnNode } from '@app/components/reactflow-components/ColumnNode/ColumnNode';
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
  setColumnCount: (value: number) => void;
  corrTables: any[];
  setCorrTables: (value: any[]) => void;
}> = ({
  id,
  setStep,
  setIsFormModalOpen,
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  setColumnCount,
  corrTables,
  setCorrTables,
}) => {
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const [initialColumns, setInitialColumns] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [filteredColumns, setFilteredColumns] = useState<string[]>([]);
  const [reset, setReset] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const templateEdges = edges.filter((edge) => !edge.source.includes('column_') && !edge.target.includes('column_'));

  const nodeTypes = useMemo(
    () => ({ object: TextNode, category: TextNode, subcategory: TextNode, column: ColumnNode }),
    [],
  );
  const edgeTypes = useMemo(() => ({ default: MapEdge }), []);

  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<any, any> | null>(null);
  const fetch = useCallback(
    (id: string | undefined) => {
      getDbColumns(id).then((res) => {
        if (isMounted.current) {
          const resCols = Object.keys(res);
          setCorrTables(res);
          setColumns(resCols);
          setInitialColumns(resCols);
          setFilteredColumns(resCols);
          setColumnCount(resCols.length);
        }
      });
    },
    [isMounted, setColumnCount, setCorrTables],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      function isValidEdge(source: Node, target: Node) {
        if (!source || !target || source.type === target.type) return false;

        const isObject = (node: Node) => node?.type == 'object';
        const isColumn = (node: Node) => node?.type == 'column';

        if (isObject(source) || isObject(target) || !(isColumn(source) || isColumn(target))) {
          return false;
        }

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
            if (isColumn(edgeSource) || isColumn(edgeTarget)) {
              if (isColumn(source) && (edgeSource.id == source.id || edgeTarget.id == source.id)) return false;
              if (isColumn(target) && (edgeSource.id == target.id || edgeTarget.id == target.id)) return false;
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
      const getCurrentColumns = (columns: string[]) => {
        return columns.filter((column) => !parsed.includes(column));
      };

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
            id: `column_${label}_${nodes.length + i}`,
            type: 'column',
            position,
            data: { label: label },
          };
          allNewNodes.push(newNode);
          positionOffset += 100;
        }
        setNodes((nds: Node[]) => nds.concat(allNewNodes));
        setColumns(getCurrentColumns(columns));
        if (getCurrentColumns(filteredColumns).length == 0) {
          setFilteredColumns(getCurrentColumns(columns));
          setSearchValue('');
        } else {
          setFilteredColumns(getCurrentColumns(filteredColumns));
        }
      }
    },
    [columns, filteredColumns, nodes.length, reactFlowInstance, setNodes],
  );

  function handleNodesChange(changes: NodeChange[]) {
    const nextChanges = changes.reduce((acc, change) => {
      if (change.type === 'remove') {
        const node = nodes.find((n) => n.id == change.id);

        if (node?.type == 'column') {
          setColumns([...columns, node.data.label]);
          if (searchValue && node.data.label.toLowerCase().includes(searchValue.toLowerCase())) {
            setFilteredColumns([...filteredColumns, node.data.label]);
          } else {
            setFilteredColumns([...columns, node.data.label]);
          }
          return [...acc, change];
        }

        return acc;
      }

      return [...acc, change];
    }, [] as NodeChange[]);

    onNodesChange(nextChanges);
  }

  function handleEdgesChange(changes: EdgeChange[]) {
    const nextChanges = changes.filter((change) => {
      if (change.type === 'remove') {
        const edge = edges.find((edge) => edge.id == change.id);

        if (edge) {
          const sourceNode = nodes.find((node) => node.id === edge.source);
          const targetNode = nodes.find((node) => node.id === edge.target);
          if (sourceNode?.type !== 'column' && targetNode?.type !== 'column') {
            return false;
          }
        }
      }
      return true;
    });

    onEdgesChange(nextChanges);
  }

  const onSaveMapping = () => {
    if (columns.length < initialColumns.length) {
      setStep(2);
    } else {
      notificationController.error({
        message: t('databaseSources.describeDataset.notify.mapSingleColumn'),
      });
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
          <ColumnSidebar
            filteredColumns={filteredColumns}
            setFilteredColumns={setFilteredColumns}
            columns={columns}
            corrTables={corrTables}
            reset={reset}
            setReset={setReset}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </S.SidebarCol>
        <S.ViewportCol span={17}>
          <BaseRow>
            <ReactFlowProvider>
              <S.MapWrapper>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={handleNodesChange}
                  onEdgesChange={handleEdgesChange}
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
                  setNodes(nodes.filter((node) => node.type !== 'column'));
                  setColumns(initialColumns);
                  setFilteredColumns(initialColumns);
                  setEdges(templateEdges);
                  setReset(true);
                }}
              >
                {t('databaseSources.describeDataset.reset')}
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
