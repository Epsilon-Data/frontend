import config from '@app/config/config';
import { ProjectModalContext } from '@app/context/ProjectModal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

const getInitialFormValues = () => {
  if (config.isDev) {
    return {
      name: 'Test Project',
      lead: 'John Doe',
      university: 'Test University',
      faculty: 'Computer Science',
      ethicsId: 'ETH12345',
      description: 'This is a test project description',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      participantsNum: 100,
      dbType: 'postgres',
      dbUrl: 'postgresql://test_admin:supersecret@localhost:5433/test',
      username: 'test_admin',
      password: 'supersecret',
    };
  }

  return {
    name: '',
    lead: '',
    university: '',
    faculty: '',
    ethicsId: '',
    description: '',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    participantsNum: '',
    dbType: '',
    dbUrl: '',
    username: '',
    password: '',
  };
};

export const ProjectModalProvider = ({ children }: { children: React.ReactElement[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [step1] = Form.useForm();
  const [step2] = Form.useForm();
  const [step3] = Form.useForm();
  const [step4] = Form.useForm();

  const showModal = () => {
    const initialValues = getInitialFormValues();

    step1.setFieldsValue({
      name: initialValues.name,
    });

    step2.setFieldsValue({
      description: initialValues.description,
      startDate: dayjs(initialValues.startDate),
      endDate: dayjs(initialValues.endDate),
      participantsNum: initialValues.participantsNum,
    });

    step3.setFieldsValue({
      university: initialValues.university,
      faculty: initialValues.faculty,
      ethicsId: initialValues.ethicsId,
    });

    step4.setFieldsValue({
      dbName: initialValues.name,
      dbType: initialValues.dbType,
      dbUrl: initialValues.dbUrl,
      username: initialValues.username,
      password: initialValues.password,
    });
    setIsModalOpen(true);
    setModalStep(0);
  };

  const handleDraft = () => {};

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

  return <ProjectModalContext.Provider value={contextValue}>{...children}</ProjectModalContext.Provider>;
};
