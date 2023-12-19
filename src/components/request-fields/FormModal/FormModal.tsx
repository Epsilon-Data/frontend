import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as S from './FormModal.styles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

export const FormModal: React.FC<{
  isFormModalOpen: boolean;
  setIsFormModalOpen: (value: boolean) => void;
}> = ({ isFormModalOpen, setIsFormModalOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [allChecked, setAllChecked] = React.useState(false);
  const handleClick = () => {
    navigate('/r-connection-requests');
  };

  const handleCheckboxChange = (checkedValues: Array<CheckboxValueType>) => {
    setAllChecked(checkedValues.length === groupOptions.length);
  };

  const groupOptions = [
    t('connectionRequests.details.openAccessForm.confirmDataOwner'),
    t('connectionRequests.details.openAccessForm.confirmInLine'),
    t('connectionRequests.details.openAccessForm.confirmConsent'),
  ];
  return (
    <S.Modal
      title={t('connectionRequests.details.openAccessForm.title')}
      centered
      open={isFormModalOpen}
      onCancel={() => setIsFormModalOpen(false)}
      size="medium"
      footer={
        <BaseButton type="primary" onClick={handleClick} disabled={!allChecked}>
          {t('common.submit')}
        </BaseButton>
      }
    >
      <BaseForm>
        <S.GroupCheckbox options={groupOptions} onChange={handleCheckboxChange} />
      </BaseForm>
    </S.Modal>
  );
};
