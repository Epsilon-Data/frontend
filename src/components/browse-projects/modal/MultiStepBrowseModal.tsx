import { Button, Modal } from 'antd';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { ModalAccessHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
// import { useAppSelector } from '@app/hooks/reduxHooks';
import { useBrowseModalContext } from '@app/hooks/useBrowseModalContext';
import { AboutDatasetPage } from './pages/AboutDatasetPage/AboutDatasetPage';
import { useNodesState, useEdgesState } from 'reactflow';

type MultiStepBrowseModalProps = React.ComponentProps<typeof Modal>;

export const MultiStepBrowseModal = ({ ...modalProps }: MultiStepBrowseModalProps) => {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { modalStep, setModalStep, setIsModalOpen, isModalOpen, project, isModalLoading } = useBrowseModalContext();
  // const user = useAppSelector((state) => state.user.user);

  const prevStep = () => setModalStep((prev) => Math.max(prev - 1, 0));

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
          />
        );
      case 1:
        return;
      case 2:
        return;
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
              onClick={prevStep}
              disabled={isModalLoading}
              icon={<IoChevronBackOutline />}
              className="flex items-center h-9 text-blueDark text-xs font-medium font-inter"
            >
              {t('common.back')}
            </Button>
            <Button
              key="submit"
              type="primary"
              icon={<IoChevronForwardOutline />}
              iconPosition="end"
              loading={isModalLoading}
              className="flex items-center w-60 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
            >
              {t('common.submit')}
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
