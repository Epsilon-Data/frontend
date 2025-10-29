import React, { useEffect } from 'react';
import { DatabaseMappingHeader } from '@app/components/database-mapping/DatabaseMappingHeader';
import { useArchetypes } from '@app/hooks/useArchetypes';
import { ArchetypeModalProvider } from '@app/providers/ArchetypeModalProvider';
import { MultiStepArchetypeModal } from '@app/components/database-mapping/modal/MultiStepArchetypeModal';
import { Archetypes } from '@app/components/database-mapping/Archetypes';
import { ArchetypeDetails } from '@app/components/database-mapping/ArchetypeDetails';
import { useSearchParams } from 'react-router-dom';

const DatabaseMappingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const archetypeId = searchParams.get('archetypeId');

  const { archetypes, tableLoading, fetchArchetypes } = useArchetypes(projectId);

  useEffect(() => {
    const controller = new AbortController();
    fetchArchetypes();
    return () => controller.abort();
  }, [fetchArchetypes]);

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      {!archetypeId ? (
        <>
          <ArchetypeModalProvider>
            <DatabaseMappingHeader projectId={projectId} mode={'create'} />
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
