import { useAnalysisRequests } from '@app/hooks/useAnalysisRequests';
import { Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
type RequestDetailsProps = {
  requestId: string;
};

export const RequestDetails = ({ requestId }: RequestDetailsProps) => {
  const { t } = useTranslation();
  const { fetchRequest, manageLoading } = useAnalysisRequests();

  useEffect(() => {
    const controller = new AbortController();
    fetchRequest(requestId);
    return () => controller.abort();
  }, [requestId, fetchRequest]);

  return (
    <Spin spinning={manageLoading}>
      <Row className="text-lg mt-8 mb-6">{t('project.main.dbMapping.table.manage.summary.title')}</Row>
    </Spin>
  );
};
