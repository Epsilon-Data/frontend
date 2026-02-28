import { ProjectModalContext } from '@app/context/ProjectModal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

export const ProjectModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [step1] = Form.useForm();
  const [step2] = Form.useForm();
  const [step3] = Form.useForm();
  const [step4] = Form.useForm();

  const showModal = useCallback(() => {
    step2.setFieldsValue({
      description: '',
      startDate: dayjs(new Date().toISOString()),
      endDate: dayjs(new Date().toISOString()),
    });

    setIsModalOpen(true);
    setModalStep(0);
  }, [step2, setIsModalOpen, setModalStep]);

  const handleDraft = useCallback(() => {}, []);

  const forms = useMemo(() => [step1, step2, step3, step4], [step1, step2, step3, step4]);

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

  return <ProjectModalContext.Provider value={contextValue}>{children}</ProjectModalContext.Provider>;
};
