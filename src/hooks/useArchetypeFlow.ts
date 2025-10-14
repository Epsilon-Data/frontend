// hooks/useFlowEngine.ts
import { Dispatch, SetStateAction, useCallback, useRef, useState, DragEvent } from 'react';
import type { Connection, Edge, Node, ReactFlowInstance } from 'reactflow';
import { addEdge } from 'reactflow';
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

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow');
      if (typeof type !== 'string' || !rf) return;

      const position = rf.screenToFlowPosition({ x: e.clientX, y: e.clientY });
      setNodes((nds) =>
        nds.concat({
          id: nextId(),
          type,
          position,
          data: { label: t(`project.createTemplate.form.step2.sidebar.${type}`) },
        }),
      );
    },
    [rf, setNodes, nextId, t],
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
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
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
    onDrop,
    onDragOver,
    onNodesDelete,
    setReactFlowInstance: setRf,
    options: ctx.options,
    bgVariant: ctx.bgVariant,
  };
}
