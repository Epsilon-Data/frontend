import { ModalStepHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { Step4 } from './steps/step4';
import { Step5 } from './steps/Step5';
import { Modal } from 'antd';

export const MultiStepModal = ({ modalStep, ...modalProps }) => {
  const renderStepContent = () => {
    switch (modalStep) {
      case 0:
        return <Step1 form={step1} />;
      case 1:
        return (
          <Step2
            form={step2}
            members={members}
            setMembers={setMembers}
            dbKeywords={dbKeywords}
            setDbKeywords={setDbKeywords}
          />
        );
      case 2:
        return <Step3 form={step3} />;
      case 3:
        return (
          <Step4
            form={step4}
            isConnected={isConnected}
            isTestLoading={isTestLoading}
            showMessage={showMessage}
            onTestConnection={onTestConnection}
            dbTypeOptions={dbTypeOptions}
          />
        );
      case 4:
        return <Step5 />;
      default:
        return null;
    }
  };

  return (
    <Modal {...modalProps}>
      <div className="flex flex-col">
        <ModalStepHeader
          setModalStep={setModalStep}
          modalStep={modalStep}
          setIsModalOpen={setIsModalOpen}
          handleDraft={handleDraft}
          stepTitles={stepTitles}
        />
        {renderStepContent()}
      </div>
    </Modal>
  );
};
