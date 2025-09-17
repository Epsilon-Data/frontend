import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { Radio, RadioChangeEvent } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';

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
      <div className="mb-8">
        <div className="font-medium font-sans text-blueDark text-xl">{inputTitle}</div>
        <div className="font-light font-inter text-black text-xs">{inputDescription}</div>
      </div>
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
