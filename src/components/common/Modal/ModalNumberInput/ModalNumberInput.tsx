import React from 'react';
import { InputNumber } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { RuleObject } from 'antd/es/form';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../InputLabel/InputLabel';

export const ModalNumberInput: React.FC<
  {
    name: string;
    suffix?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    inputTitle: string;
    inputDescription?: string;
    inputRules?: RuleObject[];
  } & React.ComponentProps<typeof InputNumber>
> = ({ name, suffix, disabled, className, inputTitle, inputDescription, inputRules, ...props }) => {
  const { t } = useTranslation();
  const rules: RuleObject[] = [
    {
      required: true,
      message: t('fieldMessages.input.required'),
    },
    {
      validator: (_, value) => {
        if (value === undefined || value === null || value === '') return Promise.resolve();
        if (!Number.isInteger(value) || value < 0) {
          return Promise.reject(new Error(t('fieldMessages.input.invalidNumber')));
        }
        return Promise.resolve();
      },
    },
    ...(inputRules || []),
  ];

  return (
    <div className="flex flex-col mb-12">
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />
      <FormItem rules={rules} name={name} className={className}>
        <InputNumber
          {...props}
          suffix={suffix}
          disabled={disabled}
          changeOnWheel
          className="border border-grey-3 bg-grey-4 w-full"
        />
      </FormItem>
    </div>
  );
};
