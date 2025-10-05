import { getProjectDetails } from '@app/api/projects.api';
import { ProjectInfo } from '@app/api/projects.api';
import { BrowseModalContext } from '@app/context/BrowseModal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

export const BrowseModalProvider = ({ children }: { children: React.ReactElement[] }) => {
  const [project, setProject] = useState<ProjectInfo>({} as ProjectInfo);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [form] = Form.useForm();

  const showModal = useCallback(
    async (projectId: string) => {
      setIsModalLoading(true);
      try {
        const selectedProject = await getProjectDetails(projectId);
        setProject(selectedProject);
        form.setFieldsValue({
          description: '',
          startDate: dayjs(new Date().toISOString()),
          endDate: dayjs(new Date().toISOString()),
        });

        setIsModalOpen(true);
        setModalStep(0);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setIsModalLoading(false);
      }
    },
    [form, setIsModalOpen, setModalStep],
  );

  const contextValue = useMemo(
    () => ({
      isModalOpen,
      setIsModalOpen,
      modalStep,
      setModalStep,
      showModal,
      form,
      project,
      isModalLoading,
    }),
    [isModalOpen, setIsModalOpen, modalStep, setModalStep, showModal, form, project, isModalLoading],
  );

  return <BrowseModalContext.Provider value={contextValue}>{...children}</BrowseModalContext.Provider>;
};
