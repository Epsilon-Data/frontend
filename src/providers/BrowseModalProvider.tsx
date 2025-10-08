import { getProjectDetails } from '@app/api/projects.api';
import { ProjectInfo } from '@app/api/projects.api';
import { BrowseModalContext } from '@app/context/BrowseModal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

export const BrowseModalProvider = ({ children }: { children: React.ReactElement[] }) => {
  const [project, setProject] = useState<ProjectInfo>({} as ProjectInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [form] = Form.useForm();

  const showModal = useCallback(
    async (projectId: string) => {
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
      }
    },
    [form, setIsModalOpen, setModalStep],
  );

  const validateMembers = useCallback((emails: string[]) => {
    const seen = new Set<string>();
    const invalid: string[] = [];
    const duplicates: string[] = [];
    const normalized: string[] = [];
    const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

    for (const e of emails || []) {
      if (!isEmail(e)) {
        invalid.push(e);
        continue;
      }

      if (seen.has(e)) {
        duplicates.push(e);
        continue;
      }

      seen.add(e);
      normalized.push(e);
    }

    return { normalized, invalid, duplicates };
  }, []);

  const contextValue = useMemo(
    () => ({
      isModalOpen,
      setIsModalOpen,
      modalStep,
      setModalStep,
      showModal,
      form,
      project,
      validateMembers,
    }),
    [isModalOpen, setIsModalOpen, modalStep, setModalStep, showModal, form, project, validateMembers],
  );

  return <BrowseModalContext.Provider value={contextValue}>{...children}</BrowseModalContext.Provider>;
};
