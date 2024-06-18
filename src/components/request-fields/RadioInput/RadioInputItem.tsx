import React from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';

export const RadioInputItem: React.FC<{
  name: string;
  label?: string;
  required?: boolean;
  inputs?: { label: string; value: string | boolean | number }[];
}> = ({ name, label, required, inputs }) => {
  return (
    <BaseButtonsForm.Item name={name} label={label} rules={[{ required: required }]}>
      <BaseRadio.Group>
        {inputs ? (
          inputs.map((input, index) => (
            <BaseRadio.Button key={index} value={input.value}>
              {input.label}
            </BaseRadio.Button>
          ))
        ) : (
          <>
            <BaseRadio.Button value={true}>Yes</BaseRadio.Button>
            <BaseRadio.Button value={false}>No</BaseRadio.Button>
          </>
        )}
      </BaseRadio.Group>
    </BaseButtonsForm.Item>
  );
};
