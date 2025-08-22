import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useAppSelector } from '@app/hooks/reduxHooks';

import { Button, Form, Input, Modal, Radio, Select, Space } from 'antd';

import { IoChevronForwardOutline } from 'react-icons/io5';
import { ModalStepHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { ModalDatePicker } from '@app/components/common/Modal/ModalDatePicker/ModalDatePicker';
import { ModalTextArea } from '@app/components/common/Modal/ModalTextArea/ModalTextArea';
import { ModalFormList } from '@app/components/common/Modal/ModalFormList/ModalFormList';
import { ModalTagInput } from '@app/components/common/Modal/ModalTagInput/ModalTagInput';
import KeywordGuidance from '@app/components/common/Modal/KeywordGuidance/KeywordGuidance';
import { ModalSelect } from '@app/components/common/Modal/ModalSelect/ModalSelect';
import { TestConnectionGroup } from '@app/components/common/Modal/TestConnectionGroup/TestConnectionGroup';
import { testConnection } from '@app/api/connectionRequests.api';
import { createProject } from '@app/api/projects.api';

import config from '@app/config/config';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@app/hooks/useProjects';
import { DashboardHeader } from '@app/components/dashboard/DashboardHeader';
import { Projects } from '@app/components/dashboard/Projects';

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

const DashboardPage: React.FC = () => {
  const [step1] = Form.useForm();
  const [step2] = Form.useForm();
  const [step3] = Form.useForm();
  const [step4] = Form.useForm();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.user);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [dbKeywords, setDbKeywords] = useState<string[]>([]);
  const [isTestLoading, setTestLoading] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isFormLoading, setFormLoading] = useState(false);
  const [members, setMembers] = useState<{ email: string; role: string }[]>([]);

  const { ownedProjects, sharedProjects, loading, fetchProjects } = useProjects();

  const stepTitles = [
    t('dashboard.createProject.form.step1.title'),
    t('dashboard.createProject.form.step2.title'),
    t('dashboard.createProject.form.step3.title'),
    t('dashboard.createProject.form.step4.title'),
    t('dashboard.createProject.form.step5.title'),
  ];

  const dbTypeOptions = [
    { value: 'postgres', label: 'PostgreSQL' },
    { value: 'csv', label: 'CSV' },
  ];

  const nextStep = () => setModalStep((prev) => Math.min(prev + 1, 4));

  const handleChange = (value: string | string[]) => {
    console.log(`selected ${value}`);
  };

  const onTestConnection = async () => {
    setTestLoading(true);

    const { dbUrl } = step4.getFieldsValue(['dbUrl']);
    let url = dbUrl;

    try {
      url = new URL(dbUrl);
      const connectionData = {
        type: 'postgres',
        port: url.port,
        host: url.hostname,
        username: url.username,
        password: url.password,
        name: url.pathname.replace(/^\//, ''),
        ssl: false,
      };

      testConnection(connectionData)
        .then(() => {
          setConnected(true);
        })
        .catch((error) => {
          setConnected(false);
          console.log(error);
        });
    } catch (error) {
      setConnected(false);
    }

    setShowMessage(true);
    setTestLoading(false);
  };

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

  const handleCreate = async () => {
    setFormLoading(true);

    const formData = {
      ownerId: user?.id ?? '',
      name: step1.getFieldValue('name'),
      lead: (user?.firstName ?? '') + ' ' + (user?.lastName ?? ''),
      university: step3.getFieldValue('university'),
      faculty: step3.getFieldValue('faculty'),
      ethicsId: step3.getFieldValue('ethicsId'),
      description: step2.getFieldValue('description'),
      startDate: step2.getFieldValue('startDate'),
      endDate: step2.getFieldValue('endDate'),
      members: JSON.stringify(members),
      participantsNum: step2.getFieldValue('participantsNum'),
      dbKeywords: dbKeywords,
      connection: {
        orgAdminEmail: '',
        tempDbDetails: {
          name: step4.getFieldValue('dbName'),
          type: step4.getFieldValue('dbType'),
          url: step4.getFieldValue('dbUrl'),
          username: step4.getFieldValue('username'),
          password: step4.getFieldValue('password'),
        },
      },
    };

    try {
      await createProject(formData);
      setIsModalOpen(false);
      // Refresh the projects list after creating a new project
      await fetchProjects();
    } catch (error) {
      console.error('Project creation failed:', error);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDraft = () => {};

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <PageTitle>{t('dashboard.title')}</PageTitle>
      <DashboardHeader user={user} showModal={showModal} handleChange={handleChange} />
      <Projects sharedProjects={sharedProjects} ownedProjects={ownedProjects} layout={layout} />
      <Modal
        open={isModalOpen}
        width={'60%'}
        footer={[
          modalStep < 4 ? (
            <Button
              key="next"
              type="primary"
              onClick={nextStep}
              icon={<IoChevronForwardOutline />}
              iconPosition="end"
              className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
            >
              {t('common.next')}
            </Button>
          ) : (
            <Button
              key="submit"
              type="primary"
              onClick={handleCreate}
              icon={<IoChevronForwardOutline />}
              iconPosition="end"
              loading={isFormLoading}
              className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
            >
              {t('dashboard.createProject.form.submit')}
            </Button>
          ),
        ]}
        closable={false}
        mask
      >
        {modalStep === 0 && (
          <div className="flex flex-col">
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
              stepTitles={stepTitles}
            />
            <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
              <Form form={step1}>
                <ModalInput
                  name="name"
                  inputTitle={t('dashboard.createProject.form.step1.name.title')}
                  inputDescription={t('dashboard.createProject.form.step1.name.description')}
                  large
                />
              </Form>
            </div>
          </div>
        )}
        {modalStep === 1 && (
          <div className="flex flex-col">
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
              stepTitles={stepTitles}
            />
            <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
              <Form form={step2} className="h-full">
                <ModalDatePicker
                  startName="startDate"
                  endName="endDate"
                  inputTitle={t('dashboard.createProject.form.step2.duration.title')}
                  inputDescription={t('dashboard.createProject.form.step2.duration.description')}
                />
                <ModalTextArea
                  name="description"
                  inputTitle={t('dashboard.createProject.form.step2.description.title')}
                  inputDescription={t('dashboard.createProject.form.step2.description.description')}
                />
                <ModalInput
                  name="participantsNum"
                  inputTitle={t('dashboard.createProject.form.step2.participantsNum.title')}
                  inputDescription={t('dashboard.createProject.form.step2.participantsNum.description')}
                />
                <ModalFormList
                  name="members"
                  inputTitle={t('dashboard.createProject.form.step2.members.title')}
                  inputDescription={t('dashboard.createProject.form.step2.members.description')}
                  members={members}
                  setMembers={setMembers}
                  form={step2}
                />
                <ModalTagInput
                  name="dbKeywords"
                  inputTitle={t('dashboard.createProject.form.step2.dbKeywords.title')}
                  inputDescription={t('dashboard.createProject.form.step2.dbKeywords.description')}
                  value={dbKeywords}
                  setValue={setDbKeywords}
                />
                <KeywordGuidance />
              </Form>
            </div>
          </div>
        )}
        {modalStep === 2 && (
          <div className="flex flex-col">
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
              stepTitles={stepTitles}
            />
            <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
              <Form form={step3} className="h-full">
                <ModalInput name="university" inputTitle={t('dashboard.createProject.form.step3.university')} />
                <ModalInput name="faculty" inputTitle={t('dashboard.createProject.form.step3.faculty')} />
                <ModalInput name="ethicsId" inputTitle={t('dashboard.createProject.form.step3.ethicsId')} />
              </Form>
            </div>
          </div>
        )}
        {modalStep === 3 && (
          <div className="flex flex-col">
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
              stepTitles={stepTitles}
            />
            <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
              <Form form={step4} className="h-full">
                <ModalInput name="dbName" inputTitle={t('dashboard.createProject.form.step4.dbName')} />
                <ModalSelect
                  name="dbType"
                  inputTitle={t('dashboard.createProject.form.step4.dbType')}
                  options={dbTypeOptions}
                />
                <TestConnectionGroup
                  inputTitle={t('dashboard.createProject.form.step4.dbUrl.title')}
                  inputDescription={t('dashboard.createProject.form.step4.dbUrl.description')}
                  connected={isConnected}
                  loading={isTestLoading}
                  show={showMessage}
                  onClick={onTestConnection}
                />
              </Form>
            </div>
          </div>
        )}
        {modalStep === 4 && (
          <>
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
              stepTitles={stepTitles}
            />
            <div className="h-132 py-12 px-20 overflow-y-auto flex flex-col justify-center"></div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
