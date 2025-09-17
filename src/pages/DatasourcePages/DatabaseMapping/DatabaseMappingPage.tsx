import React, { useEffect } from 'react';
import { DatabaseMappingHeader } from '@app/components/database-mapping/DatabaseMappingHeader';
import { useArchetypes } from '@app/hooks/useArchetypes';
import { ArchetypeModalProvider } from '@app/providers/ArchetypeModalProvider';
import { MultiStepArchetypeModal } from '@app/components/database-mapping/modal/MultiStepArchetypeModal';
import { Archetypes } from '@app/components/database-mapping/Archetypes';

const DatabaseMappingPage: React.FC = () => {
  const projectId = new URLSearchParams(window.location.search).get('id') || '';

  const { archetypes, fetchArchetypes } = useArchetypes(projectId);

  useEffect(() => {
    const controller = new AbortController();
    fetchArchetypes();
    return () => controller.abort();
  }, [fetchArchetypes]);

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
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
      <Archetypes archetypes={archetypes} />
    </div>
  );
};

export default DatabaseMappingPage;
