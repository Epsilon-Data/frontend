import { ArchetypeModalContext } from '@app/context/ArchetypeModal';
import { Form } from 'antd';
import { useCallback, useMemo, useState } from 'react';

export const ArchetypeModalProvider = ({ children }: { children: React.ReactElement[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [step1] = Form.useForm();

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
    }),
    [modalStep, forms, showModal, handleDraft, isModalOpen, setIsModalOpen, setModalStep],
  );

  return <ArchetypeModalContext.Provider value={contextValue}>{...children}</ArchetypeModalContext.Provider>;
};
