import React from 'react';
import { Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import clsx from 'clsx';
import { RuleObject } from 'antd/es/form';

export const ModalInput: React.FC<{
  name: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  inputRules?: RuleObject[];
  large?: boolean;
}> = ({ name, suffix, disabled, className, inputTitle, inputDescription, inputRules, large }) => {
  return (
    <div className="flex flex-col mb-12">
      <div className={clsx(large ? 'mb-12' : 'mb-8')}>
        <div className={clsx('font-medium font-sans text-blueDark', large ? 'text-2xl' : 'text-xl')}>{inputTitle}</div>
        <div className={clsx('font-light font-inter text-black', large ? 'text-md' : 'text-xs')}>
          {inputDescription}
        </div>
      </div>
      <FormItem rules={inputRules} name={name} className={className}>
        <Input suffix={suffix} disabled={disabled} className="border border-black bg-grey-4" />
      </FormItem>
    </div>
  );
};
