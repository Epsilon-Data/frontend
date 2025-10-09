import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { FaChevronDown } from 'react-icons/fa6';
import { Select } from 'antd';
import { InputLabel } from '../InputLabel/InputLabel';

export const ModalSelect: React.FC<{
  name: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}> = ({ name, disabled, className, inputTitle, inputDescription, options, defaultValue }) => {
  return (
    <div className="flex flex-col mb-12">
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />
      <FormItem name={name} className={className} initialValue={defaultValue ?? options?.[0]?.value}>
        <Select className="select-field" disabled={disabled} suffixIcon={<FaChevronDown />} options={options} />
      </FormItem>
    </div>
  );
};
