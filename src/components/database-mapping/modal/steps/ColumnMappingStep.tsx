import { ArchetypeFlow } from '@app/components/reactflow-components/ArchetypeFlow/ArchetypeFlow';
import { ColumnToolbar } from '@app/components/reactflow-components/ColumnToolbar/ColumnToolbar';
import { Anchor } from '@app/components/reactflow-components/ColumnToolbar/ReactflowBridge/ReactflowBridge';
import { computeNextColumnPosition } from '@app/constants/reactflow/mappingHelpers';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, Edge, NodeChange, EdgeChange, addEdge } from '@xyflow/react';

type ColumnMappingStepProps = {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: (value: NodeChange[]) => void;
  onEdgesChange: (value: EdgeChange[]) => void;
  columns: string[];
  setColumns: React.Dispatch<React.SetStateAction<string[]>>;
  name: string;
};

export const ColumnMappingStep = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  columns,
  setColumns,
  name,
}: ColumnMappingStepProps) => {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<Anchor>(null);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const lastSelectedIdRef = useRef<string | null>(null);

  const connectedColumnCount = useMemo(() => {
    if (!anchor) return 0;
    const subcatId = anchor.selectedId;

    return edges.reduce((count, e) => {
      if (e.source !== subcatId && e.target !== subcatId) return count;
      const otherId = e.source === subcatId ? e.target : e.source;
      const other = nodes.find((n) => n.id === otherId);
      return other?.type === 'column' ? count + 1 : count;
    }, 0);
  }, [anchor, edges, nodes]);

  const toolbarDisabled = !!anchor && connectedColumnCount >= 1;
  const disabledMessage = toolbarDisabled ? t('project.createTemplate.form.step3.toolbar.error.nodeMapped') : undefined;

  useEffect(() => {
    if (!anchor) {
      setToolbarOpen(false);
      lastSelectedIdRef.current = null;
      return;
    }
    if (anchor.selectedId !== lastSelectedIdRef.current) {
      setToolbarOpen(true);
      lastSelectedIdRef.current = anchor.selectedId;
    }
  }, [anchor]);

  const handlePick = useCallback(
    (colName: string) => {
      if (!anchor || toolbarDisabled) return;
      const nodeId = anchor.selectedId;
      const fromNode = nodes.find((n) => n.id === nodeId);
      const parentLevel = (fromNode?.data as { level: number })?.level ?? 0;

      const baseX = anchor.flowPos.x;
      const baseY = anchor.flowPos.y;

      const { x, y } = computeNextColumnPosition(nodeId, nodes, edges, baseX, baseY);

      const colId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `col_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

      setNodes((nds) =>
        nds.concat({
          id: colId,
          type: 'column',
          position: { x, y },
          data: { label: colName, level: parentLevel + 1 },
        } as Node),
      );

      setEdges((eds) =>
        addEdge({ id: `edge_${nodeId}_${colId}`, source: nodeId, target: colId, type: 'default' }, eds),
      );

      setColumns((prev) => prev.filter((c) => c !== colName));
    },
    [anchor, toolbarDisabled, nodes, edges, setNodes, setEdges, setColumns],
  );

  const addBackColumn = useCallback(
    (name?: string) => {
      if (!name) return;
      setColumns((prev) => (prev.includes(name) ? prev : [...prev, name]));
    },
    [setColumns],
  );

  const isColumn = (n?: Node) => n?.type === 'column';
  const isCategory = (n?: Node) => n?.type === 'category';

  const handleEdgesChangeMapping = useCallback(
    (changes: EdgeChange[]) => {
      const toAddBack: string[] = [];

      const byId = new Map(nodes.map((n) => [n.id, n as Node]));

      for (const c of changes) {
        if (c.type !== 'remove') continue;

        const removed = edges.find((e) => e.id === c.id);
        if (!removed) continue;

        const s = byId.get(removed.source);
        const t = byId.get(removed.target);

        const columnNode = isColumn(s) ? s : isColumn(t) ? t : undefined;
        const otherNode = columnNode === s ? t : s;

        if (columnNode && isCategory(otherNode)) {
          const name = typeof columnNode.data?.label === 'string' ? columnNode.data.label : undefined;
          if (name) toAddBack.push(name);
        }
      }

      onEdgesChange(changes);
      toAddBack.forEach(addBackColumn);
    },
    [edges, nodes, onEdgesChange, addBackColumn],
  );

  const handleNodesChangeMapping = useCallback(
    (changes: NodeChange[]) => {
      const toAddBack: string[] = [];
      for (const c of changes) {
        if (c.type !== 'remove') continue;
        const removedNode = nodes.find((n) => n.id === c.id);
        if (removedNode?.type === 'column') {
          const name = typeof removedNode.data?.label === 'string' ? removedNode.data.label : undefined;
          if (name) toAddBack.push(name);
        }
      }
      onNodesChange(changes);
      toAddBack.forEach(addBackColumn);
    },
    [nodes, onNodesChange, addBackColumn],
  );

  const handleToolbarClose = useCallback(() => {
    setToolbarOpen(false);
    if (anchor) {
      const id = anchor.selectedId;
      setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, selected: false } : n)));
    }
  }, [anchor, setNodes, setToolbarOpen]);

  return (
    <div className="h-[33rem] overflow-y-auto flex flex-col justify-center bg-grey-4">
      <div className="flex flex-col bg-white">
        <div className="relative isolate h-[33rem] w-full overflow-hidden">
          <ArchetypeFlow
            name={name}
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChangeMapping}
            onEdgesChange={handleEdgesChangeMapping}
            setNodes={setNodes}
            setEdges={setEdges}
            onAnchorChange={setAnchor}
            mode="mapping"
          />
          {anchor && toolbarOpen && (
            <ColumnToolbar
              columns={columns}
              disabled={!anchor || toolbarDisabled}
              disabledMessage={disabledMessage}
              style={{ left: anchor.left, top: anchor.top }}
              onPick={handlePick}
              onClose={handleToolbarClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};
