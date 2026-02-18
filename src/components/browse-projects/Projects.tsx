import { ProjectSummaryInfo } from '@app/api/projects.api';
import { ProjectList } from '@app/components/ProjectList/ProjectList';
import { useBrowseModalContext } from '@app/hooks/useBrowseModalContext';
import { LoaderWrapper } from '@app/components/common/LoaderWrapper';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

type ProjectsProps = {
  projects: ProjectSummaryInfo[];
  layout: 'grid' | 'list';
  loading: boolean;
};

export const Projects = ({ projects, layout, loading }: ProjectsProps) => {
  const { showModal } = useBrowseModalContext();
  const { t } = useTranslation();

  return (
    <div className="my-2">
      <LoaderWrapper isLoading={loading} minHeight="400px">
        {projects.length > 0 ? (
          <ProjectList projects={projects} mode="all" layout={layout} onProjectClick={showModal} />
        ) : (
          <Empty className="mt-10" description={t('browse.main.noProjects')} />
        )}
      </LoaderWrapper>
    </div>
  );
};
