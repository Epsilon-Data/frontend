import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { InputLabel } from '../InputLabel/InputLabel';
import { Checkbox, Col } from 'antd/lib';
import { RuleObject } from 'antd/es/form';

export const ModalCheckboxGroup: React.FC<{
  name: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  options: { value: string | number | boolean; label: string }[];
  defaultValue?: string | number | boolean;
  onChange?: ((checkedValue: (string | number | boolean)[]) => void) | undefined;
  inputRules?: RuleObject[];
}> = ({ name, disabled, className, inputTitle, inputDescription, options, defaultValue, onChange, inputRules }) => {
  return (
    <div className="flex flex-col mb-12">
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />
      <FormItem rules={inputRules} name={name} className={className} initialValue={defaultValue}>
        <Checkbox.Group className="modal-radio-group" disabled={disabled} onChange={onChange}>
          {options.map((option, index) => (
            <Col key={index} span={24} className="mb-4 border border-blueDark rounded-md p-4 bg-blueDark/10">
              <Checkbox value={option.value}>{option.label}</Checkbox>
            </Col>
          ))}
        </Checkbox.Group>
      </FormItem>
    </div>
  );
};
