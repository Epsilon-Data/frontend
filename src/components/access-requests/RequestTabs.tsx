import { Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { RequestListInfo, RequestSummaryInfo } from '@app/api/projects.api';
import { AccessRequests } from './AccessRequests';

type RequestTabsProps = {
  loading: boolean;
  accessRequests: RequestListInfo;
  setOpenDrawer: (open: boolean) => void;
  fetchRequest: (record: RequestSummaryInfo, mode: string) => void;
};

export const RequestTabs = ({ loading, accessRequests, setOpenDrawer, fetchRequest }: RequestTabsProps) => {
  const { t } = useTranslation();

  const items: TabsProps['items'] = [
    {
      key: 'connection',
      label: t('project.main.projectAccess.tabs.connection'),
      children: (
        <AccessRequests
          loading={loading}
          accessRequests={accessRequests.connection}
          setOpenDrawer={setOpenDrawer}
          fetchRequest={fetchRequest}
          mode="CONNECTION"
        />
      ),
    },
    {
      key: 'analysis',
      label: t('project.main.projectAccess.tabs.analysis'),
      children: (
        <AccessRequests
          loading={loading}
          accessRequests={accessRequests.analysis}
          setOpenDrawer={setOpenDrawer}
          fetchRequest={fetchRequest}
          mode="ANALYSIS"
        />
      ),
    },
  ];
  return <Tabs className="request-tabs" defaultActiveKey="connection" items={items} />;
};
