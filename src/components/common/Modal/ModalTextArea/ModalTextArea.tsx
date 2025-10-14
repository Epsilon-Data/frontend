import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import TextArea, { TextAreaProps } from 'antd/es/input/TextArea';
import { RuleObject } from 'antd/es/form';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../InputLabel/InputLabel';

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
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />
      <FormItem rules={rules} name={name} className={className}>
        <TextArea
          {...props}
          rows={4}
          disabled={disabled}
          className="bg-grey-4 border border-grey-3 [&::placeholder]:text-grey-2"
        />
      </FormItem>
    </div>
  );
};
