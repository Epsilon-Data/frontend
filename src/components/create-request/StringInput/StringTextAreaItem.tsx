import React from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';

export const StringTextAreaItem: React.FC<{
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}> = ({ name, label, placeholder, required }) => {
  return (
    <BaseButtonsForm.Item name={name} label={label} rules={[{ required: required }]}>
      <BaseInput.TextArea rows={4} placeholder={placeholder} />
    </BaseButtonsForm.Item>
  );
};
