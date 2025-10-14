// hooks/useFlowEngine.ts
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import type { Connection, Edge, Node, ReactFlowInstance } from '@xyflow/react';
import { addEdge } from '@xyflow/react';
import { useArchetypeFlowContext } from '@app/hooks/useArchetypeFlowContext';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

export function useNodeIdCounter(initial = 0) {
  const ref = useRef(initial);
  return () => `node_${ref.current++}`;
}

export function useArchetypeFlow(params: {
  nodes: Node[];
  edges: Edge[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}) {
  const { nodes, edges, setNodes, setEdges } = params;
  const ctx = useArchetypeFlowContext();
  const [rf, setRf] = useState<ReactFlowInstance | null>(null);
  const nextId = useNodeIdCounter(nodes.length);
  const { t } = useTranslation();
  const ROOT_ID = 'root';

  const onConnect = useCallback(
    (p: Edge | Connection) => {
      const source = nodes.find((n) => n.id === p.source);
      const target = nodes.find((n) => n.id === p.target);
      if (!source || !target) return;
      if (!ctx.isValidEdge(source, target, edges)) return;

      if (source && target && ctx.onConnectPost) {
        ctx.onConnectPost({ source, target, setEdges });
      }
      setEdges((eds) => addEdge(p, eds));
    },
    [nodes, edges, setEdges, ctx],
  );

  const onNodesDelete = (deletedNodes: Node[]) => {
    const includesRoot = deletedNodes.some((n) => n.id === ROOT_ID);
    if (includesRoot) {
      setNodes((nds) => [...nds, nodes.find((n) => n.id === ROOT_ID)!]);
      message.error(t('project.createTemplate.form.step2.error.deleteRoot'));
    }
  };

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (rf) {
        const id = nextId();
        console.log(event);

        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          position: rf.screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node ${id}`, level: 1 },
          type: 'edit',
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({ id, source: ROOT_ID, target: id }));
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
    onNodesDelete,
    setReactFlowInstance: setRf,
    options: ctx.options,
    bgVariant: ctx.bgVariant,
  };
}
