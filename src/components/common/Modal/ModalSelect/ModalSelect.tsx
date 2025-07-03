import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { FaChevronDown } from 'react-icons/fa6';
import { Select } from 'antd';

export const ModalSelect: React.FC<{
  name: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  options: { value: string; label: string }[];
}> = ({ name, disabled, className, inputTitle, inputDescription, options }) => {
  return (
    <div className="flex flex-col mb-12">
      <div className="mb-8">
        <div className="font-medium font-sans text-blueDark text-xl">{inputTitle}</div>
        <div className="font-light font-inter text-black text-xs">{inputDescription}</div>
      </div>
      <FormItem name={name} className={className}>
        <Select className="modal-select" disabled={disabled} suffixIcon={<FaChevronDown />} options={options} />
      </FormItem>
    </div>
  );
};
