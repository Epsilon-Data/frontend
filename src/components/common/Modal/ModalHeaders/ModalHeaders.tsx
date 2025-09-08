import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronBack } from 'react-icons/io5';
import { Button } from 'antd';
import clsx from 'clsx';

interface StepItemProps {
  active: boolean;
  children?: React.ReactNode;
}

const StepItem = ({ active, children }: StepItemProps) => {
  return <div className={clsx('h-1 flex-1 rounded-[2px]', active ? 'bg-[#1677ff]' : 'bg-[#ccc]')}>{children}</div>;
};

export type ModalStepHeaderProps = {
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  modalStep: number;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDraft: () => void;
  stepTitles: string[];
};

type ModalStepHeader = React.FC<ModalStepHeaderProps>;

export const ModalStepHeader: ModalStepHeader = ({
  setModalStep,
  modalStep,
  setIsModalOpen,
  handleDraft,
  stepTitles,
}) => {
  const { t } = useTranslation();

  const prevStep = () =>
    setModalStep((prev: number) => {
      const previous = Math.max(prev - 1, 0);

      if (prev === 0) {
        setIsModalOpen(false);
      }

      return previous;
    });

  return (
    <div className="flex justify-between bg-grey-4 h-24 rounded-t-lg">
      <div>
        <Button
          className="flex bg-grey-3 text-blueDark border-none rounded-r-full top-12 w-12 h-8 items-center"
          onClick={prevStep}
        >
          <IoChevronBack />
        </Button>
        <div className="flex flex-col ml-20">
          <div className="flex justify-center gap-2 mb-4 w-40">
            {stepTitles.map((title, index) => (
              <StepItem key={index} active={index <= modalStep}>
                <div className="h-1 bg-inherit rounded-[2px]" />
              </StepItem>
            ))}
          </div>
          <div className="font-bold font-inter text-grey-1 text-left">{stepTitles[modalStep]}</div>
        </div>
      </div>
      <div>
        <Button
          className="flex items-center h-10 border border-grey-3 bg-white text-blueDark text-xs font-medium font-inter m-8"
          hidden={modalStep == 0}
          onClick={handleDraft}
        >
          {t('dashboard.createProject.form.saveDraft')}
        </Button>
      </div>
    </div>
  );
};

export const ModalAccessHeader: React.FC<{ setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setIsModalOpen,
}) => {
  return (
    <div>
      <Button
        className="flex bg-grey-3 text-blueDark border-none rounded-r-full top-12 w-12 h-8 z-1"
        onClick={() => setIsModalOpen(false)}
      >
        <IoChevronBack />
      </Button>
    </div>
  );
};
