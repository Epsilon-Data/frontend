import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './PermissionsModal.styles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';

export const PermissionsModal: React.FC<{
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSubmit: (selectedRole: string, checkedValues: Array<CheckboxValueType>) => void;
  loading: boolean;
}> = ({ isModalOpen, setIsModalOpen, onSubmit, loading }) => {
  const { t } = useTranslation();
  const [checkedValues, setCheckedValues] = useState<Array<CheckboxValueType>>([]);
  const [selectedRole, setSelectedRole] = useState('research');

  const handleCheckboxChange = (checkedValues: Array<CheckboxValueType>) => {
    setCheckedValues(checkedValues);
  };

  const selectOptions = [
    { label: t('databaseSources.accessPermissions.research'), value: 'research' },
    { label: t('databaseSources.accessPermissions.govOrg'), value: 'govOrg' },
    { label: t('databaseSources.accessPermissions.others'), value: 'others' },
  ];

  const groupOptions = selectOptions.filter((option) => option.value !== selectedRole);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: any) => {
    setCheckedValues([]);
    setSelectedRole(value);
  };

  return (
    <S.Modal
      title={t('databaseSources.accessPermissions.permissionModal.instruction')}
      centered
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      size="medium"
      footer={
        <BaseButton
          type={checkedValues.length > 0 ? 'primary' : 'default'}
          onClick={() => onSubmit(selectedRole, checkedValues)}
          loading={loading}
        >
          {checkedValues.length > 0
            ? t('databaseSources.accessPermissions.permissionModal.copyPermissions')
            : t('databaseSources.accessPermissions.permissionModal.skip')}
        </BaseButton>
      }
    >
      <BaseForm style={{ display: 'flex', flexDirection: 'column' }}>
        <S.Prompt>{t('databaseSources.accessPermissions.permissionModal.copyFrom')}</S.Prompt>
        <BaseSelect
          style={{ width: '50%', marginBottom: '3rem' }}
          defaultValue={'research'}
          options={selectOptions}
          onChange={handleChange}
        />
        <S.Prompt>{t('databaseSources.accessPermissions.permissionModal.copyTo')}</S.Prompt>
        <S.GroupCheckbox
          style={{ display: 'flex', flexDirection: 'column' }}
          options={groupOptions}
          onChange={handleCheckboxChange}
          value={checkedValues}
        />
      </BaseForm>
    </S.Modal>
  );
};
