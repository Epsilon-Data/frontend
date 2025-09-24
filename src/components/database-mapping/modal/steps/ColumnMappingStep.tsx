import { ArchetypeFlow } from '@app/components/reactflow-components/ArchetypeFlow/ArchetypeFlow';
import { Node, Edge, NodeChange, EdgeChange } from 'reactflow';

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
  return (
    <div className="h-[33rem] py-4 px-8 overflow-y-auto flex flex-col justify-center bg-grey-4">
      <div className="flex flex-col bg-white rounded-lg">
        <div className="h-[30rem] w-full">
          <ArchetypeFlow
            name={name}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setNodes={setNodes}
            setEdges={setEdges}
            mode="mapping"
            columns={columns}
            setColumns={setColumns}
          />
        </div>
      </div>
    </div>
  );
};
