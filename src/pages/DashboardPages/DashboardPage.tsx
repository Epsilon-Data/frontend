import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useAppSelector } from '@app/hooks/reduxHooks';

import { useProjects } from '@app/hooks/useProjects';
import { DashboardHeader } from '@app/components/dashboard/DashboardHeader';
import { Projects } from '@app/components/dashboard/Projects';
import { MultiStepProjectModal } from '@app/components/dashboard/modal/MultiStepProjectModal';
import { ProjectModalProvider } from '@app/providers/ProjectModalProvider';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.user);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const { ownedProjects, sharedProjects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <PageTitle>{t('dashboard.title')}</PageTitle>
      <ProjectModalProvider>
        <DashboardHeader user={user} handleLayoutChange={setLayout} layout={layout} />
        <MultiStepProjectModal fetchProjects={fetchProjects} mask closable={false} width={'60%'} />
      </ProjectModalProvider>
      <Projects sharedProjects={sharedProjects} ownedProjects={ownedProjects} layout={layout} />
    </div>
  );
};

export default DashboardPage;
