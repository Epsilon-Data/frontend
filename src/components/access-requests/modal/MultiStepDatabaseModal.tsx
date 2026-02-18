import { DatabaseConnectionStep } from './steps/DatabaseConnectionStep';
import { ConfirmStep } from './steps/ConfirmStep';
import { Button, Modal, message } from 'antd';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalStepHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { approveRequest } from '@app/api/connectionRequests.api';
import { updateCredentials } from '@app/api/projects.api';
import { useDatabaseModalContext } from '@app/hooks/useDatabaseModalContext';
import { buildDatabaseUrl } from '@app/utils/databaseUrl';

type MultiStepDatabaseModalProps = {
  fetchRequests?: () => Promise<void>;
  requestId?: string;
  projectId: string;
} & React.ComponentProps<typeof Modal>;

export const MultiStepDatabaseModal = ({
  fetchRequests,
  requestId,
  projectId,
  ...modalProps
}: MultiStepDatabaseModalProps) => {
  const [isFormLoading, setFormLoading] = useState(false);
  const { modalStep, setModalStep, setIsModalOpen, isModalOpen, forms } = useDatabaseModalContext();

  const [step1, step2] = forms;
  const { t } = useTranslation();
  const [showMessage, setShowMessage] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [dbUrl, setDbUrl] = useState('');

  const nextStep = async () => {
    try {
      await forms[modalStep].validateFields();

      if (modalStep === 0 && !isConnected) {
        message.error(t('dashboard.createProject.form.error.invalidDbUrl'));
        return;
      }

      setModalStep((prev) => Math.min(prev + 1, 1));
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

  const stepTitles = [t('dashboard.createProject.form.step3.title'), t('dashboard.createProject.form.step4.title')];

  const handleApproval = async () => {
    setFormLoading(true);

    const rawDbUrl = dbUrl?.trim() ?? '';

    const type = step1.getFieldValue('dbType') || '';
    const host = step1.getFieldValue('hostname') || '';
    const port = step1.getFieldValue('port') || '';
    const username = step1.getFieldValue('username') || '';
    const password = step1.getFieldValue('password') || '';
    const name = step1.getFieldValue('name') || '';
    const ssl = step1.getFieldValue('ssl') || false;

    let finalUrl = rawDbUrl;
    if (!finalUrl) {
      const built = buildDatabaseUrl({ type, host, port, username, password, name, ssl });
      if (built) {
        finalUrl = built;
      }
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
      isApproved: true,
      dbDetails: {
        name: name || parsedUrl?.pathname.replace(/^\//, '') || '',
        type: type || (parsedUrl?.protocol.replace(':', '') ?? ''),
        host: host || parsedUrl?.hostname || '',
        port: port || parsedUrl?.port || '',
        url: finalUrl || undefined,
        username: username || parsedUrl?.username || '',
        password: password || parsedUrl?.password || '',
        ssl: ssl || parsedUrl?.searchParams.get('sslmode')?.toLowerCase() !== 'disable' || false,
      },
    };

    try {
      await step2.validateFields();
      if (requestId && fetchRequests) {
        console.log('Approving request with data:', formData);
        await approveRequest(formData, projectId, requestId);
        await fetchRequests();
      } else {
        console.log('Updating credentials with data:', formData);
        await updateCredentials(formData, projectId);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Request approval failed:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const renderStep = () => {
    switch (modalStep) {
      case 0:
        return (
          <DatabaseConnectionStep
            form={step1}
            showMessage={showMessage}
            setShowMessage={setShowMessage}
            isConnected={isConnected}
            setConnected={setConnected}
            setDbUrl={setDbUrl}
          />
        );
      case 1:
        return <ConfirmStep form={step2} />;
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
            {modalStep < 1 ? (
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
                onClick={handleApproval}
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
        <ModalStepHeader modalStep={modalStep} stepTitles={stepTitles} />
        {renderStep()}
      </div>
    </Modal>
  );
};
