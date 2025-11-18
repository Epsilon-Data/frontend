import { AnalysisRequests } from '@app/components/analysis-requests/AnalysisRequests';
import { useAnalysisRequests } from '@app/hooks/useAnalysisRequests';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TrackRequestsPage: React.FC = () => {
  const { t } = useTranslation();
  const { requests, tableLoading, fetchRequests } = useAnalysisRequests();

  useEffect(() => {
    const controller = new AbortController();
    fetchRequests();
    return () => controller.abort();
  }, [fetchRequests]);

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <div className="flex items-start w-full mt-8 pb-4 border-b border-grey-3">
        <div className="text-xl font-medium font-sans">{t('project.main.dbMapping.title')}</div>
      </div>
      <AnalysisRequests loading={tableLoading} analysisRequests={requests} />
    </div>
  );
};

export default TrackRequestsPage;
