import React, { useEffect, useMemo, useState } from 'react';
import { ExploreDatasetsSearch } from '@app/components/browse-projects/ExploreDatasetsSearch';
import { SearchResultsHeader } from '@app/components/browse-projects/SearchResultsHeader';
import { DismissibleBanner } from '@app/components/common/DismissibleBanner';
import { BrowseModalProvider } from '@app/providers/BrowseModalProvider';
import { MultiStepBrowseModal } from '@app/components/browse-projects/modal/MultiStepBrowseModal';
import { useBrowseProjects } from '@app/hooks/useBrowseProjects';
import { Projects } from '@app/components/browse-projects/Projects';
import { ProjectSummaryInfo } from '@app/api/projects.api';
import { useTranslation } from 'react-i18next';

type SearchField = 'all' | 'name' | 'keywords' | 'organisation';
type SortKey = 'date-created' | 'title' | 'last-modified';

const normalize = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase();

const BrowseDatasetPage: React.FC = () => {
  const { t } = useTranslation();
  const { projects, fetchProjects } = useBrowseProjects();

  const [searchValue, setSearchValue] = useState('');
  const [selectedField, setSelectedField] = useState<SearchField>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date-created');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchProjects().finally(() => setLoading(false));
    return () => controller.abort();
  }, [fetchProjects]);

  const filteredAndSortedProjects = useMemo(() => {
    const q = normalize(searchValue);

    const matches = (p: ProjectSummaryInfo) => {
      if (!q) return true;

      const name = normalize(p.name);
      const keywords = Array.isArray(p.dbKeywords) ? p.dbKeywords.map(normalize).join(' ') : normalize(p.dbKeywords);
      const organisation = normalize(`${p.university ?? ''} - ${p.faculty ?? ''}`);

      switch (selectedField) {
        case 'name':
          return name.includes(q);
        case 'keywords':
          return keywords.includes(q);
        case 'organisation':
          return organisation.includes(q);
        case 'all':
        default:
          return `${name} ${keywords} ${organisation}`.includes(q);
      }
    };

    const parseTime = (d: unknown) => {
      const t = new Date(String(d ?? '')).getTime();
      return Number.isFinite(t) ? t : 0;
    };

    const sorted = [...projects].filter(matches).sort((a, b) => {
      if (sortKey === 'title') {
        return normalize(a.name).localeCompare(normalize(b.name));
      }

      if (sortKey === 'last-modified') {
        return parseTime(b.lastModified) - parseTime(a.lastModified);
      }

      return parseTime(b.createdDate) - parseTime(a.createdDate);
    });

    return sorted;
  }, [projects, searchValue, selectedField, sortKey]);

  return (
    <>
      <ExploreDatasetsSearch
        onSearch={(value, field) => {
          setSearchValue(value);
          setSelectedField(field);
        }}
      />
      <div className="py-0 px-4">
        <DismissibleBanner id="browse-hub" message={t('onboarding.browse.banner')} />
      </div>
      <div className="py-0 px-4 flex flex-col">
        <SearchResultsHeader count={filteredAndSortedProjects.length} sortKey={sortKey} onSortChange={setSortKey} />
        <BrowseModalProvider>
          <Projects projects={filteredAndSortedProjects} layout={'grid'} loading={loading} />
          <MultiStepBrowseModal mask closable={false} width={'60%'} />
        </BrowseModalProvider>
      </div>
    </>
  );
};

export default BrowseDatasetPage;
