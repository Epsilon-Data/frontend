import { Button, Modal } from 'antd';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { ModalAccessHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { useBrowseModalContext } from '@app/hooks/useBrowseModalContext';
import { AboutDatasetPage } from './pages/AboutDatasetPage/AboutDatasetPage';
import { useNodesState, useEdgesState } from 'reactflow';
import { RequestAccessPage } from './pages/RequestAccessPage';
import { SubmissionResultPage } from './pages/SubmissionResultPage';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useState } from 'react';

type MultiStepBrowseModalProps = React.ComponentProps<typeof Modal>;

export const MultiStepBrowseModal = ({ ...modalProps }: MultiStepBrowseModalProps) => {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [members, setMembers] = useState<{ email: string; role: string }[]>([]);
  const { modalStep, setModalStep, setIsModalOpen, isModalOpen, form, project, isModalLoading } =
    useBrowseModalContext();

  const nextStep = async () => {
    try {
      form.validateFields();
      setModalStep((prev) => prev + 1);
    } catch (err) {
      const error = err as ValidateErrorEntity;
      if (error.errorFields) {
        form.scrollToField(error.errorFields[0].name, {
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  };

  const renderStep = () => {
    switch (modalStep) {
      case 0:
        return (
          <AboutDatasetPage
            project={project}
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setModalStep={setModalStep}
          />
        );
      case 1:
        return <RequestAccessPage project={project} form={form} members={members} setMembers={setMembers} />;
      case 2:
        return <SubmissionResultPage />;
      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (modalStep) {
      case 0:
        return null;
      case 1:
        return (
          <Button
            key="submit"
            type="primary"
            onClick={nextStep}
            icon={<IoChevronForwardOutline />}
            iconPosition="end"
            loading={isModalLoading}
            className="flex items-center w-60 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
          >
            {t('common.submit')}
          </Button>
        );
      case 2:
        return (
          <>
            <Button
              key="view-requests"
              disabled={isModalLoading}
              icon={<IoChevronBackOutline />}
              className="flex items-center h-9 text-blueDark text-xs font-medium font-inter"
            >
              {t('browse.createRequest.nextSteps.viewRequests')}
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={() => setIsModalOpen(false)}
              icon={<IoChevronForwardOutline />}
              iconPosition="end"
              loading={isModalLoading}
              className="flex items-center w-60 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
            >
              {t('browse.createRequest.nextSteps.return')}
            </Button>
          </>
        );
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
      footer={renderFooter()}
    >
      <div className="flex flex-col">
        <ModalAccessHeader setModalStep={setModalStep} modalStep={modalStep} setIsModalOpen={setIsModalOpen} />
        {renderStep()}
      </div>
    </Modal>
  );
};
