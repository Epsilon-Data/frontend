import React, { useEffect } from 'react';
import { ExploreDatasetsSearch } from '@app/components/browse-projects/ExploreDatasetsSearch';
import { SearchResultsHeader } from '@app/components/browse-projects/SearchResultsHeader';
import { BrowseModalProvider } from '@app/providers/BrowseModalProvider';
import { MultiStepBrowseModal } from '@app/components/browse-projects/modal/MultiStepBrowseModal';
import { useBrowseProjects } from '@app/hooks/useBrowseProjects';
import { Projects } from '@app/components/browse-projects/Projects';

const BrowseDatasetPage: React.FC = () => {
  const { projects, fetchProjects } = useBrowseProjects();

  useEffect(() => {
    const controller = new AbortController();
    fetchProjects();
    return () => controller.abort();
  }, [fetchProjects]);

  return (
    <>
      <ExploreDatasetsSearch />
      <div className="py-0 px-4 flex flex-col">
        <SearchResultsHeader count={projects.length} />
        <BrowseModalProvider>
          <Projects projects={projects} layout={'grid'} />
          <MultiStepBrowseModal mask closable={false} width={'60%'} />
        </BrowseModalProvider>
      </div>
    </>
  );
};

export default BrowseDatasetPage;
