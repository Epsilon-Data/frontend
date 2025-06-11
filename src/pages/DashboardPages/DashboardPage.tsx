import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useAppSelector } from '@app/hooks/reduxHooks';
import * as S from './DashboardPage.styles';
import { IoSearch } from 'react-icons/io5';
import { Form, Radio, Space } from 'antd';
import { IoIosArrowDown } from 'react-icons/io';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiMiniListBullet } from 'react-icons/hi2';
import { FaPlus } from 'react-icons/fa6';
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
import { createProject, getUserProjects, ProjectSummaryInfo } from '@app/api/projects.api';
import { ProjectList } from '@app/components/ProjectList/ProjectList';
import { LAYOUT } from '@app/styles/themes/constants';
import config from '@app/config/config';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

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
    startDate: '',
    endDate: '',
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
  const [projects, setProjects] = useState<ProjectSummaryInfo[]>([]);

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
      members: members.map((m) => JSON.stringify(m)),
      participantsNum: step2.getFieldValue('participantsNum'),
      dbKeywords: dbKeywords,
      connection: {
        orgAdminEmail: '',
        tempDbDetails: JSON.stringify({
          name: step4.getFieldValue('dbName'),
          type: step4.getFieldValue('dbType'),
          url: step4.getFieldValue('dbUrl'),
          username: step4.getFieldValue('username'),
          password: step4.getFieldValue('password'),
        }),
      },
    };

    createProject(formData);
    setFormLoading(false);
    setIsModalOpen(false);
  };

  const fetch = useCallback(() => {
    getUserProjects().then((res) => {
      setProjects(res);
    });
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleDraft = () => {};

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/db-mapping?id=${projectId}`);
  };

  return (
    <div style={{ padding: LAYOUT.desktop.paddingVertical + ' ' + LAYOUT.desktop.paddingHorizontal }}>
      <PageTitle>{t('dashboard.title')}</PageTitle>
      <S.HeaderWrapper>
        <S.Title>{user?.firstName + "'s workspace"}</S.Title>
        <S.ToolsWrapper>
          <Space.Compact style={{ border: '1px solid var(--grey2)', borderRadius: '0.5rem' }}>
            <S.SearchBar
              prefix={<IoSearch style={{ marginRight: '0.5rem', color: 'var(--grey1)' }} />}
              placeholder="Search projects..."
            />
          </Space.Compact>
          <S.SortingSelect
            className="sort-select"
            prefix="Sort by: "
            defaultValue="date-created"
            suffixIcon={<IoIosArrowDown style={{ marginTop: '0.2rem' }} />}
            style={{ width: 200 }}
            onChange={handleChange}
            options={[
              { value: 'date-created', label: 'Date created' },
              { value: 'title', label: 'Title' },
              { value: 'last-modified', label: 'Last modified' },
            ]}
          />
          <Space>
            <S.LayoutSelector value={layout} onChange={(e) => setLayout(e.target.value)}>
              <Radio.Button value="grid">
                <HiOutlineViewGrid />
              </Radio.Button>
              <Radio.Button value="list">
                <HiMiniListBullet />
              </Radio.Button>
            </S.LayoutSelector>
          </Space>
          <S.AddProjectButton type="primary" icon={<FaPlus />} onClick={showModal}>
            {t('dashboard.main.newProject')}
          </S.AddProjectButton>
        </S.ToolsWrapper>
      </S.HeaderWrapper>
      <S.ProjectsWrapper style={{ marginTop: '3rem' }}>
        <S.ProjectsHeader>{t('dashboard.main.personalProjects.title')}</S.ProjectsHeader>
        <S.ProjectsDescription>{t('dashboard.main.personalProjects.description')}</S.ProjectsDescription>
        <ProjectList projects={projects} mode="personal" layout={layout} onProjectClick={handleProjectClick} />
      </S.ProjectsWrapper>
      <S.ProjectsWrapper style={{ marginTop: '5rem' }}>
        <S.ProjectsHeader>{t('dashboard.main.sharedProjects.title')}</S.ProjectsHeader>
        <S.ProjectsDescription>{t('dashboard.main.sharedProjects.description')}</S.ProjectsDescription>
        <ProjectList projects={projects} mode="shared" layout={layout} onProjectClick={handleProjectClick} />
      </S.ProjectsWrapper>
      <S.AddProjectModal
        open={isModalOpen}
        width={'60%'}
        footer={[
          modalStep < 4 ? (
            <S.ModalButton
              key="next"
              type="primary"
              onClick={nextStep}
              icon={<IoChevronForwardOutline />}
              iconPosition="end"
            >
              {t('common.next')}
            </S.ModalButton>
          ) : (
            <S.ModalButton
              key="submit"
              type="primary"
              onClick={handleCreate}
              icon={<IoChevronForwardOutline />}
              iconPosition="end"
              loading={isFormLoading}
            >
              {t('dashboard.createProject.title')}
            </S.ModalButton>
          ),
        ]}
        closable={false}
        mask
      >
        {modalStep === 0 && (
          <S.ModalBody>
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
            />
            <S.StepContent>
              <Form form={step1}>
                <ModalInput
                  name="name"
                  inputTitle={t('dashboard.createProject.form.step1.name.title')}
                  inputDescription={t('dashboard.createProject.form.step1.name.description')}
                  large
                />
              </Form>
            </S.StepContent>
          </S.ModalBody>
        )}
        {modalStep === 1 && (
          <S.ModalBody>
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
            />
            <S.StepContent>
              <Form form={step2} style={{ height: '100%' }}>
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
            </S.StepContent>
          </S.ModalBody>
        )}
        {modalStep === 2 && (
          <S.ModalBody>
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
            />
            <S.StepContent>
              <Form form={step3} style={{ height: '100%' }}>
                <ModalInput name="university" inputTitle={t('dashboard.createProject.form.step3.university')} />
                <ModalInput name="faculty" inputTitle={t('dashboard.createProject.form.step3.faculty')} />
                <ModalInput name="ethicsId" inputTitle={t('dashboard.createProject.form.step3.ethicsId')} />
              </Form>
            </S.StepContent>
          </S.ModalBody>
        )}
        {modalStep === 3 && (
          <S.ModalBody>
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
            />
            <S.StepContent>
              <Form form={step4} style={{ height: '100%' }}>
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
            </S.StepContent>
          </S.ModalBody>
        )}
        {modalStep === 4 && (
          <>
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
            />
            <S.StepContent></S.StepContent>
          </>
        )}
      </S.AddProjectModal>
    </div>
  );
};

export default DashboardPage;
