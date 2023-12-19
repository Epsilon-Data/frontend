import React from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';

export const DateRangeInputItem: React.FC<{ name: string; label: string; required?: boolean }> = ({
  name,
  label,
  required,
}) => {
  return (
    <BaseButtonsForm.Item name={name} label={label} rules={[{ required: required }]}>
      <DayjsDatePicker.RangePicker format="DD/MM/YYYY" />
    </BaseButtonsForm.Item>
  );
};
