import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronBack } from 'react-icons/io5';
import { Breadcrumb, Button } from 'antd';
import clsx from 'clsx';

export type ModalStepHeaderProps = {
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  modalStep: number;
  handleDraft: () => void;
  stepTitles: string[];
};

export type ModalAccessHeaderProps = {
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  modalStep: number;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ModalStepHeader: React.FC<ModalStepHeaderProps> = ({
  setModalStep,
  modalStep,
  handleDraft,
  stepTitles,
}) => {
  const { t } = useTranslation();

  const goToStep = (step: number) => {
    const next = Math.max(0, Math.min(step, stepTitles.length - 1));
    setModalStep(next);
  };

  const breadcrumbItems = stepTitles.map((title, index) => ({
    title: (
      <button
        type="button"
        onClick={() => goToStep(index)}
        className={clsx(
          'bg-transparent border-none cursor-pointer p-0',
          index === modalStep ? 'text-[#1677ff]' : 'text-grey-2 hover:text-grey-1',
        )}
      >
        {index + 1}. {title}
      </button>
    ),
  }));

  return (
    <div className="flex justify-between bg-grey-4 h-18 rounded-t-lg">
      <div>
        <Breadcrumb className="my-6 mx-4" separator=">" items={breadcrumbItems} />
      </div>
      <div>
        <Button
          className="flex items-center h-10 border border-grey-3 bg-white text-blueDark text-xs font-medium font-inter m-4"
          hidden={modalStep == 0}
          onClick={handleDraft}
        >
          {t('common.saveDraft')}
        </Button>
      </div>
    </div>
  );
};

export const ModalAccessHeader: React.FC<ModalAccessHeaderProps> = ({ setModalStep, modalStep, setIsModalOpen }) => {
  const handleClick = () => {
    if (modalStep > 0) {
      setModalStep((prev) => prev - 1);
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <Button
        className="flex bg-grey-3 text-blueDark border-none rounded-r-full top-12 w-12 h-8 z-10"
        onClick={handleClick}
      >
        <IoChevronBack />
      </Button>
    </div>
  );
};
