import { Button, Modal } from 'antd';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { ModalAccessHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { useBrowseModalContext } from '@app/hooks/useBrowseModalContext';
import { AboutDatasetPage } from './pages/AboutDatasetPage/AboutDatasetPage';
import { Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';
import { RequestAccessPage } from './pages/RequestAccessPage';
import { SubmissionResultPage } from './pages/SubmissionResultPage';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useState } from 'react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { createRequest } from '@app/api/analysisRequests.api';

type MultiStepBrowseModalProps = React.ComponentProps<typeof Modal>;

export const MultiStepBrowseModal = ({ ...modalProps }: MultiStepBrowseModalProps) => {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [isFormLoading, setFormLoading] = useState(false);
  const { modalStep, setModalStep, setIsModalOpen, isModalOpen, form, project, validateMembers } =
    useBrowseModalContext();
  const user = useAppSelector((state) => state.user.user);

  const createAnalysisRequest = async () => {
    setFormLoading(true);
    const { normalized, invalid, duplicates } = validateMembers(members);
    if (invalid.length || duplicates.length) {
      form.setFields([
        {
          name: 'projectMembers',
          errors: [
            invalid.length ? `Invalid email(s): ${invalid.join(', ')}` : '',
            duplicates.length ? `Duplicate email(s): ${duplicates.join(', ')}` : '',
          ].filter(Boolean),
        },
      ]);
      form.scrollToField('projectMembers', { behavior: 'smooth', block: 'center' });
      setFormLoading(false);
      return;
    }

    const [startDate, endDate] = form.getFieldValue('projectDuration') || [];

    const formData = {
      requestorId: user?.sub,
      projectId: project.projectId || '',
      requestorName: user?.given_name + ' ' + user?.family_name || '',
      requestorEmail: user?.email || '',
      requestorOrgName: '',
      requestorPosition: '',
      projectName: form.getFieldValue('projectName'),
      projectStartDate: startDate?.toDate() || null,
      projectEndDate: endDate?.toDate() || null,
      projectDescription: form.getFieldValue('projectDescription'),
      projectEthicsId: form.getFieldValue('projectEthicsId'),
      projectObjective: form.getFieldValue('projectObjective'),
      projectOutcome: form.getFieldValue('projectOutcome'),
      projectMembers: normalized.map((email) => ({ email })),
    };

    try {
      await form.validateFields();
      console.log('Creating access request with data:', formData);
      await createRequest(formData);
      setModalStep((prev) => prev + 1);
    } catch (err) {
      const error = err as ValidateErrorEntity;
      if (error.errorFields) {
        form.scrollToField(error.errorFields[0].name, {
          behavior: 'smooth',
          block: 'center',
        });
      }
    } finally {
      setFormLoading(false);
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
            onClick={createAnalysisRequest}
            icon={<IoChevronForwardOutline />}
            iconPosition="end"
            loading={isFormLoading}
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
              icon={<IoChevronBackOutline />}
              className="flex items-center h-9 text-blueDark text-xs font-medium font-inter"
            >
              {t('browse.createRequest.nextSteps.viewRequests')}
            </Button>
            <Button
              key="return"
              type="primary"
              onClick={() => setIsModalOpen(false)}
              icon={<IoChevronForwardOutline />}
              iconPosition="end"
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
