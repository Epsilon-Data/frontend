import { ArchetypeFlow } from '@app/components/reactflow-components/ArchetypeFlow/ArchetypeFlow';
import { Node, Edge, NodeChange, EdgeChange, ReactFlowProvider } from 'reactflow';

type CreateTemplateStepProps = {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: (value: NodeChange[]) => void;
  onEdgesChange: (value: EdgeChange[]) => void;
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
}: CreateTemplateStepProps) => {
  return (
    <div className="h-[33rem] py-4 px-8 overflow-y-auto flex flex-col justify-center bg-grey-4">
      <div className="flex flex-col bg-white rounded-lg">
        <ReactFlowProvider>
          <div className="h-[30rem] w-full">
            <ArchetypeFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              setNodes={setNodes}
              setEdges={setEdges}
              mode="editable"
              name={name}
            />
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};
