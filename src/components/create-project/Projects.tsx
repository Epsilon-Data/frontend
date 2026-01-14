import { ProjectSummaryInfo } from '@app/api/projects.api';
import { ProjectList } from '@app/components/ProjectList/ProjectList';
import { Layout, SortKey } from '@app/pages/DashboardPages/DashboardPage';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type ProjectsProps = {
  ownedProjects: ProjectSummaryInfo[];
  sharedProjects: ProjectSummaryInfo[];
  layout: Layout;
  searchValue: string;
  sortKey: string;
};

const normalize = (s: string) => s.trim().toLowerCase();

const matchesSearch = (p: ProjectSummaryInfo, q: string) => {
  if (!q) return true;
  const searchFields = [p.name].filter(Boolean).join(' ').toLowerCase();

  return searchFields.includes(q);
};

const toMs = (d: Date | string) => new Date(d).getTime();

const sortProjects = (arr: ProjectSummaryInfo[], sortKey: SortKey) => {
  const copy = [...arr];

  switch (sortKey) {
    case 'title':
      return copy.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

    case 'last-modified':
      return copy.sort((a, b) => toMs(b.lastModified) - toMs(a.lastModified));

    case 'date-created':
    default:
      return copy.sort((a, b) => toMs(b.createdDate) - toMs(a.createdDate));
  }
};

export const Projects = ({ ownedProjects, sharedProjects, layout, searchValue, sortKey }: ProjectsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const q = normalize(searchValue);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/db-mapping?id=${projectId}`);
  };

  const sortedOwned = sortProjects(ownedProjects, sortKey as SortKey);
  const sortedShared = sortProjects(sharedProjects, sortKey as SortKey);

  const rawSearchResults = q.length > 0 ? [...ownedProjects, ...sharedProjects].filter((p) => matchesSearch(p, q)) : [];
  const searchResults = q.length > 0 ? sortProjects(rawSearchResults, sortKey as SortKey) : [];

  const showSearchSection = q.length > 0 && searchResults.length > 0;

  if (showSearchSection) {
    return (
      <div className="my-12">
        <div className="text-md font-medium font-inter text-black">{t('dashboard.main.searchResults.title')}</div>
        <div className="text-xs font-regular font-inter text-grey-1">
          {t('dashboard.main.searchResults.count', { count: searchResults.length })}
        </div>

        <ProjectList projects={searchResults} mode="dashboard" layout={layout} onProjectClick={handleProjectClick} />
      </div>
    );
  }

  return (
    <>
      <div className="my-12">
        <div className="text-md font-medium font-inter text-black">{t('dashboard.main.personalProjects.title')}</div>
        <div className="text-xs font-regular font-inter text-grey-1">
          {t('dashboard.main.personalProjects.description')}
        </div>
        <ProjectList projects={sortedOwned} mode="dashboard" layout={layout} onProjectClick={handleProjectClick} />
      </div>
      <div className="my-20">
        <div className="text-md font-medium font-inter text-black">{t('dashboard.main.sharedProjects.title')}</div>
        <div className="text-xs font-regular font-inter text-grey-1">
          {t('dashboard.main.sharedProjects.description')}
        </div>
        <ProjectList projects={sortedShared} mode="dashboard" layout={layout} onProjectClick={handleProjectClick} />
      </div>
    </>
  );
};
