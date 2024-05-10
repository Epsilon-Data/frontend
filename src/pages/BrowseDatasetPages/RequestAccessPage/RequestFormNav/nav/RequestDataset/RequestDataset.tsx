import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { StringTextAreaItem } from '@app/components/request-fields/StringInput/StringTextAreaItem';
import { AccessDetails } from '@app/interfaces/interfaces';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { StringInputItem } from '@app/components/request-fields/StringInput/StringInputItem';

export const RequestDataset: React.FC<{
  formValue: AccessDetails;
  setFormValue: (value: AccessDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const initialValues = {
    customId: formValue.customId,
    name: formValue.name,
    accessPurpose: formValue.accessPurpose,
  };
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    const updatedDetails = {
      ...formValue,
      customId: allValues.customId,
      name: allValues.name,
      accessPurpose: allValues.accessPurpose,
    };
    setFormValue(updatedDetails);
  };

  return (
    <BaseForm
      form={form}
      name="dataset"
      initialValues={initialValues}
      style={{ width: '80%' }}
      onValuesChange={handleFormValueChange}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseButtonsForm.Item style={{ marginTop: '1rem' }}>
            <BaseButtonsForm.Title>{t('browse.access.dataset.title')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="customId" label={t('browse.access.dataset.id')} disabled />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="name" label={t('browse.access.dataset.name')} disabled />
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem name="accessPurpose" label={t('browse.access.dataset.accessPurpose')} required />
        </BaseCol>
      </BaseRow>
    </BaseForm>
  );
};
