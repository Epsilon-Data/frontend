import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { Radio, RadioChangeEvent } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { InputLabel } from '../InputLabel/InputLabel';

export const ModalRadioGroup: React.FC<{
  name: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  options: CheckboxGroupProps<string | number | boolean>['options'];
  defaultValue?: string | number | boolean;
  onChange?: (e: RadioChangeEvent) => void;
}> = ({ name, disabled, className, inputTitle, inputDescription, options, defaultValue, onChange }) => {
  return (
    <div className="flex flex-col mb-12">
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />
      <FormItem name={name} className={className} initialValue={defaultValue}>
        <Radio.Group
          className="modal-radio-group"
          disabled={disabled}
          options={options}
          optionType="button"
          buttonStyle="solid"
          onChange={onChange}
        />
      </FormItem>
    </div>
  );
};
