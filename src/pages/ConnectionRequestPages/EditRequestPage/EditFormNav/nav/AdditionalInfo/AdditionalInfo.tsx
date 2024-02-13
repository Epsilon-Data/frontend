import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { RequestDetails } from '@app/interfaces/interfaces';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { StringTextAreaItem } from '@app/components/request-fields/StringInput/StringTextAreaItem';

export const AdditionalInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const initialValues = {
    additionalInfo: formValue.additionalInfo,
  };

  const [form] = BaseForm.useForm();
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    const updatedRequest = {
      ...formValue,
      additionalInfo: allValues.additionalInfo,
    };
    setFormValue(updatedRequest);
  };

  return (
    <BaseForm
      form={form}
      name="additionalInfo"
      initialValues={initialValues}
      style={{ width: '80%' }}
      onValuesChange={handleFormValueChange}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseForm.Item>
            <BaseForm.Title>{t('connectionRequests.details.addInfo.title')}</BaseForm.Title>
          </BaseForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem
            name="additionalInfo"
            label={t('connectionRequests.details.addInfo.title')}
            placeholder={t('connectionRequests.details.addInfo.placeholder')}
          />
        </BaseCol>
      </BaseRow>
    </BaseForm>
  );
};
