import React from 'react';
import * as S from './ModalHeader.styles';
import { useTranslation } from 'react-i18next';
import { IoChevronBack } from 'react-icons/io5';

export const ModalHeader: React.FC<{
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
  modalStep: number;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDraft: () => void;
}> = ({ setModalStep, modalStep, setIsModalOpen, handleDraft }) => {
  const { t } = useTranslation();
  const stepTitles = [
    t('dashboard.createProject.form.step1.title'),
    t('dashboard.createProject.form.step2.title'),
    t('dashboard.createProject.form.step3.title'),
    t('dashboard.createProject.form.step4.title'),
    t('dashboard.createProject.form.step5.title'),
  ];

  const prevStep = () =>
    setModalStep((prev: number) => {
      const previous = Math.max(prev - 1, 0);

      if (prev === 0) {
        setIsModalOpen(false);
      }

      return previous;
    });

  return (
    <S.StepHeader>
      <div>
        <S.BackButton onClick={prevStep}>
          <IoChevronBack />
        </S.BackButton>
        <S.StepWrapper>
          <S.StepIndicatorWrapper>
            {stepTitles.map((title, index) => (
              <S.StepItem key={index} active={index <= modalStep}>
                <S.StepBar />
              </S.StepItem>
            ))}
          </S.StepIndicatorWrapper>
          <S.StepTitle>{stepTitles[modalStep]}</S.StepTitle>
        </S.StepWrapper>
      </div>
      <div>
        <S.DraftButton hidden={modalStep == 0} onClick={handleDraft}>
          {t('dashboard.createProject.form.saveDraft')}
        </S.DraftButton>
      </div>
    </S.StepHeader>
  );
};
