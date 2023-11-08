import React from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';

export const RadioInputItem: React.FC<{ name: string; label: string }> = ({ name, label }) => {
  return (
    <BaseButtonsForm.Item name={name} label={label}>
      <BaseRadio.Group defaultValue="">
        <BaseRadio.Button value={true}>Yes</BaseRadio.Button>
        <BaseRadio.Button value={false}>No</BaseRadio.Button>
      </BaseRadio.Group>
    </BaseButtonsForm.Item>
  );
};
