import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './GenerateModal.styles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';

export const GenerateModal: React.FC<{
  name: string;
  setName: (name: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSubmit: (name: string) => void;
  loading: boolean;
}> = ({ name, setName, isModalOpen, setIsModalOpen, onSubmit, loading }) => {
  const { t } = useTranslation();

  return (
    <S.Modal
      title={t('dashboard.pat.generate.modal.title')}
      centered
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      size="medium"
      footer={
        <BaseButton type="primary" onClick={() => onSubmit(name)} loading={loading} disabled={name.length == 0}>
          {t('dashboard.pat.generate.modal.submit')}
        </BaseButton>
      }
    >
      <BaseForm style={{ display: 'flex', flexDirection: 'column' }}>
        <S.Prompt>{t('dashboard.pat.generate.modal.prompt')}</S.Prompt>
        <BaseInput value={name} onChange={(e) => setName(e.target.value)} />
      </BaseForm>
    </S.Modal>
  );
};
