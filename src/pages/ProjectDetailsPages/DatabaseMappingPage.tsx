import React, { useEffect } from 'react';
import { DatabaseMappingHeader } from '@app/components/database-mapping/DatabaseMappingHeader';
import { useArchetypes } from '@app/hooks/useArchetypes';
import { ArchetypeModalProvider } from '@app/providers/ArchetypeModalProvider';
import { MultiStepArchetypeModal } from '@app/components/database-mapping/modal/MultiStepArchetypeModal';
import { Archetypes } from '@app/components/database-mapping/Archetypes';
import { ArchetypeDetails } from '@app/components/database-mapping/ArchetypeDetails';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjectContext } from '@app/hooks/useProjectContext';
import { Breadcrumb } from 'antd';

const DatabaseMappingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const archetypeId = searchParams.get('archetypeId');
  const { archetypes, tableLoading, fetchArchetypes } = useArchetypes(projectId);
  const { t } = useTranslation();
  const { project } = useProjectContext();

  useEffect(() => {
    const controller = new AbortController();
    fetchArchetypes();
    return () => controller.abort();
  }, [fetchArchetypes]);

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
    <div className="py-3 px-4 md:py-5 md:px-9">
      <Breadcrumb separator=">" className="my-4" items={breadcrumbItems} />
      {!archetypeId ? (
        <>
          <ArchetypeModalProvider mode="create">
            <DatabaseMappingHeader projectId={projectId} />
            <MultiStepArchetypeModal
              fetchArchetypes={fetchArchetypes}
              projectId={projectId}
              mask
              closable={false}
              width={'60%'}
            />
          </ArchetypeModalProvider>
          <Archetypes loading={tableLoading} archetypes={archetypes} projectId={projectId} />
        </>
      ) : (
        <ArchetypeDetails projectId={projectId} archetypeId={archetypeId} />
      )}
    </div>
  );
};

export default DatabaseMappingPage;
