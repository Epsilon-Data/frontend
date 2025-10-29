import { ArchetypeInfo, createArchetype, updateArchetype } from '@app/api/archetypes.api';
import { ColumnInfo, getDbColumns } from '@app/api/database.api';
import { ArchetypeModalContext, ModalMode } from '@app/context/ArchetypeModal';
import { Form } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ArchetypeModalProvider = ({
  children,
  mode,
}: {
  children: React.ReactElement[] | React.ReactElement;
  mode: ModalMode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [step1] = Form.useForm();
  const { t } = useTranslation();

  const fetchColumns = useCallback(async (projectId: string) => {
    try {
      const dbColumns = await getDbColumns(projectId);
      setColumns(dbColumns);
    } catch (error) {
      console.error('Failed to fetch columns for project:', error);
    }
  }, []);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
    setModalStep(0);
  }, [setIsModalOpen, setModalStep]);

  const handleDraft = useCallback(
    async (formData: unknown) => {
      const data = formData as ArchetypeInfo;

      try {
        console.log('Saving archetype draft:', data);
        if (mode === 'create') {
          await createArchetype(data);
        } else {
          if (!data.archetypeId) return;
          await updateArchetype(data.projectId, data.archetypeId, data);
        }
        message.success(t('project.createTemplate.form.draft.success'));
      } catch (error) {
        message.error(t('dashboard.createTemplate.form.draft.failed'));
      } finally {
        setIsModalOpen(false);
      }
    },
    [mode, t],
  );

  const forms = useMemo(() => [step1], [step1]);

  const contextValue = useMemo(
    () => ({
      mode,
      modalStep,
      forms,
      showModal,
      handleDraft,
      isModalOpen,
      setIsModalOpen,
      setModalStep,
      columns,
      setColumns,
      fetchColumns,
    }),
    [
      mode,
      modalStep,
      forms,
      showModal,
      handleDraft,
      isModalOpen,
      setIsModalOpen,
      setModalStep,
      columns,
      setColumns,
      fetchColumns,
    ],
  );

  return <ArchetypeModalContext.Provider value={contextValue}>{children}</ArchetypeModalContext.Provider>;
};
