import { ColumnInfo } from '@app/api/database.api';
import { ArchetypeFlow } from '@app/components/reactflow-components/ArchetypeFlow/ArchetypeFlow';
import { handleCascadeNodeChanges } from '@app/constants/reactflow/cascade';
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

  const onColumnRemoved = useCallback(
    (col: ColumnInfo) => {
      setColumns((prev) => (prev.some((c) => c.id === col.id) ? prev : [...prev, col]));
    },
    [setColumns],
  );

  const handleNodesChangeEditable = useCallback(
    (changes: NodeChange[]) => {
      handleCascadeNodeChanges(
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
    },
    [nodes, edges, onNodesChange, setNodes, setEdges, onColumnRemoved],
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
