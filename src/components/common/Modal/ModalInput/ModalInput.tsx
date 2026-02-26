import React, { HtmlHTMLAttributes } from 'react';
import { Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { RuleObject } from 'antd/es/form';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../InputLabel/InputLabel';

export const ModalInput: React.FC<
  {
    placeholder?: string;
    name: string;
    suffix?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    inputTitle: string;
    inputDescription?: string;
    inputRules?: RuleObject[];
    labelLarge?: boolean;
  } & HtmlHTMLAttributes<HTMLInputElement>
> = ({
  placeholder,
  name,
  suffix,
  disabled,
  className,
  inputTitle,
  inputDescription,
  inputRules,
  labelLarge = true,
  ...props
}) => {
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
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} large={labelLarge} />
      <FormItem rules={rules} name={name} className={className}>
        <Input
          placeholder={placeholder}
          {...props}
          suffix={suffix}
          disabled={disabled}
          className="border border-grey-2 bg-grey-4 hover:border-blueDark [&::placeholder]:text-grey-2"
        />
      </FormItem>
    </div>
  );
};
