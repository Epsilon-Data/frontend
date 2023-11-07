import React from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';

export const StringTextAreaItem: React.FC<{ name: string; label: string }> = ({ name, label }) => {
  return (
    <BaseButtonsForm.Item name={name} label={label}>
      <BaseInput.TextArea rows={4} />
    </BaseButtonsForm.Item>
  );
};
