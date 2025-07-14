/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';

import * as S from './Step3.styles';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import { Edge, Node } from 'reactflow';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useNavigate } from 'react-router-dom';
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { createArchetype } from '@app/api/archetypes.api';

function createNodeColumnMapping(nodes: Node[], edges: Edge[]) {
  const columnNodeId = nodes.filter((node) => node.type == 'column').map((node) => node.id);
  const filteredEdges = edges.filter(
    (edge) => columnNodeId.includes(edge.source) || columnNodeId.includes(edge.target),
  );

  if (filteredEdges.length == 0) {
    return null;
  }

  const result: { nodeId: string; nodeName: string; nodeType: string | undefined; columns: string[] }[] = [];
  const isColumn = (node: Node) => node?.type == 'column';
  filteredEdges.forEach((edge) => {
    const source = nodes.find((node) => node.id == edge.source);
    const target = nodes.find((node) => node.id == edge.target);
    if (source && target) {
      const isAppended = result.some(
        (obj) => obj.nodeName === (isColumn(source) ? target.data.label : source.data.label),
      );
      if (!isAppended) {
        result.push({
          nodeId: isColumn(source) ? target.id : source.id,
          nodeName: isColumn(source) ? target.data.label : source.data.label,
          nodeType: isColumn(source) ? target.type : source.type,
          columns: [isColumn(source) ? source.data.label : target.data.label],
        });
      } else {
        const index = result.findIndex(
          (obj) => obj.nodeName === (isColumn(source) ? target.data.label : source.data.label),
        );
        result[index].columns.push(isColumn(source) ? source.data.label : target.data.label);
      }
    }
  });

  return result;
}

function transformColumns(nodeMap: any[], tableMap: { [key: string]: string }) {
  return nodeMap.map((category) => {
    const transformedColumns = category.columns.map((column: string) => {
      return {
        name: column,
        table: tableMap[column],
      };
    });
    return {
      ...category,
      columns: transformedColumns,
    };
  });
}

export const Step3: React.FC<{
  id: string | undefined;
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
  setSaveDescription: (value: string) => void;
  setStep: (value: number) => void;
  columnCount: number;
  corrTables: any;
  template: string;
}> = ({ id, nodes, edges, setNodes, setEdges, setSaveDescription, setStep, columnCount, corrTables, template }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [mappingSuccess, setMappingSuccess] = useState(false);
  const [message, setMessage] = useState(t('databaseSources.describeDataset.message.saving'));
  const [messageDescription, setMessageDescription] = useState(
    t('databaseSources.describeDataset.message.mappingFailedDescription'),
  );
  const navigate = useNavigate();
  const subcategoryNodes = nodes.filter((node) => node.type == 'subcategory');
  const categoryNodes = nodes.filter((node) => node.type == 'category');

  useEffect(() => {
    if (!loading) return;
    setSaveDescription(t('databaseSources.describeDataset.step3Description.loading'));
    const result = createNodeColumnMapping(nodes, edges);
    const totalColumns = result?.reduce((total, obj) => total + obj.columns.length, 0);
    let metSubcatCriteria = true;
    let metCatCriteria = true;

    if (result != null) {
      // Check subcategory nodes
      for (const subcategoryNode of subcategoryNodes) {
        const subcategoryNodeResult = result.find(
          (r) => r.nodeId === subcategoryNode.id && r.nodeType === 'subcategory',
        );
        if (!subcategoryNodeResult || subcategoryNodeResult.columns.length <= 1) {
          metSubcatCriteria = false;
          break;
        }
      }

      // Check category nodes without subcategory edges
      for (const categoryNode of categoryNodes) {
        const connectedSubcategoryEdges = edges.filter(
          (edge) =>
            (edge.source === categoryNode.id || edge.target === categoryNode.id) &&
            (subcategoryNodes.some((subcategoryNode) => subcategoryNode.id === edge.target) ||
              subcategoryNodes.some((subcategoryNode) => subcategoryNode.id === edge.source)),
        );
        if (connectedSubcategoryEdges.length === 0) {
          const categoryNodeResult = result.find((r) => r.nodeId === categoryNode.id);
          if (!categoryNodeResult) {
            metCatCriteria = false;
            break;
          }
        }
      }
    }

    if (result === null || totalColumns == 0) {
      setMappingSuccess(false);
      setMessage(t('databaseSources.describeDataset.message.columnsNotConnected'));
      setSaveDescription(t('databaseSources.describeDataset.step3Description.fail'));
    } else if (!metSubcatCriteria) {
      setMappingSuccess(false);
      setMessage(t('databaseSources.describeDataset.message.subcatCriteria'));
      setSaveDescription(t('databaseSources.describeDataset.step3Description.fail'));
    } else if (!metCatCriteria) {
      setMappingSuccess(false);
      setMessage(t('databaseSources.describeDataset.message.catCriteria'));
      setSaveDescription(t('databaseSources.describeDataset.step3Description.fail'));
    } else {
      const formattedResult = transformColumns(result, corrTables);
      createArchetype({ projectId: id ?? null, name: JSON.stringify(formattedResult), template })
        .then(() => {
          setMappingSuccess(true);
          setMessage(t('databaseSources.describeDataset.message.mappingSuccess'));
          setMessageDescription(t('databaseSources.describeDataset.message.mappingSuccessDescription'));
          setSaveDescription(t('databaseSources.describeDataset.step3Description.success'));
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setMappingSuccess(false);
          setMessage(t('databaseSources.describeDataset.message.saveFailed'));
          setMessageDescription(t('databaseSources.describeDataset.message.saveFailedDescription'));
          setSaveDescription(t('databaseSources.describeDataset.step3Description.fail'));
          setLoading(false);
        });
    }
    return;
  }, [
    nodes,
    edges,
    t,
    id,
    setSaveDescription,
    columnCount,
    subcategoryNodes,
    categoryNodes,
    corrTables,
    loading,
    template,
  ]);

  const handleBackToStep = (stepNum: number) => {
    setNodes(nodes.filter((node) => node.type !== 'column'));
    setEdges(edges.filter((edge) => !edge.source.includes('column_') && !edge.target.includes('column_')));
    setStep(stepNum);
  };

  return (
    <BaseRow style={{ padding: '0 2rem' }} justify="space-between">
      <S.DisplayCol span={24}>
        <S.ContentRow style={{ marginTop: '4rem' }}>
          {loading && <BaseSpin size="large" />}
          {!loading && mappingSuccess && (
            <FaRegCheckCircle style={{ color: 'var(--green)', width: '30%', height: '30%' }} />
          )}
          {!loading && !mappingSuccess && (
            <FaRegTimesCircle style={{ color: 'var(--red)', width: '30%', height: '30%' }} />
          )}
        </S.ContentRow>
        <S.ContentRow style={{ display: 'block', textAlign: 'center' }}>
          <S.Message
            style={{
              color: loading ? 'var(--secondary-color)' : mappingSuccess ? 'var(--green)' : 'var(--red)',
            }}
          >
            {message}
          </S.Message>
          <S.MessageDescription hidden={loading}>{messageDescription}</S.MessageDescription>
        </S.ContentRow>
        <S.ContentRow>
          {!loading && mappingSuccess && (
            <>
              <BaseCol span={12} style={{ paddingRight: '1rem' }}>
                <BaseButton block type="primary" onClick={() => navigate(`/database-sources/access-permissions/${id}`)}>
                  {t('databaseSources.accessPermissions.title')}
                </BaseButton>
              </BaseCol>
              <BaseCol span={12} style={{ paddingLeft: '1rem' }}>
                <BaseButton block type="primary">
                  {t('databaseSources.describeDataset.viewTemplates')}
                </BaseButton>
              </BaseCol>
            </>
          )}
          {!loading && !mappingSuccess && (
            <>
              <BaseCol span={12} style={{ paddingRight: '1rem' }}>
                <BaseButton block type="primary" onClick={() => handleBackToStep(0)}>
                  {t('databaseSources.describeDataset.backToStep1')}
                </BaseButton>
              </BaseCol>
              <BaseCol span={12} style={{ paddingLeft: '1rem' }}>
                <BaseButton block type="primary" onClick={() => handleBackToStep(1)}>
                  {t('databaseSources.describeDataset.backToStep2')}
                </BaseButton>
              </BaseCol>
            </>
          )}
        </S.ContentRow>
      </S.DisplayCol>
    </BaseRow>
  );
};
