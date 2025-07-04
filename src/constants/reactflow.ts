/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapEdge } from '@app/components/reactflow-components/MapEdge/MapEdge';
import { TextNode } from '@app/components/reactflow-components/TextNode/TextNode';
import { Dispatch, SetStateAction } from 'react';
import { BackgroundVariant, Edge, Node, EdgeChange, NodeChange } from 'reactflow';

export const MIN_DISTANCE = 160;
export const BG_VARIANT = BackgroundVariant.Dots;

export const EDGE_TYPES = {
  default: MapEdge,
};

export interface FlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (value: NodeChange[]) => void;
  onEdgesChange: (value: EdgeChange[]) => void;
  setNodes: Dispatch<SetStateAction<Node<{ label: string }, string | undefined>[]>>;
  setEdges: Dispatch<SetStateAction<Edge<any>[]>>;
}

export const createNodeTypes = (nodeType = TextNode, overrides = {}) => ({
  object: nodeType,
  category: nodeType,
  subcategory: nodeType,
  ...overrides,
});

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

export const nodeDragStop = (_: any, node: any, nodes: any, edges: any, setEdges: any) => {
  const closeEdge = closestEdge(node, nodes);

  setEdges((es: any) => {
    const nextEdges = es.filter((e: any) => e.className !== 'temp');
    const isTempEdge = es.filter((e: any) => e.className === 'temp').some((e: any) => e.id === closeEdge?.id);

    if (
      closeEdge &&
      isValidEdge(
        nodes.find((n: any) => n.id === closeEdge.source),
        nodes.find((n: any) => n.id === closeEdge.target),
        nodes,
        edges,
      ) &&
      !nextEdges.find((ne: any) => ne.source === closeEdge.source && ne.target === closeEdge.target) &&
      isTempEdge
    ) {
      return [...nextEdges, closeEdge];
    }

    return nextEdges;
  });
};
