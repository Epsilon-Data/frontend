import { Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { ArchetypeInfo } from '@app/api/archetypes.api';
import { ArchetypeFlow } from '../reactflow-components/ArchetypeFlow/ArchetypeFlow';
import { Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';
import { ReadOnlyPermissionsTable } from './ReadonlyPermissionTable';

type DisplayTabsProps = {
  archetype: ArchetypeInfo;
};

export const DisplayTabs = ({ archetype }: DisplayTabsProps) => {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(archetype.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(archetype.edges || []);

  const items: TabsProps['items'] = [
    {
      key: 'mapping',
      label: t('project.main.dbMapping.table.manage.tabs.mapping'),
      children: (
        <div className="h-[33rem] w-full bg-white rounded-xl">
          <ArchetypeFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setNodes={setNodes}
            setEdges={setEdges}
            mode="readonly"
          />
        </div>
      ),
    },
    {
      key: 'permissions',
      label: t('project.main.dbMapping.table.manage.tabs.permissions'),
      children: <ReadOnlyPermissionsTable nodes={nodes} edges={edges} permissions={archetype.permissions || []} />,
    },
  ];
  return <Tabs className="details-tabs" defaultActiveKey="mapping" items={items} />;
};
