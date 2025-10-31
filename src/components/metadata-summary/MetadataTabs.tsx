import { Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { DatabaseTableInfo } from '@app/api/database.api';
import { ERD } from './ERD/ERD';
import { TableInfo } from './TableInfo/TableInfo';
import { DefaultOptionType } from 'antd/es/cascader';

type MetadataTabsProps = {
  erd: string;
  selectItems: DefaultOptionType[];
  tableInfo: DatabaseTableInfo[];
};

export const MetadataTabs = ({ erd, selectItems, tableInfo }: MetadataTabsProps) => {
  const { t } = useTranslation();

  const items: TabsProps['items'] = [
    {
      key: 'erd',
      label: t('project.main.metadata.tabs.erd'),
      children: <ERD diagramCode={erd} />,
    },
    {
      key: 'table',
      label: t('project.main.metadata.tabs.table.title'),
      children: <TableInfo allTableInfo={tableInfo} selectItems={selectItems} />,
    },
  ];
  return <Tabs className="metadata-tabs" defaultActiveKey="erd" items={items} />;
};
