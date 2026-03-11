import { ProjectSummaryInfo, retryCrawl } from '@app/api/projects.api';
import { ProjectList } from '@app/components/ProjectList/ProjectList';
import { EmptyState } from '@app/components/common/EmptyState';
import { Layout } from '@app/pages/DashboardPages/DashboardPage';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LoaderWrapper } from '@app/components/common/LoaderWrapper';
import { Button, Pagination } from 'antd';

type PaginationInfo = { page: number; limit: number; total: number; totalPages: number };

type ProjectsProps = {
  ownedProjects: ProjectSummaryInfo[];
  sharedProjects: ProjectSummaryInfo[];
  ownedPagination: PaginationInfo;
  sharedPagination: PaginationInfo;
  layout: Layout;
  searchValue: string;
  loading: boolean;
  onRefresh?: () => void;
  onOwnedPageChange: (page: number) => void;
  onSharedPageChange: (page: number) => void;
};

export const Projects = ({
  ownedProjects,
  sharedProjects,
  ownedPagination,
  sharedPagination,
  layout,
  searchValue,
  loading,
  onRefresh,
  onOwnedPageChange,
  onSharedPageChange,
}: ProjectsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/db-mapping?id=${projectId}`);
  };

  const handleRetryCrawl = async (projectId: string) => {
    try {
      await retryCrawl(projectId);
      onRefresh?.();
    } catch (error) {
      console.error('Failed to retry crawl:', error);
    }
  };

  const isSearching = searchValue.trim().length > 0;

  // When searching, both owned and shared are filtered server-side — show combined results
  if (isSearching) {
    const allResults = [...ownedProjects, ...sharedProjects];
    const totalResults = ownedPagination.total + sharedPagination.total;

    return (
      <div className="my-12">
        <div className="text-md font-medium font-inter text-black">{t('dashboard.main.searchResults.title')}</div>
        <div className="text-xs font-regular font-inter text-grey-1">
          {t('dashboard.main.searchResults.count', { count: totalResults })}
        </div>
        <LoaderWrapper isLoading={loading} minHeight="300px">
          {allResults.length > 0 ? (
            <ProjectList
              onRetryCrawl={handleRetryCrawl}
              projects={allResults}
              mode="dashboard"
              layout={layout}
              onProjectClick={handleProjectClick}
            />
          ) : (
            <EmptyState description={t('dashboard.main.searchResults.empty', 'No projects found')} />
          )}
        </LoaderWrapper>
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
        <LoaderWrapper isLoading={loading} minHeight="300px">
          {ownedProjects.length > 0 ? (
            <>
              <ProjectList
                onRetryCrawl={handleRetryCrawl}
                projects={ownedProjects}
                mode="dashboard"
                layout={layout}
                onProjectClick={handleProjectClick}
              />
              {ownedPagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    current={ownedPagination.page}
                    pageSize={ownedPagination.limit}
                    total={ownedPagination.total}
                    onChange={onOwnedPageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState description={t('onboarding.dashboard.ownedEmpty')}>
              <Button className="mt-2" onClick={() => navigate('/browse')}>
                {t('onboarding.dashboard.ownedBrowse')}
              </Button>
            </EmptyState>
          )}
        </LoaderWrapper>
      </div>
      <div className="my-20">
        <div className="text-md font-medium font-inter text-black">{t('dashboard.main.sharedProjects.title')}</div>
        <div className="text-xs font-regular font-inter text-grey-1">
          {t('dashboard.main.sharedProjects.description')}
        </div>
        <LoaderWrapper isLoading={loading} minHeight="300px">
          {sharedProjects.length > 0 ? (
            <>
              <ProjectList
                onRetryCrawl={handleRetryCrawl}
                projects={sharedProjects}
                mode="dashboard"
                layout={layout}
                onProjectClick={handleProjectClick}
              />
              {sharedPagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    current={sharedPagination.page}
                    pageSize={sharedPagination.limit}
                    total={sharedPagination.total}
                    onChange={onSharedPageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState description={t('onboarding.dashboard.sharedEmpty')} />
          )}
        </LoaderWrapper>
      </div>
    </>
  );
};
