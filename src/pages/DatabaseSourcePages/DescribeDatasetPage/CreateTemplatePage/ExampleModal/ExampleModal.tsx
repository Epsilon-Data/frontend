import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './ExampleModal.styles';
import ExampleTemplate from '@app/assets/images/example-template.svg?react';

export const ExampleModal: React.FC<{
  isExampleModalOpen: boolean;
  setIsExampleModalOpen: (value: boolean) => void;
}> = ({ isExampleModalOpen, setIsExampleModalOpen }) => {
  const { t } = useTranslation();

  return (
    <S.Modal
      centered
      open={isExampleModalOpen}
      onCancel={() => setIsExampleModalOpen(false)}
      footer={null}
      size="large"
    >
      <S.Instructions>{t('databaseSources.describeDataset.instructions.modal')}</S.Instructions>
      <ExampleTemplate style={{ width: '100%' }} />
    </S.Modal>
  );
};
