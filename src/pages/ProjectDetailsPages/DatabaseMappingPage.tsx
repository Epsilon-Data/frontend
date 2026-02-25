import React, { useEffect } from 'react';
import { DatabaseMappingHeader } from '@app/components/database-mapping/DatabaseMappingHeader';
import { useArchetypes } from '@app/hooks/useArchetypes';
import { Archetypes } from '@app/components/database-mapping/Archetypes';
import { ArchetypeDetails } from '@app/components/database-mapping/ArchetypeDetails';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjectContext } from '@app/hooks/useProjectContext';
import { Breadcrumb } from 'antd';
import { FallbackState } from '@app/components/database-mapping/FallbackState';
import { DatabaseModalProvider } from '@app/providers/DatabaseModalProvider';
import { LoaderWrapper } from '@app/components/common/LoaderWrapper';

const DatabaseMappingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const archetypeId = searchParams.get('archetypeId');
  const { archetypes, tableLoading, fetchArchetypes, archetypeReadyById } = useArchetypes(projectId);
  const { t } = useTranslation();
  const { project, projectLoading } = useProjectContext();
  const projectMatches = !!projectId && !!project && String(project.projectId) === projectId;
  const pageLoading = projectLoading || !projectMatches || tableLoading;

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
