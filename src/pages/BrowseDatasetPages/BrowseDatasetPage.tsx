import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ExploreDatasetsSearch } from '@app/components/browse-projects/ExploreDatasetsSearch';
import { SearchResultsHeader } from '@app/components/browse-projects/SearchResultsHeader';
import { DismissibleBanner } from '@app/components/common/DismissibleBanner';
import { BrowseModalProvider } from '@app/providers/BrowseModalProvider';
import { MultiStepBrowseModal } from '@app/components/browse-projects/modal/MultiStepBrowseModal';
import { useBrowseProjects } from '@app/hooks/useBrowseProjects';
import { Projects } from '@app/components/browse-projects/Projects';
import { useTranslation } from 'react-i18next';
import { Pagination } from 'antd';

type SearchField = 'all' | 'name' | 'keywords' | 'organisation';
type SortKey = 'date-created' | 'title' | 'last-modified';

const VALID_FIELDS: SearchField[] = ['all', 'name', 'keywords', 'organisation'];
const VALID_SORTS: SortKey[] = ['date-created', 'title', 'last-modified'];
const PAGE_SIZE = 12;

const BrowseDatasetPage: React.FC = () => {
  const { t } = useTranslation();
  const { projects, loading, total, fetchProjects } = useBrowseProjects();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = searchParams.get('q') ?? '';
  const fieldFromUrl = searchParams.get('field') as SearchField | null;
  const sortFromUrl = searchParams.get('sort') as SortKey | null;
  const pageFromUrl = Number(searchParams.get('page')) || 1;

  const searchValue = queryFromUrl;
  const selectedField: SearchField = fieldFromUrl && VALID_FIELDS.includes(fieldFromUrl) ? fieldFromUrl : 'all';
  const sortKey: SortKey = sortFromUrl && VALID_SORTS.includes(sortFromUrl) ? sortFromUrl : 'date-created';
  const currentPage = pageFromUrl;

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const current = Object.fromEntries(searchParams.entries());
      const merged = { ...current, ...updates };
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(merged)) {
        if (v) next[k] = v;
      }
      if (next.field === 'all') delete next.field;
      if (next.sort === 'date-created') delete next.sort;
      if (next.page === '1') delete next.page;
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleSearch = (value: string, field: SearchField) => {
    const params: Record<string, string | undefined> = {
      q: value.trim() || undefined,
      field: field !== 'all' ? field : undefined,
      page: undefined, // reset to page 1
    };
    updateParams(params);
  };

  const handleSortChange = (sort: SortKey) => {
    updateParams({ sort: sort !== 'date-created' ? sort : undefined, page: undefined });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page: page > 1 ? String(page) : undefined });
  };

  useEffect(() => {
    fetchProjects({
      search: searchValue || undefined,
      field: selectedField,
      sort: sortKey,
      page: currentPage,
      limit: PAGE_SIZE,
    });
  }, [fetchProjects, searchValue, selectedField, sortKey, currentPage]);

  return (
    <>
      <ExploreDatasetsSearch
        onSearch={handleSearch}
        initialValue={searchValue}
        initialField={selectedField}
      />
      <div className="py-0 px-4">
        <DismissibleBanner id="browse-hub" message={t('onboarding.browse.banner')} />
      </div>
      <div className="py-0 px-4 flex flex-col">
        <SearchResultsHeader count={total} sortKey={sortKey} onSortChange={handleSortChange} />
        <BrowseModalProvider>
          <Projects projects={projects} layout={'grid'} loading={loading} />
          <MultiStepBrowseModal mask closable={false} width={'60%'} />
        </BrowseModalProvider>
        {total > PAGE_SIZE && (
          <div className="flex justify-center py-6">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default BrowseDatasetPage;
