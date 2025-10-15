// hooks/useFlowEngine.ts
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import type { Connection, Edge, FinalConnectionState, Node, ReactFlowInstance } from '@xyflow/react';
import { addEdge } from '@xyflow/react';
import { useArchetypeFlowContext } from '@app/hooks/useArchetypeFlowContext';

export function useNodeIdCounter(initial = 0) {
  const ref = useRef(initial);
  return () => `${ref.current++}`;
}

export function useArchetypeFlow(params: {
  nodes: Node[];
  edges: Edge[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}) {
  const { nodes, edges, setNodes, setEdges } = params;
  const ctx = useArchetypeFlowContext();
  const nextId = useNodeIdCounter(nodes.length);
  const [rf, setRf] = useState<ReactFlowInstance>({} as ReactFlowInstance);

  const onConnect = useCallback((p: Edge | Connection) => setEdges((eds) => addEdge(p, eds)), [setEdges]);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (!connectionState.isValid) {
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
    [nextId, rf, setEdges, setNodes],
  );

  return {
    nodes,
    edges,
    nodeTypes: ctx.nodeTypes,
    edgeTypes: ctx.edgeTypes,
    onConnect,
    onConnectEnd,
    setReactFlowInstance: setRf,
    options: ctx.options,
    bgVariant: ctx.bgVariant,
  };
}
