import { ColumnInfo } from '@app/api/database.api';
import { ArchetypeFlow } from '@app/components/reactflow-components/ArchetypeFlow/ArchetypeFlow';
import { handleCascadeNodeChanges } from '@app/utils/reactflow/cascade';
import { pruneDirectColumnChildren } from '@app/utils/reactflow/prune';
import { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CodebookUpload } from '@app/components/reactflow-components/GenerateArchetype/CodebookUpload';

export type CreateTemplateStepProps = {
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
  onNodesDeleted,
}: CreateTemplateStepProps) => {
  const columnIds = useMemo(() => new Set(nodes.filter((n) => n.type === 'column').map((n) => n.id)), [nodes]);

  const visibleNodes = useMemo(() => nodes.filter((n) => n.type !== 'column'), [nodes]);

  const visibleEdges = useMemo(
    () => edges.filter((e) => !columnIds.has(e.source) && !columnIds.has(e.target)),
    [edges, columnIds],
  );

  const isCategory = (n?: Node) => n?.type === 'category' || n?.type === 'root';
  const isColumn = (n?: Node) => n?.type === 'column';

  const onColumnRemoved = useCallback(
    (col: ColumnInfo) => {
      setColumns((prev) => {
        const exists = prev.some((c) => c.id === col.id);
        if (exists) {
          return prev;
        }
        const next = [...prev, col];
        return next;
      });
    },
    [setColumns],
  );

  useEffect(() => {
    let nodeColumnIds: Set<string> = new Set();
    setNodes((nds) => {
      const byId = new Map(columns.map((c) => [c.id, c]));

      const updated = nds.map((n) => {
        if (n.type !== 'column') return n;

        const data: { label: string; level: string; table?: string } = n.data as {
          label: string;
          level: string;
          table?: string;
        };
        const hasTable = typeof data.table === 'string' && data.table.length > 0;
        if (hasTable) return n;

        const col = byId.get(n.id);
        if (!col) return n;

        return { ...n, data: { ...data, table: col.table } } as Node;
      });

      nodeColumnIds = new Set(updated.filter((n) => n.type === 'column').map((n) => n.id));

      return updated;
    });

    if (nodeColumnIds.size === 0) return;

    setColumns((prev) => prev.filter((c) => !nodeColumnIds.has(c.id)));
  }, [columns, setColumns, setNodes]);

  const handleNodesChangeEditable = useCallback(
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
          onColumnRemoved,
        },
      );
      if (result?.removedNodeIds?.size) onNodesDeleted?.(result.removedNodeIds);
    },
    [nodes, edges, onNodesChange, setNodes, setEdges, onColumnRemoved, onNodesDeleted],
  );

  const handleLeafNodeBecameParent = useCallback(
    (parentId: string) => {
      pruneDirectColumnChildren({
        parentId,
        nodes,
        edges,
        setNodes,
        setEdges,
        onColumnRemoved,
      });
    },
    [nodes, edges, setNodes, setEdges, onColumnRemoved],
  );

  // local state because its only used in step 2 rather than shared across steps
  const [showCodebookUpload, setShowCodebookUpload] = useState(false);

  return (
    <div className="h-[33rem] overflow-y-auto flex flex-col justify-center bg-grey-4">
      <div className="flex flex-col bg-white">
        {!showCodebookUpload ? (
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
              onLeafNodeBecameParent={handleLeafNodeBecameParent}
              onGenerateFromCodebook={() => setShowCodebookUpload(true)}
            />
          </div>
        ) : (
          <CodebookUpload
            onBack={() => setShowCodebookUpload(false)}
            onUploadSuccess={(nodes, edges) => {
              setNodes(nodes);
              setEdges(edges);
              setShowCodebookUpload(false);
            }}
            setShowCodebookUpload={setShowCodebookUpload}
          />
        )}
      </div>
    </div>
  );
};
