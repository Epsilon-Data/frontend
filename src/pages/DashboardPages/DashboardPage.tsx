import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@app/hooks/reduxHooks';

import { useUserProjects } from '@app/hooks/useUserProjects';
import { DashboardHeader } from '@app/components/create-project/DashboardHeader';
import { Projects } from '@app/components/create-project/Projects';
import { MultiStepProjectModal } from '@app/components/create-project/modal/MultiStepProjectModal';
import { ProjectModalProvider } from '@app/providers/ProjectModalProvider';

const DashboardPage: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const { csrf, initialized } = useAppSelector((state) => state.auth);
  const { ownedProjects, sharedProjects, fetchProjects } = useUserProjects();

  useEffect(() => {
    if (!(initialized && csrf)) return;
    const controller = new AbortController();
    fetchProjects(controller.signal);
    return () => controller.abort();
  }, [csrf, fetchProjects, initialized]);

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <ProjectModalProvider>
        <DashboardHeader user={user} handleLayoutChange={setLayout} layout={layout} />
        <MultiStepProjectModal fetchProjects={fetchProjects} mask closable={false} width={'60%'} />
      </ProjectModalProvider>
      <Projects sharedProjects={sharedProjects} ownedProjects={ownedProjects} layout={layout} />
    </div>
  );
};

export default DashboardPage;
