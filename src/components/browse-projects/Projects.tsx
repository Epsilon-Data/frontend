import { ProjectSummaryInfo } from '@app/api/projects.api';
import { ProjectList } from '@app/components/ProjectList/ProjectList';
import { useBrowseModalContext } from '@app/hooks/useBrowseModalContext';

type ProjectsProps = {
  projects: ProjectSummaryInfo[];
  layout: 'grid' | 'list';
};

export const Projects = ({ projects, layout }: ProjectsProps) => {
  const { showModal } = useBrowseModalContext();

  return (
    <>
      <div className="my-2">
        <ProjectList projects={projects} mode="all" layout={layout} onProjectClick={showModal} />
      </div>
    </>
  );
};
