import { AnalysisRequestHeader } from '@app/components/analysis-requests/AnalysisRequestHeader';
import { AnalysisRequests } from '@app/components/analysis-requests/AnalysisRequests';
import { RequestDetails } from '@app/components/analysis-requests/RequestDetails';
import { useAnalysisRequests } from '@app/hooks/useAnalysisRequests';
import { Breadcrumb } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

const TrackRequestsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('id') ?? '';
  const { t } = useTranslation();
  const { requests, tableLoading, fetchRequests } = useAnalysisRequests();

  useEffect(() => {
    const controller = new AbortController();
    fetchRequests();
    return () => controller.abort();
  }, [fetchRequests]);

  const breadcrumbItems = [
    { title: <Link to="/browse">{t('browse.breadcrumb.home')}</Link> },
    { title: <Link to="/track-requests">{t('browse.breadcrumb.trackRequests')}</Link> },
  ];

  if (requestId) {
    breadcrumbItems.push({
      title: (
        <Link to={`/track-requests?id=${requestId}`}>
          {requests.find((r) => r.requestId === requestId)?.projectName}
        </Link>
      ),
    });
  }

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <Breadcrumb separator=">" className="my-4" items={breadcrumbItems} />
      {!requestId ? (
        <>
          <div className="flex items-start w-full mt-8 pb-4 border-b border-grey-3">
            <div className="text-xl font-medium font-sans">{t('browse.trackRequests.title')}</div>
          </div>
          <AnalysisRequestHeader />
          <AnalysisRequests loading={tableLoading} analysisRequests={requests} />
        </>
      ) : (
        <RequestDetails requestId={requestId} />
      )}
    </div>
  );
};

export default TrackRequestsPage;
