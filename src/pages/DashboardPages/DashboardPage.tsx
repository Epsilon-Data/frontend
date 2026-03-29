import React, { useCallback, useEffect, useState } from 'react';

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
  const [ownedPage, setOwnedPage] = useState(1);
  const [sharedPage, setSharedPage] = useState(1);

  const { ownedProjects, ownedPagination, analysisProjects, sharedPagination, fetchProjects } = useUserProjects();

  const doFetch = useCallback(
    (signal?: AbortSignal) => {
      const base = { sort: sortKey, search: search || undefined } as const;
      return fetchProjects({ ...base, page: ownedPage }, { ...base, page: sharedPage }, signal);
    },
    [fetchProjects, sortKey, search, ownedPage, sharedPage],
  );

  useEffect(() => {
    const controller = new AbortController();
    doFetch(controller.signal).finally(() => setLoading(false));
    return () => controller.abort();
  }, [doFetch]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setOwnedPage(1);
    setSharedPage(1);
  }, []);

  const handleSortChange = useCallback((value: SortKey) => {
    setSortKey(value);
    setOwnedPage(1);
    setSharedPage(1);
  }, []);

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <ProjectModalProvider>
        <DashboardHeader
          user={user}
          handleLayoutChange={setLayout}
          layout={layout}
          searchValue={search}
          handleSearchChange={handleSearchChange}
          sortKey={sortKey}
          handleSortChange={handleSortChange}
        />
        <MultiStepProjectModal fetchProjects={() => doFetch()} mask closable={false} width={'60%'} />
        <Projects
          sharedProjects={analysisProjects}
          ownedProjects={ownedProjects}
          ownedPagination={ownedPagination}
          sharedPagination={sharedPagination}
          layout={layout}
          searchValue={search}
          loading={loading}
          onRefresh={() => doFetch()}
          onOwnedPageChange={setOwnedPage}
          onSharedPageChange={setSharedPage}
        />
      </ProjectModalProvider>
    </div>
  );
};

export default DashboardPage;
