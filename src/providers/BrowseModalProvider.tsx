import { ArchetypeInfo, getPublishedArchetype } from '@app/api/archetypes.api';
import { getProjectPublicDetails, Member } from '@app/api/projects.api';
import { ProjectInfo } from '@app/api/projects.api';
import { BrowseModalContext } from '@app/context/BrowseModal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

export const BrowseModalProvider = ({ children }: { children: React.ReactElement[] }) => {
  const [project, setProject] = useState<ProjectInfo>({} as ProjectInfo);
  const [archetype, setArchetype] = useState<ArchetypeInfo>({} as ArchetypeInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [form] = Form.useForm();

  const showModal = useCallback(
    async (projectId: string) => {
      try {
        const selectedProject = await getProjectPublicDetails(projectId);
        const publishedArchetype = await getPublishedArchetype(projectId);
        setProject(selectedProject);
        setArchetype(publishedArchetype);
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

  const validateMembers = useCallback((members: Member[]) => {
    const seen = new Set<Member>();
    const invalid: Member[] = [];
    const duplicates: Member[] = [];
    const normalized: Member[] = [];
    const isEmail = (m: Member) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email ?? '');

    for (const m of members || []) {
      if (!isEmail(m)) {
        invalid.push(m);
        continue;
      }

      if (seen.has(m)) {
        duplicates.push(m);
        continue;
      }

      seen.add(m);
      normalized.push(m);
    }

    return { normalized, invalid, duplicates };
  }, []);

  const contextValue = useMemo(
    () => ({
      archetype,
      isModalOpen,
      setIsModalOpen,
      modalStep,
      setModalStep,
      showModal,
      form,
      project,
      validateMembers,
    }),
    [archetype, isModalOpen, setIsModalOpen, modalStep, setModalStep, showModal, form, project, validateMembers],
  );

  return <BrowseModalContext.Provider value={contextValue}>{...children}</BrowseModalContext.Provider>;
};
