import React, { useCallback, useEffect, useState } from 'react';
import { DatabaseMappingHeader } from '@app/components/database-mapping/DatabaseMappingHeader';
import { useArchetypes } from '@app/hooks/useArchetypes';
import { Archetypes } from '@app/components/database-mapping/Archetypes';
import { ArchetypeDetails } from '@app/components/database-mapping/ArchetypeDetails';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjectContext } from '@app/hooks/useProjectContext';
import { Alert, Breadcrumb } from 'antd';
import { FallbackState } from '@app/components/database-mapping/FallbackState';
import { DatabaseModalProvider } from '@app/providers/DatabaseModalProvider';
import { LoaderWrapper } from '@app/components/common/LoaderWrapper';
import { usePolling } from '@app/hooks/usePolling';
import { getJobStatus } from '@app/api/job.api';

type LocationState = { jobId?: string; archetypeName?: string } | null;

const DatabaseMappingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const projectId = searchParams.get('id') ?? '';
  const archetypeId = searchParams.get('archetypeId');
  const { archetypes, tableLoading, fetchArchetypes, archetypeReadyById } = useArchetypes(projectId);
  const { t } = useTranslation();
  const { project, projectLoading } = useProjectContext();
  const projectMatches = !!projectId && !!project && String(project.projectId) === projectId;
  const pageLoading = projectLoading || !projectMatches || tableLoading;

  const locationState = location.state as LocationState;
  const [pendingJobId, setPendingJobId] = useState<string | undefined>(locationState?.jobId);
  const [pendingName, setPendingName] = useState<string | undefined>(locationState?.archetypeName);

  // Sync incoming location state (handles in-page navigation e.g. delete from detail view)
  useEffect(() => {
    if (locationState?.jobId) {
      setPendingJobId(locationState.jobId);
      setPendingName(locationState.archetypeName);
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  const handleJobComplete = useCallback(() => {
    setPendingJobId(undefined);
    setPendingName(undefined);
    fetchArchetypes();
  }, [fetchArchetypes]);

  usePolling(() => getJobStatus(pendingJobId!), {
    interval: 3000,
    enabled: !!pendingJobId,
    onSuccess: (data) => {
      if (data.status === 'completed' || data.status === 'error') {
        handleJobComplete();
      }
    },
    onError: () => {
      setPendingJobId(undefined);
      setPendingName(undefined);
    },
  });

  useEffect(() => {
    if (!projectId) return;
    const controller = new AbortController();
    fetchArchetypes(controller.signal);
    return () => controller.abort();
  }, [fetchArchetypes, projectId]);

  const canMap = ['READY', 'MAPPED'].includes(project?.status ?? '') && archetypes.length > 0;

  const breadcrumbItems = [
    { title: <Link to="/">{t('project.breadcrumb.home')}</Link> },
    { title: project?.name || '' },
    { title: <Link to={`/project/db-mapping?id=${projectId}`}>{t('project.breadcrumb.dbMapping')}</Link> },
  ];

  if (archetypeId) {
    breadcrumbItems.push({
      title: (
        <Link to={`/project/db-mapping?id=${projectId}&archetypeId=${archetypeId}`}>
          {archetypes.find((r) => r.id === archetypeId)?.name}
        </Link>
      ),
    });
  }

  return (
    <>
      <div className="py-3 px-4 md:py-5 md:px-9">
        <Breadcrumb separator=">" className="my-4" items={breadcrumbItems} />
        {pendingJobId && (
          <Alert
            type="info"
            showIcon
            banner
            title={t('project.main.dbMapping.jobPending', {
              name: pendingName || t('project.main.dbMapping.archetype'),
            })}
            className="mb-4"
          />
        )}
        {!archetypeId ? (
          <>
            <DatabaseMappingHeader projectId={projectId} projectStatus={project?.status} mode="create" />
            <LoaderWrapper isLoading={pageLoading}>
              {canMap ? (
                <Archetypes
                  loading={tableLoading}
                  archetypes={archetypes}
                  projectId={projectId}
                  archetypeReadyById={archetypeReadyById}
                />
              ) : (
                <DatabaseModalProvider>
                  <FallbackState
                    projectStatus={project?.status ?? ''}
                    projectId={projectId}
                    projectOwner={project?.ownerId ?? ''}
                    connectionType={project?.connectionType}
                  />
                </DatabaseModalProvider>
              )}
            </LoaderWrapper>
          </>
        ) : (
          <ArchetypeDetails projectId={projectId} archetypeId={archetypeId} />
        )}
      </div>
      {!canMap && !archetypeId && (
        <div className="pointer-events-none absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 250" preserveAspectRatio="none" className="w-full h-[340px] md:h-[400px]">
            <path
              d="
              M0,150
              C520,100 660,255 990,230
              S1220,185 1440,155
              L1440,260
              L0,260
              Z
            "
              fill="rgba(0,0,0,0.03)"
            />
          </svg>
          <div className="w-full h-[160px]" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }} />
        </div>
      )}
    </>
  );
};

export default DatabaseMappingPage;
