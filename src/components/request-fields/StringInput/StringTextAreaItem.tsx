import React from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';

export const StringTextAreaItem: React.FC<{
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (e: any) => void;
}> = ({ name, label, placeholder, required, disabled, onChange }) => {
  return (
    <BaseButtonsForm.Item name={name} label={label} rules={[{ required: required }]}>
      <BaseInput.TextArea rows={4} placeholder={placeholder} onChange={onChange} disabled={disabled} />
    </BaseButtonsForm.Item>
  );
};
