import { ArchetypeFlow } from '@app/components/reactflow-components/ArchetypeFlow/ArchetypeFlow';
import { ColumnToolbar } from '@app/components/reactflow-components/ColumnToolbar/ColumnToolbar';
import { Anchor } from '@app/components/reactflow-components/ColumnToolbar/ReactflowBridge/ReactflowBridge';
import { computeNextColumnPosition } from '@app/utils/reactflow/helpers';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, Edge, NodeChange, EdgeChange, addEdge } from '@xyflow/react';
import { ColumnInfo } from '@app/api/database.api';
import { handleCascadeNodeChanges } from '@app/utils/reactflow/cascade';

type ColumnMappingStepProps = {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: (value: NodeChange[]) => void;
  onEdgesChange: (value: EdgeChange[]) => void;
  columns: ColumnInfo[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnInfo[]>>;
  name: string;
  onNodesDeleted?: (ids: Set<string>) => void;
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
  onNodesDeleted,
}: ColumnMappingStepProps) => {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<Anchor>(null);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const lastSelectedIdRef = useRef<string | null>(null);

  const mappedColumnIds = useMemo(() => new Set(nodes.filter((n) => n.type === 'column').map((n) => n.id)), [nodes]);

  const availableColumns = useMemo(() => columns.filter((c) => !mappedColumnIds.has(c.id)), [columns, mappedColumnIds]);

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

  const handleAnchorChange = useCallback((nextAnchor: Anchor) => {
    setAnchor(nextAnchor);

    if (!nextAnchor) {
      setToolbarOpen(false);
      lastSelectedIdRef.current = null;
      return;
    }

    if (nextAnchor.selectedId !== lastSelectedIdRef.current) {
      setToolbarOpen(true);
      lastSelectedIdRef.current = nextAnchor.selectedId;
    }
  }, []);

  const handlePick = useCallback(
    (col: ColumnInfo) => {
      if (!anchor || toolbarDisabled) return;
      const nodeId = anchor.selectedId;
      const fromNode = nodes.find((n) => n.id === nodeId);
      const parentLevel = (fromNode?.data as { level: number })?.level ?? 0;

      const baseX = anchor.flowPos.x;
      const baseY = anchor.flowPos.y;

      const { x, y } = computeNextColumnPosition(nodeId, nodes, edges, baseX, baseY);

      setNodes((nds) =>
        nds.concat({
          id: col.id,
          type: 'column',
          position: { x, y },
          data: { label: col.name, level: parentLevel + 1, table: col.table },
        } as Node),
      );

      setEdges((eds) =>
        addEdge({ id: `edge_${nodeId}_${col.id}`, source: nodeId, target: col.id, type: 'default' }, eds),
      );

      setColumns((prev) => prev.filter((c) => c.id !== col.id));

      setToolbarOpen(false);
    },
    [anchor, toolbarDisabled, nodes, edges, setNodes, setEdges, setColumns],
  );

  const addBackColumn = useCallback(
    (col?: ColumnInfo) => {
      if (!col) return;
      setColumns((prev) => (prev.some((c) => c.id === col.id) ? prev : [...prev, col]));
    },
    [setColumns],
  );

  const isColumn = (n?: Node) => n?.type === 'column';
  const isCategory = (n?: Node) => n?.type === 'category';

  const handleEdgesChangeMapping = useCallback(
    (changes: EdgeChange[]) => {
      const toAddBack: ColumnInfo[] = [];

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
          if (columnNode?.data?.label) {
            const col: ColumnInfo = {
              id: columnNode.id,
              name: typeof columnNode.data.label === 'string' ? columnNode.data.label : '',
              table: typeof columnNode.data.table === 'string' ? columnNode.data.table : '',
            };
            toAddBack.push(col);
          }
        }
      }

      onEdgesChange(changes);
      toAddBack.forEach(addBackColumn);
    },
    [edges, nodes, onEdgesChange, addBackColumn],
  );

  const handleNodesChangeMapping = useCallback(
    (changes: NodeChange[]) => {
      const result = handleCascadeNodeChanges(
        {
          changes,
          nodes,
          edges,
          onNodesChange,
          setNodes,
          setEdges,
        },
        {
          follow: 'out',
          isColumn,
          isCategory,
          onColumnRemoved: addBackColumn,
        },
      );
      if (result?.removedNodeIds?.size) onNodesDeleted?.(result.removedNodeIds);
    },
    [nodes, edges, onNodesChange, setNodes, setEdges, addBackColumn, onNodesDeleted],
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
            onAnchorChange={handleAnchorChange}
            mode="mapping"
          />
          {anchor && toolbarOpen && (
            <ColumnToolbar
              columns={availableColumns}
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
