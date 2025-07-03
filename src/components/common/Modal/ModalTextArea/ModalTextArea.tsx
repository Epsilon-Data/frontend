import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';

export const ModalTextArea: React.FC<{
  name: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
}> = ({ name, disabled, className, inputTitle, inputDescription }) => {
  return (
    <div className="flex flex-col mb-12">
      <div className="mb-8">
        <div className="font-medium font-sans text-blueDark text-xl">{inputTitle}</div>
        <div className="font-light font-inter text-black text-xs">{inputDescription}</div>
      </div>
      <FormItem name={name} className={className}>
        <TextArea rows={4} disabled={disabled} className="bg-grey-4 border border-black" />
      </FormItem>
    </div>
  );
};
