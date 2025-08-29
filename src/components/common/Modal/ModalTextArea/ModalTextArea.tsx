import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import TextArea, { TextAreaProps } from 'antd/es/input/TextArea';
import { RuleObject } from 'antd/es/form';
import { useTranslation } from 'react-i18next';

export const ModalTextArea: React.FC<
  {
    name: string;
    suffix?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    inputTitle: string;
    inputDescription?: string;
    inputRules?: RuleObject[];
  } & TextAreaProps
> = ({ name, disabled, className, inputTitle, inputDescription, inputRules, ...props }) => {
  const { t } = useTranslation();
  const rules = [
    {
      required: true,
      message: t('fieldMessages.input.required'),
    },
    {
      whitespace: true,
      message: t('fieldMessages.input.whitespace'),
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
        <TextArea {...props} rows={4} disabled={disabled} className="bg-grey-4 border border-black" />
      </FormItem>
    </div>
  );
};
