import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { AccessDetails } from '@app/interfaces/interfaces';
import { StringInputItem } from '@app/components/request-fields/StringInput/StringInputItem';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';

export const Ethics: React.FC<{
  formValue: AccessDetails;
  setFormValue: (value: AccessDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const initialValues = {
    ethicsId: formValue.ethicsId,
  };

  const [form] = BaseForm.useForm();
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    const updatedDetails = {
      ...formValue,
      ethicsId: allValues.ethicsId,
    };
    setFormValue(updatedDetails);
  };

  return (
    <BaseForm
      form={form}
      name="orgAdminInfo"
      initialValues={initialValues}
      style={{ width: '80%' }}
      onValuesChange={handleFormValueChange}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseForm.Item>
            <BaseForm.Title>{t('browse.access.ethics.title')}</BaseForm.Title>
          </BaseForm.Item>
        </BaseCol>
        <BaseCol span={24}>
          <StringInputItem name="ethicsId" label={t('browse.access.ethics.id')} required />
        </BaseCol>
      </BaseRow>
    </BaseForm>
  );
};
