import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { RuleObject } from 'antd/es/form';

export const ModalTextArea: React.FC<{
  name: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  inputRules?: RuleObject[];
}> = ({ name, disabled, className, inputTitle, inputDescription, inputRules }) => {
  const rules = [
    {
      required: true,
      message: 'This field is required',
    },
    {
      whitespace: true,
      message: 'This field cannot be empty',
    },
    ...(inputRules || []),
  ];
  return (
    <div className="flex flex-col mb-12">
      <div className="mb-8">
        <div className="font-medium font-sans text-blueDark text-xl">{inputTitle}</div>
        <div className="font-light font-inter text-black text-xs">{inputDescription}</div>
      </div>
      <FormItem rules={rules} name={name} className={className}>
        <TextArea rows={4} disabled={disabled} className="bg-grey-4 border border-black" />
      </FormItem>
    </div>
  );
};
