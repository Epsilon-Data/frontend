import React, { useEffect } from 'react';
import { DatabaseMappingHeader } from '@app/components/database-mapping/DatabaseMappingHeader';
import { useArchetypes } from '@app/hooks/useArchetypes';
import { ArchetypeModalProvider } from '@app/providers/ArchetypeModalProvider';
import { MultiStepArchetypeModal } from '@app/components/database-mapping/modal/MultiStepArchetypeModal';
import { Archetypes } from '@app/components/database-mapping/Archetypes';
import { ArchetypeDetails } from '@app/components/database-mapping/ArchetypeDetails';

const DatabaseMappingPage: React.FC = () => {
  const projectId = new URLSearchParams(window.location.search).get('id') || '';
  const archetypeId = new URLSearchParams(window.location.search).get('archetypeId');

  const { archetypes, archetype, fetchArchetypes } = useArchetypes(projectId);

  useEffect(() => {
    const controller = new AbortController();
    !archetypeId && fetchArchetypes();
    return () => controller.abort();
  }, [archetypeId, fetchArchetypes]);

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      {!archetypeId ? (
        <>
          <ArchetypeModalProvider>
            <DatabaseMappingHeader />
            <MultiStepArchetypeModal
              fetchArchetypes={fetchArchetypes}
              projectId={projectId}
              mask
              closable={false}
              width={'60%'}
            />
          </ArchetypeModalProvider>
          <Archetypes archetypes={archetypes} projectId={projectId} />
        </>
      ) : (
        <ArchetypeDetails archetype={archetype} projectId={projectId} />
      )}
    </div>
  );
};

export default DatabaseMappingPage;
