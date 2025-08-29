import { ProjectDetailsStep } from './steps/ProjectDetailsStep';
import { UniversityDetailsStep } from './steps/UniversityDetailsStep';
import { DatabaseConnectionStep } from './steps/DatabaseConnectionStep';
import { ConfirmStep } from './steps/ConfirmStep';
import { Button, Modal, message } from 'antd';
import { ProjectNameStep } from './steps/ProjectNameStep';
import { IoChevronForwardOutline } from 'react-icons/io5';

import { useState } from 'react';
import { createProject } from '@app/api/projects.api';
import { useTranslation } from 'react-i18next';
import { ModalStepHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useProjectModalContext } from '@app/hooks/useProjectModalContext';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

type MultiStepProjectModalProps = {
  fetchProjects: () => Promise<void>;
} & React.ComponentProps<typeof Modal>;

export const MultiStepProjectModal = ({ fetchProjects, ...modalProps }: MultiStepProjectModalProps) => {
  const [isFormLoading, setFormLoading] = useState(false);
  const { modalStep, setModalStep, setIsModalOpen, isModalOpen, handleDraft, forms } = useProjectModalContext();
  const user = useAppSelector((state) => state.user.user);

  const [step1, step2, step3, step4] = forms;
  const [dbKeywords, setDbKeywords] = useState<string[]>([]);
  const [members, setMembers] = useState<{ email: string; role: string }[]>([]);
  const { t } = useTranslation();
  const [showMessage, setShowMessage] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const nextStep = async () => {
    try {
      await forms[modalStep].validateFields();

      if (modalStep === 3) {
        if (!isConnected) {
          message.error(t('dashboard.createProject.form.error.invalidDbUrl'));
          return;
        }
      }

      setModalStep((prev) => Math.min(prev + 1, 4));
    } catch (err) {
      const error = err as ValidateErrorEntity;
      if (error.errorFields) {
        forms[modalStep].scrollToField(error.errorFields[0].name, {
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  };

  const stepTitles = [
    t('dashboard.createProject.form.step1.title'),
    t('dashboard.createProject.form.step2.title'),
    t('dashboard.createProject.form.step3.title'),
    t('dashboard.createProject.form.step4.title'),
    t('dashboard.createProject.form.step5.title'),
  ];

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
      console.log('Creating project with data:', formData);
      await createProject(formData);
      setIsModalOpen(false);
      await fetchProjects();
    } catch (error) {
      console.error('Project creation failed:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const renderStep = () => {
    switch (modalStep) {
      case 0:
        return <ProjectNameStep form={step1} />;
      case 1:
        return (
          <ProjectDetailsStep
            form={step2}
            members={members}
            setMembers={setMembers}
            dbKeywords={dbKeywords}
            setDbKeywords={setDbKeywords}
          />
        );
      case 2:
        return <UniversityDetailsStep form={step3} />;
      case 3:
        return (
          <DatabaseConnectionStep
            form={step4}
            showMessage={showMessage}
            setShowMessage={setShowMessage}
            isConnected={isConnected}
            setConnected={setConnected}
          />
        );
      case 4:
        return <ConfirmStep />;
      default:
        return null;
    }
  };

  return (
    <Modal
      maskClosable={true}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      {...modalProps}
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
    >
      <div className="flex flex-col">
        <ModalStepHeader
          setModalStep={setModalStep}
          modalStep={modalStep}
          setIsModalOpen={setIsModalOpen}
          handleDraft={handleDraft}
          stepTitles={stepTitles}
        />
        {renderStep()}
      </div>
    </Modal>
  );
};
