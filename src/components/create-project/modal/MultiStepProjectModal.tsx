import { UniversityDetailsStep } from './steps/UniversityDetailsStep';
import { DatabaseConnectionStep } from './steps/DatabaseConnectionStep';
import { ConfirmStep } from './steps/ConfirmStep';
import { Button, Modal, message } from 'antd';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

import { useState } from 'react';
import { createProject } from '@app/api/projects.api';
import { useTranslation } from 'react-i18next';
import { ModalStepHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useProjectModalContext } from '@app/hooks/useProjectModalContext';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { AboutProjectStep } from './steps/AboutProjectStep';
import { buildDatabaseUrl } from '@app/utils/databaseUrl';

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
  const [dbUrl, setDbUrl] = useState('');

  const nextStep = async () => {
    try {
      await forms[modalStep].validateFields();

      if (modalStep === 2) {
        if (!isConnected && step3.getFieldValue('hasCreds')) {
          message.error(t('dashboard.createProject.form.error.invalidDbUrl'));
          return;
        }
      }

      setModalStep((prev) => Math.min(prev + 1, 3));
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

  const prevStep = () => setModalStep((prev) => Math.max(prev - 1, 0));

  const stepTitles = [
    t('dashboard.createProject.form.step1.title'),
    t('dashboard.createProject.form.step2.title'),
    t('dashboard.createProject.form.step3.title'),
    t('dashboard.createProject.form.step4.title'),
  ];

  const handleCreate = async () => {
    setFormLoading(true);

    const [startDate, endDate] = step1.getFieldValue('duration') || [];

    const rawDbUrl = dbUrl?.trim() ?? '';

    const type = step3.getFieldValue('dbType') || '';
    const host = step3.getFieldValue('hostname') || '';
    const port = step3.getFieldValue('port') || '';
    const username = step3.getFieldValue('username') || '';
    const password = step3.getFieldValue('password') || '';
    const name = step3.getFieldValue('name') || '';
    const ssl = step3.getFieldValue('ssl') || false;

    let finalUrl = rawDbUrl;
    if (!finalUrl) {
      const built = buildDatabaseUrl({ type, host, port, username, password, name, ssl });
      if (built) finalUrl = built;
    }

    let parsedUrl: URL | null = null;
    if (finalUrl) {
      try {
        parsedUrl = new URL(finalUrl);
      } catch {
        console.warn('Invalid DB URL generated/provided, skipping parsing.');
      }
    }

    const formData = {
      ownerId: user?.sub ?? '',
      name: step1.getFieldValue('name'),
      lead: (user?.given_name ?? '') + ' ' + (user?.family_name ?? ''),
      university: step2.getFieldValue('university'),
      faculty: step2.getFieldValue('faculty'),
      ethicsId: step2.getFieldValue('ethicsId'),
      description: step1.getFieldValue('description'),
      startDate: startDate?.toDate() || null,
      endDate: endDate?.toDate() || null,
      members: members,
      participantsNum: step1.getFieldValue('participantsNum'),
      dbKeywords: dbKeywords,
      connection: {
        orgAdminEmail: step3.getFieldValue('orgAdminEmail'),
        dbDetails: {
          name: name || parsedUrl?.pathname.replace(/^\//, '') || '',
          type: type || (parsedUrl?.protocol.replace(':', '') ?? ''),
          host: host || parsedUrl?.hostname || '',
          port: port || parsedUrl?.port || '',
          url: finalUrl || undefined,
          username: username || parsedUrl?.username || '',
          password: password || parsedUrl?.password || '',
          ssl,
        },
      },
    };

    console.log(formData);

    try {
      await step4.validateFields();
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
        return (
          <AboutProjectStep
            form={step1}
            members={members}
            setMembers={setMembers}
            dbKeywords={dbKeywords}
            setDbKeywords={setDbKeywords}
          />
        );
      case 1:
        return <UniversityDetailsStep form={step2} />;
      case 2:
        return (
          <DatabaseConnectionStep
            form={step3}
            showMessage={showMessage}
            setShowMessage={setShowMessage}
            isConnected={isConnected}
            setConnected={setConnected}
            setDbUrl={setDbUrl}
          />
        );
      case 3:
        return <ConfirmStep form={step4} />;
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
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            {modalStep > 0 && (
              <Button
                key="back"
                onClick={prevStep}
                disabled={isFormLoading}
                icon={<IoChevronBackOutline />}
                className="flex items-center h-9 text-blueDark text-xs font-medium font-inter"
              >
                {t('common.back')}
              </Button>
            )}
          </div>
          <div>
            {modalStep < 3 ? (
              <Button
                key="next"
                type="primary"
                onClick={nextStep}
                icon={<IoChevronForwardOutline />}
                iconPlacement="end"
                className="flex items-center w-60 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
              >
                {t('common.next')}
              </Button>
            ) : (
              <Button
                key="submit"
                type="primary"
                onClick={handleCreate}
                icon={<IoChevronForwardOutline />}
                iconPlacement="end"
                loading={isFormLoading}
                className="flex items-center w-60 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
              >
                {t('common.submit')}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        <ModalStepHeader modalStep={modalStep} handleDraft={handleDraft} stepTitles={stepTitles} />
        {renderStep()}
      </div>
    </Modal>
  );
};
