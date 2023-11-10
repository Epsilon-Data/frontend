import React from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';

export const StringInputItem: React.FC<{
  name: string;
  label: string;
  required?: boolean;
  suffix?: React.ReactNode;
}> = ({ name, label, required, suffix }) => {
  return (
    <BaseButtonsForm.Item name={name} label={label} rules={[{ required: required }]}>
      <BaseInput suffix={suffix} />
    </BaseButtonsForm.Item>
  );
};
