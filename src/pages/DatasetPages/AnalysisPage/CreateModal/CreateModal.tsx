import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './CreateModal.styles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';

export const CreateModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSubmit: (name: string) => void;
  loading: boolean;
}> = ({ isModalOpen, setIsModalOpen, onSubmit, loading }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  return (
    <S.Modal
      title={t('dataset.analysis.create.title')}
      centered
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      size="medium"
      footer={
        <BaseButton type="primary" onClick={() => onSubmit(name)} loading={loading} disabled={name.length == 0}>
          {t('common.submit')}
        </BaseButton>
      }
    >
      <BaseForm style={{ display: 'flex', flexDirection: 'column' }}>
        <S.Prompt>{t('dataset.analysis.create.prompt')}</S.Prompt>
        <BaseInput value={name} onChange={(e) => setName(e.target.value)} />
      </BaseForm>
    </S.Modal>
  );
};
