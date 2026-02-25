import { Panel } from '@xyflow/react';
import { TemplateNamePanel } from './panels/TemplateNamePanel';
import { UndoRedoPanel } from './panels/UndoRedoPanel';
import { InformationPanel } from './panels/InformationPanel';
import { DatabaseStructurePanel } from './panels/DatabaseStructurePanel';
import { FlowMode } from '@app/context/ArchetypeFlow';

export const ArchetypeSidebar: React.FC<{ name: string; mode: FlowMode }> = ({ name, mode }) => {
  return (
    <>
      <Panel position="top-left">
        <TemplateNamePanel name={name} />
        <InformationPanel mode={mode} />
        <UndoRedoPanel />
        {mode !== 'readonly' && <DatabaseStructurePanel />}
      </Panel>
    </>
  );
};
