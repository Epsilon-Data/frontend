import { ProjectList } from '@app/components/ProjectList/ProjectList';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
export const Projects = ({ ownedProjects, sharedProjects, layout }) => {
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
        <div className="text-md font-medium font-inter text-black">{t('dashboard.main.sharedProjects.title')}</div>
        <div className="text-xs font-regular font-inter text-grey-1">
          {t('dashboard.main.sharedProjects.description')}
        </div>
        <ProjectList projects={sharedProjects} mode="dashboard" layout={layout} onProjectClick={handleProjectClick} />
      </div>
    </>
  );
};
