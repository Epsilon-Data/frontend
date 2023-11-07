import React from 'react';
import { BaseForm, BaseFormInterface, BaseFormProps } from '@app/components/common/forms//BaseForm/BaseForm';
import { BaseButtonsGroup } from '@app/components/common/forms/components/BaseButtonsGroup/BaseButtonsGroup';
import { BaseFormTitle } from '@app/components/common/forms/components/BaseFormTitle/BaseFormTitle';
import { BaseFormItem } from '@app/components/common/forms/components/BaseFormItem/BaseFormItem';
import { BaseFormList } from '@app/components/common/forms/components/BaseFormList/BaseFormList';

export interface BaseButtonsFormProps extends BaseFormProps {
  isFieldsChanged: boolean;
  setFieldsChanged?: (state: boolean) => void;
  footer?: React.ReactElement;
  loading?: boolean;
  buttonText?: string;
}

export const BaseButtonsForm: BaseFormInterface<BaseButtonsFormProps> = ({
  form,
  isFieldsChanged,
  setFieldsChanged,
  footer,
  buttonText,
  loading = false,
  children,
  ...props
}) => {
  const [formDefault] = BaseForm.useForm();
  const currentForm = form || formDefault;

  const onCancel = () => {
    currentForm?.resetFields();
    setFieldsChanged && setFieldsChanged(false);
  };

  const buttonsGroup = buttonText ? (
    <BaseButtonsGroup buttonText={buttonText} loading={loading} onCancel={onCancel} />
  ) : (
    <BaseButtonsGroup loading={loading} onCancel={onCancel} />
  );

  return (
    <BaseForm form={currentForm} {...props}>
      {children}
      {isFieldsChanged && (footer || buttonsGroup)}
    </BaseForm>
  );
};

BaseButtonsForm.Title = BaseFormTitle;
BaseButtonsForm.Item = BaseFormItem;
BaseButtonsForm.List = BaseFormList;
BaseButtonsForm.useForm = BaseForm.useForm;
BaseButtonsForm.Provider = BaseForm.Provider;
