import { Panel } from 'reactflow';
import { TemplateNamePanel } from './panels/TemplateNamePanel';
import { UndoRedoPanel } from './panels/UndoRedoPanel';
import { NodeDragPanel } from './panels/NodeDragPanel';

export const ElementsSidebar: React.FC<{ name: string; mode: string }> = ({ name, mode }) => {
  const isMapping = mode === 'mapping';

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <Panel position="top-left">
        <TemplateNamePanel name={name} />
        <NodeDragPanel hidden={isMapping} onDragStart={onDragStart} />
        <UndoRedoPanel transition={isMapping} />
      </Panel>
    </>
  );
};
