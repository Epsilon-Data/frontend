import { ArchetypeInfo, createArchetype, updateArchetype } from '@app/api/archetypes.api';
import { ColumnInfo, DatabaseTableInfo, getDbColumns, getDbTableInfo } from '@app/api/database.api';
import { ArchetypeModalContext, ModalMode } from '@app/context/ArchetypeModal';
import { Form } from 'antd';
import { useCallback, useMemo, useState } from 'react';

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
  const [tables, setTables] = useState<DatabaseTableInfo[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [step1] = Form.useForm();

  const fetchColumns = useCallback(async (projectId: string) => {
    try {
      const dbColumns = await getDbColumns(projectId);
      setColumns(dbColumns);
    } catch (error) {
      console.error('Failed to fetch columns for project:', error);
    }
  }, []);

  const fetchTables = useCallback(async (projectId: string) => {
    setTablesLoading(true);
    try {
      const dbTables = await getDbTableInfo(projectId);
      setTables(dbTables);
    } catch (error) {
      console.error('Failed to fetch tables for project:', error);
    } finally {
      setTablesLoading(false);
    }
  }, []);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
    setModalStep(0);
  }, [setIsModalOpen, setModalStep]);

  const handleDraft = useCallback(
    async (formData: unknown) => {
      const data = formData as ArchetypeInfo;
      console.log('Saving archetype draft:', data);
      if (mode === 'create') {
        await createArchetype(data);
      } else {
        if (!data.archetypeId) return;
        await updateArchetype(data.projectId, data.archetypeId, data);
      }
    },
    [mode],
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
      tables,
      tablesLoading,
      fetchTables,
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
      tables,
      tablesLoading,
      fetchTables,
    ],
  );

  return <ArchetypeModalContext.Provider value={contextValue}>{children}</ArchetypeModalContext.Provider>;
};
