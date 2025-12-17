import { DatabaseModalContext } from '@app/context/DatabaseModal';
import { Form } from 'antd';
import { useCallback, useMemo, useState } from 'react';

export const DatabaseModalProvider = ({ children }: { children: React.ReactElement[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [step1] = Form.useForm();
  const [step2] = Form.useForm();

  const showModal = useCallback(() => {
    setIsModalOpen(true);
    setModalStep(0);
  }, [setIsModalOpen, setModalStep]);

  const forms = useMemo(() => [step1, step2], [step1, step2]);

  const contextValue = useMemo(
    () => ({
      modalStep,
      forms,
      showModal,
      isModalOpen,
      setIsModalOpen,
      setModalStep,
    }),
    [modalStep, forms, showModal, isModalOpen, setIsModalOpen, setModalStep],
  );

  return <DatabaseModalContext.Provider value={contextValue}>{...children}</DatabaseModalContext.Provider>;
};
