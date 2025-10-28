import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import type { Connection, Edge, FinalConnectionState, Node, ReactFlowInstance } from '@xyflow/react';
import { addEdge } from '@xyflow/react';
import { useArchetypeFlowContext } from '@app/hooks/useArchetypeFlowContext';
import { FlowMode } from '@app/context/ArchetypeFlow';

export function useNodeIdCounter(initial = 0) {
  const ref = useRef(initial);
  return () => `${ref.current++}`;
}

type useArchetypeFlowProps = {
  nodes: Node[];
  edges: Edge[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  mode: FlowMode;
};

export function useArchetypeFlow(params: useArchetypeFlowProps) {
  const { nodes, edges, setNodes, setEdges, mode } = params;
  const ctx = useArchetypeFlowContext();
  const nextId = useNodeIdCounter(nodes.length);
  const [rf, setRf] = useState<ReactFlowInstance>({} as ReactFlowInstance);

  const isMapping = mode == 'mapping';
  const isReadonly = mode == 'readonly';

  const isValidConnection = useCallback(
    (p?: Edge | Connection) => {
      if (!isMapping) return false;
      if (!p) return true;

      return p.source !== p.target;
    },
    [isMapping],
  );

  const onConnect = useCallback(
    (p: Edge | Connection) => {
      if (isReadonly) return;
      if (p.source === p.target) return;
      setEdges((eds) => addEdge(p, eds));
    },
    [isReadonly, setEdges],
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (!connectionState.isValid) {
        if (!isMapping) return;
        const id = nextId();

        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        const fromNode = connectionState.fromNode;
        if (!fromNode) return;
        const newNodeId = `node_${id}`;
        const newNode = {
          id: newNodeId,
          position: rf.screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Category ${id}`, level: (fromNode.data as { level: number }).level + 1 },
          type: 'category',
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id: `edge_${fromNode.id}_${newNodeId}`, source: fromNode.id, target: newNodeId }),
        );
      }
    },
    [isMapping, nextId, rf, setEdges, setNodes],
  );

  return {
    nodes,
    edges,
    nodeTypes: ctx.nodeTypes,
    edgeTypes: ctx.edgeTypes,
    onConnect,
    onConnectEnd,
    isValidConnection,
    nodesConnectable: isMapping,
    setReactFlowInstance: setRf,
    options: ctx.options,
    bgVariant: ctx.bgVariant,
  };
}
