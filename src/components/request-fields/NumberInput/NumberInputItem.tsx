import React from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { InputNumber } from 'antd';

export const NumberInputItem: React.FC<{
  name: string;
  label: string;
  required?: boolean;
  suffix?: React.ReactNode;
}> = ({ name, label, required }) => {
  return (
    <BaseButtonsForm.Item name={name} label={label} rules={[{ required: required }]}>
      <InputNumber min={1} />
    </BaseButtonsForm.Item>
  );
};
