import { Panel } from '@xyflow/react';
import { TemplateNamePanel } from './panels/TemplateNamePanel';
import { UndoRedoPanel } from './panels/UndoRedoPanel';
import { InformationPanel } from './panels/InformationPanel';

export const ElementsSidebar: React.FC<{ name: string; mode: string }> = ({ name, mode }) => {
  const isMapping = mode === 'mapping';

  return (
    <>
      <Panel position="top-left">
        <TemplateNamePanel name={name} />
        <InformationPanel hidden={isMapping} />
        <UndoRedoPanel transition={isMapping} />
      </Panel>
    </>
  );
};
