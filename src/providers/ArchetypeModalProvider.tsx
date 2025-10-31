import { ColumnInfo, getDbColumns } from '@app/api/database.api';
import { ArchetypeModalContext } from '@app/context/ArchetypeModal';
import { Form } from 'antd';
import { useCallback, useMemo, useState } from 'react';

export const ArchetypeModalProvider = ({ children }: { children: React.ReactElement[] | React.ReactElement }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [step1] = Form.useForm();

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

  const handleDraft = useCallback(() => {}, []);

  const forms = useMemo(() => [step1], [step1]);

  const contextValue = useMemo(
    () => ({
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
