import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@app/hooks/reduxHooks';

import { useProjects } from '@app/hooks/useProjects';
import { DashboardHeader } from '@app/components/create-project/DashboardHeader';
import { Projects } from '@app/components/create-project/Projects';
import { MultiStepProjectModal } from '@app/components/create-project/modal/MultiStepProjectModal';
import { ProjectModalProvider } from '@app/providers/ProjectModalProvider';
// const getInitialFormValues = () => {
//   return {
//     name: '',
//     lead: '',
//     university: '',
//     faculty: '',
//     ethicsId: '',
//     description: '',
//     startDate: new Date().toISOString(),
//     endDate: new Date().toISOString(),
//     participantsNum: '',
//     dbUrl: '',
//     username: '',
//     password: '',
//   };
// };
const DashboardPage: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const { ownedProjects, sharedProjects, fetchProjects } = useProjects();

  // const nextStep = async () => {
  //   try {
  //     await forms[modalStep].validateFields();

  //     if (modalStep === 3) {
  //       if (!isConnected) {
  //         message.error(t('dashboard.createProject.form.error.invalidDbUrl'));
  //         return;
  //       }
  //     }

  //     setModalStep((prev) => Math.min(prev + 1, 4));
  //   } catch (err) {
  //     const error = err as ValidateErrorEntity;
  //     if (error.errorFields) {
  //       forms[modalStep].scrollToField(error.errorFields[0].name, {
  //         behavior: 'smooth',
  //         block: 'center',
  //       });
  //     }
  //   }
  // };

  useEffect(() => {
    const controller = new AbortController();
    fetchProjects();
    return () => controller.abort();
  }, [fetchProjects]);

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
