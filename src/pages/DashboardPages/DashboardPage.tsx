import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@app/hooks/reduxHooks';

import { useUserProjects } from '@app/hooks/useUserProjects';
import { DashboardHeader } from '@app/components/create-project/DashboardHeader';
import { Projects } from '@app/components/create-project/Projects';
import { MultiStepProjectModal } from '@app/components/create-project/modal/MultiStepProjectModal';
import { ProjectModalProvider } from '@app/providers/ProjectModalProvider';

export type Layout = 'grid' | 'list';
export type SortKey = 'date-created' | 'title' | 'last-modified';

const DashboardPage: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);

  const [layout, setLayout] = useState<Layout>('grid');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date-created');
  const [loading, setLoading] = useState(true);

  const { ownedProjects, analysisProjects, fetchProjects } = useUserProjects();

  useEffect(() => {
    const controller = new AbortController();
    fetchProjects(controller.signal).finally(() => setLoading(false));
    return () => controller.abort();
  }, [fetchProjects]);

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <ProjectModalProvider>
        <DashboardHeader
          user={user}
          handleLayoutChange={setLayout}
          layout={layout}
          searchValue={search}
          handleSearchChange={setSearch}
          sortKey={sortKey}
          handleSortChange={setSortKey}
        />
        <MultiStepProjectModal fetchProjects={fetchProjects} mask closable={false} width={'60%'} />
        <Projects
          sharedProjects={analysisProjects}
          ownedProjects={ownedProjects}
          layout={layout}
          searchValue={search}
          sortKey={sortKey}
          loading={loading}
          onRefresh={() => fetchProjects()}
        />
      </ProjectModalProvider>
    </div>
  );
};

export default DashboardPage;
