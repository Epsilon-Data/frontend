import React from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { InputPassword } from '@app/components/common/inputs/InputPassword/InputPassword';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export const PasswordInputItem: React.FC<{ name: string; label: string }> = ({ name, label }) => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name={name} label={label}>
      <InputPassword
        placeholder={t('connectionRequests.create.databaseInfo.passwordPrompt')}
        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
      />
    </BaseButtonsForm.Item>
  );
};
