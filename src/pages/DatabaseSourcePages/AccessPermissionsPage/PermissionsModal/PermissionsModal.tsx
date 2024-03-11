import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './PermissionsModal.styles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

export const PermissionsModal: React.FC<{
  currentRole: string;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSubmit: (checkedValues: Array<CheckboxValueType>) => void;
  loading: boolean;
}> = ({ currentRole, isModalOpen, setIsModalOpen, onSubmit, loading }) => {
  const { t } = useTranslation();
  const [checkedValues, setCheckedValues] = useState<Array<CheckboxValueType>>([]);

  const handleCheckboxChange = (checkedValues: Array<CheckboxValueType>) => {
    setCheckedValues(checkedValues);
  };

  const groupOptions = [
    { label: t('databaseSources.accessPermissions.research'), value: 'research' },
    { label: t('databaseSources.accessPermissions.govOrg'), value: 'govOrg' },
    { label: t('databaseSources.accessPermissions.others'), value: 'others' },
  ].filter((option) => option.value !== currentRole);

  return (
    <S.Modal
      title={t('databaseSources.accessPermissions.modal.instruction')}
      centered
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      size="medium"
      footer={
        <BaseButton
          type={checkedValues.length > 0 ? 'primary' : 'default'}
          onClick={() => onSubmit(checkedValues)}
          loading={loading}
        >
          {checkedValues.length > 0
            ? t('databaseSources.accessPermissions.modal.copyPermissions')
            : t('databaseSources.accessPermissions.modal.skip')}
        </BaseButton>
      }
    >
      <BaseForm>
        <S.GroupCheckbox options={groupOptions} onChange={handleCheckboxChange} />
      </BaseForm>
    </S.Modal>
  );
};
