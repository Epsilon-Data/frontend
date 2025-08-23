import React, { HtmlHTMLAttributes } from 'react';
import { Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import clsx from 'clsx';

export const ModalInput: React.FC<
  {
    name: string;
    suffix?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    inputTitle: string;
    inputDescription?: string;
    large?: boolean;
  } & HtmlHTMLAttributes<HTMLInputElement>
> = ({ name, suffix, disabled, className, inputTitle, inputDescription, large, ...props }) => {
  return (
    <div className="flex flex-col mb-12">
      <div className={clsx(large ? 'mb-12' : 'mb-8')}>
        <div className={clsx('font-medium font-sans text-blueDark', large ? 'text-2xl' : 'text-xl')}>{inputTitle}</div>
        <div className={clsx('font-light font-inter text-black', large ? 'text-md' : 'text-xs')}>
          {inputDescription}
        </div>
      </div>
      <FormItem name={name} className={className}>
        <Input {...props} suffix={suffix} disabled={disabled} className="border border-black bg-grey-4" />
      </FormItem>
    </div>
  );
};
