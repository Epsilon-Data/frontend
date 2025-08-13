/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultNode } from '@app/components/reactflow-components/DefaultNode/DefaultNode';
import { TextNode } from '@app/components/reactflow-components/TextNode/TextNode';
import { ColumnNode } from '@app/components/reactflow-components/ColumnNode/ColumnNode';
import { SubcategoryNode } from '@app/components/reactflow-components/SubcategoryNode/SubcategoryNode';
import { Dispatch, SetStateAction } from 'react';
import { BackgroundVariant, Edge, Node, EdgeChange, NodeChange } from 'reactflow';

export const MIN_DISTANCE = 160;
export const BG_VARIANT = BackgroundVariant.Dots;

export interface NodeData {
  label: string;
}

const validConnections: Record<string, string[]> = {
  object: ['category'],
  category: ['subcategory'],
  subcategory: ['column'],
  column: ['subcategory'],
};

export const editableNodeTypes = {
  object: TextNode,
  category: TextNode,
  subcategory: TextNode,
};

export const mappingNodeTypes = {
  object: DefaultNode,
  category: DefaultNode,
  subcategory: SubcategoryNode,
  column: ColumnNode,
};

export const readonlyNodeTypes = {
  object: DefaultNode,
  category: DefaultNode,
  subcategory: DefaultNode,
};

export function getHandleConfig(type: string) {
  return {
    showSource: type === 'object' || type === 'category' || type === 'column',
    showTarget: type === 'category' || type === 'subcategory',
  };
}

export interface FlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (value: NodeChange[]) => void;
  onEdgesChange: (value: EdgeChange[]) => void;
  setNodes: Dispatch<SetStateAction<Node<{ label: string }, string | undefined>[]>>;
  setEdges: Dispatch<SetStateAction<Edge<any>[]>>;
}

export const createNodeTypes = (mode: 'mapping' | 'readonly' | 'editable') => {
  if (mode === 'mapping') {
    return mappingNodeTypes;
  } else if (mode === 'readonly') {
    return readonlyNodeTypes;
  } else {
    return editableNodeTypes;
  }
};

export const REACT_FLOW_OPTIONS = {
  fitView: true,
  fitViewOptions: { maxZoom: 1 },
  nodeOrigin: [0.5, 0.5],
};

const closestEdge = (node: any, nodes: any) => {
  const internalNode = nodes.find((n: any) => n.id === node.id);

  const closestNode: any = nodes.reduce(
    (res: any, n: any) => {
      if (n.id !== internalNode.id) {
        const dx = n.position.x - internalNode.position.x;
        const dy = n.position.y - internalNode.position.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < res.distance && d < MIN_DISTANCE) {
          res.distance = d;
          res.node = n;
        }
      }

      return res;
    },
    {
      distance: Number.MAX_VALUE,
      node: null,
    },
  );

  if (!closestNode.node) {
    return null;
  }

  const closeNodeIsSource = closestNode.node.position.x < internalNode.position.x;

  const result = {
    id: closeNodeIsSource
      ? `reactflow__edge-${closestNode.node.id}-${node.id}`
      : `reactflow__edge-${node.id}-${closestNode.node.id}`,
    source: closeNodeIsSource ? closestNode.node.id : node.id,
    target: closeNodeIsSource ? node.id : closestNode.node.id,
  };
  return result;
};

export const nodeDrag = (_: any, node: any, nodes: any, setEdges: any, edges: any) => {
  const closeEdge: { id: string; source: any; target: any; className?: string } | null = closestEdge(node, nodes);

  setEdges((es: any) => {
    const nextEdges = es.filter((e: any) => e.className !== 'temp');
    const edgeSource = nodes.find((n: any) => n.id === closeEdge?.source);
    const edgeTarget = nodes.find((n: any) => n.id === closeEdge?.target);

    if (
      closeEdge &&
      !nextEdges.find((ne: any) => ne.source === closeEdge.source && ne.target === closeEdge.target) &&
      isValidEdge(edgeSource, edgeTarget, nodes, edges)
    ) {
      return [...nextEdges, { ...closeEdge, className: 'temp' }];
    }

    return nextEdges;
  });
};

export function isValidEdge(source: Node, target: Node, nodes: Node[], edges: Edge[]) {
  if (!source || !target) return false;
  if (source.id === target.id) return false;

  const edgeExists = edges.some(
    (e) => (e.source === source.id && e.target === target.id) || (e.source === target.id && e.target === source.id),
  );

  if (edgeExists) return false;

  const sourceType = source.type;
  const targetType = target.type;

  if (!sourceType || !targetType) return false;

  return validConnections[sourceType]?.includes(targetType) ?? false;
}

export const nodeDragStop = (_: any, node: any, nodes: any, edges: any, setEdges: any) => {
  const closeEdge = closestEdge(node, nodes);

  setEdges((es: any) => {
    const nextEdges = es.filter((e: any) => e.className !== 'temp');
    const isTempEdge = es.filter((e: any) => e.className === 'temp').some((e: any) => e.id === closeEdge?.id);

    if (closeEdge && isTempEdge) {
      return [...nextEdges, closeEdge];
    }

    return nextEdges;
  });
};

export function createNodeColumnMapping(nodes: Node[], edges: Edge[]) {
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

export function transformColumns(nodeMap: any[], tableMap: { [key: string]: string }) {
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
