import { ProjectSummaryInfo } from '@app/api/projects.api';
import { ProjectList } from '@app/components/ProjectList/ProjectList';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type ProjectsProps = {
  ownedProjects: ProjectSummaryInfo[];
  analysisProjects: ProjectSummaryInfo[];
  layout: 'grid' | 'list';
};

export const Projects = ({ ownedProjects, analysisProjects, layout }: ProjectsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleProjectClick = (projectId: string) => {
    navigate(`/project/db-mapping?id=${projectId}`);
  };
  return (
    <>
      <div className="my-12">
        <div className="text-md font-medium font-inter text-black">{t('dashboard.main.personalProjects.title')}</div>
        <div className="text-xs font-regular font-inter text-grey-1">
          {t('dashboard.main.personalProjects.description')}
        </div>
        <ProjectList projects={ownedProjects} mode="dashboard" layout={layout} onProjectClick={handleProjectClick} />
      </div>
      <div className="my-20">
        <div className="text-md font-medium font-inter text-black">{t('dashboard.main.analysisProjects.title')}</div>
        <div className="text-xs font-regular font-inter text-grey-1">
          {t('dashboard.main.analysisProjects.description')}
        </div>
        <ProjectList projects={analysisProjects} mode="dashboard" layout={layout} onProjectClick={handleProjectClick} />
      </div>
    </>
  );
};
