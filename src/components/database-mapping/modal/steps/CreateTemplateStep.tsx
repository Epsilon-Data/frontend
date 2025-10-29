import { ColumnInfo } from '@app/api/database.api';
import { ArchetypeFlow } from '@app/components/reactflow-components/ArchetypeFlow/ArchetypeFlow';
import { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';
import { useCallback, useMemo } from 'react';

type CreateTemplateStepProps = {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: (value: NodeChange[]) => void;
  onEdgesChange: (value: EdgeChange[]) => void;
  columns: ColumnInfo[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnInfo[]>>;
  name: string;
};
export const CreateTemplateStep = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  name,
  columns,
  setColumns,
}: CreateTemplateStepProps) => {
  const columnIds = useMemo(() => new Set(nodes.filter((n) => n.type === 'column').map((n) => n.id)), [nodes]);

  const visibleNodes = useMemo(() => nodes.filter((n) => n.type !== 'column'), [nodes]);

  const visibleEdges = useMemo(
    () => edges.filter((e) => !columnIds.has(e.source) && !columnIds.has(e.target)),
    [edges, columnIds],
  );

  const isCategory = (n?: Node) => n?.type === 'category' || n?.type === 'root';
  const isColumn = (n?: Node) => n?.type === 'column';

  const addBackColumn = useCallback(
    (id: string, nameFromNode?: string, tableFromNode?: string) => {
      const full = columns?.find((c) => c.id === id);
      const col: ColumnInfo = full ?? {
        id,
        name: nameFromNode ?? '',
        table: tableFromNode ?? '',
      };
      setColumns((prev) => (prev.some((c) => c.id === col.id) ? prev : [...prev, col]));
    },
    [setColumns, columns],
  );

  const handleNodesChangeEditable = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);

      const removedCategoryIds = new Set(changes.filter((c) => c.type === 'remove').map((c) => c.id));
      if (removedCategoryIds.size === 0) return;

      const byId = new Map(nodes.map((n) => [n.id, n as Node]));

      const columnIdsToRemove = new Set<string>();
      const edgesToRemove = new Set<string>();

      for (const e of edges) {
        const s = byId.get(e.source);
        const t = byId.get(e.target);
        const sIsRemovedCat = s && isCategory(s) && removedCategoryIds.has(s.id);
        const tIsRemovedCat = t && isCategory(t) && removedCategoryIds.has(t.id);
        if (!sIsRemovedCat && !tIsRemovedCat) continue;

        const columnNode = isColumn(s) ? s : isColumn(t) ? t : undefined;
        if (columnNode) {
          columnIdsToRemove.add(columnNode.id);
          edgesToRemove.add(e.id);
          const d = columnNode.data as { label: string; table: string };
          addBackColumn(columnNode.id, d.label, d.table);
        } else {
          edgesToRemove.add(e.id);
        }
      }

      if (columnIdsToRemove.size > 0 || edgesToRemove.size > 0) {
        setNodes((nds) => nds.filter((n) => !columnIdsToRemove.has(n.id)));
        setEdges((eds) => eds.filter((e) => !edgesToRemove.has(e.id)));
      }
    },
    [onNodesChange, nodes, edges, setNodes, setEdges, addBackColumn],
  );
  return (
    <div className="h-[33rem] overflow-y-auto flex flex-col justify-center bg-grey-4">
      <div className="flex flex-col bg-white">
        <div className="h-[33rem] w-full">
          <ArchetypeFlow
            nodes={visibleNodes}
            edges={visibleEdges}
            onNodesChange={handleNodesChangeEditable}
            onEdgesChange={onEdgesChange}
            setNodes={setNodes}
            setEdges={setEdges}
            mode="editable"
            name={name}
          />
        </div>
      </div>
    </div>
  );
};
