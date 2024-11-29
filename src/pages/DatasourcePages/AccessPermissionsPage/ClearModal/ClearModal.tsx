import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './ClearModal.styles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

export const ClearModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onClear: (checkedValues: Array<CheckboxValueType>) => void;
}> = ({ isModalOpen, setIsModalOpen, onClear }) => {
  const { t } = useTranslation();
  const [checkedValues, setCheckedValues] = useState<Array<CheckboxValueType>>([]);

  const handleCheckboxChange = (checkedValues: Array<CheckboxValueType>) => {
    setCheckedValues(checkedValues);
  };

  const groupOptions = [
    { label: t('databaseSources.accessPermissions.research'), value: 'research' },
    { label: t('databaseSources.accessPermissions.govOrg'), value: 'govOrg' },
    { label: t('databaseSources.accessPermissions.others'), value: 'others' },
  ];

  return (
    <S.Modal
      title={t('databaseSources.accessPermissions.clearModal.instruction')}
      centered
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      size="medium"
      footer={
        <BaseButton type="primary" onClick={() => onClear(checkedValues)}>
          {t('databaseSources.accessPermissions.clearModal.clearPermissions')}
        </BaseButton>
      }
    >
      <BaseForm>
        <S.GroupCheckbox
          style={{ display: 'flex', flexDirection: 'column' }}
          options={groupOptions}
          onChange={handleCheckboxChange}
        />
      </BaseForm>
    </S.Modal>
  );
};
