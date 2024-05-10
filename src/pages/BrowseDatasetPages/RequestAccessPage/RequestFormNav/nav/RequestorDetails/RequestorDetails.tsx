import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { AccessDetails } from '@app/interfaces/interfaces';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { StringInputItem } from '@app/components/request-fields/StringInput/StringInputItem';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const RequestorDetails: React.FC<{
  formValue: AccessDetails;
  setFormValue: (value: AccessDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const user = useAppSelector((state) => state.user.user);

  const initialValues = {
    requestorName: user?.firstName + ' ' + user?.lastName ?? formValue.requestorName,
    email: user?.email.name ?? formValue.email,
    orgName: formValue.orgName,
    position: formValue.position,
  };
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    const updatedDetails = {
      ...formValue,
      requestorName: allValues.requestorName,
      email: allValues.email,
      orgName: allValues.orgName,
      position: allValues.position,
    };
    setFormValue(updatedDetails);
  };

  return (
    <BaseForm
      form={form}
      name="requestor"
      initialValues={initialValues}
      style={{ width: '80%' }}
      onValuesChange={handleFormValueChange}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseButtonsForm.Item style={{ marginTop: '1rem' }}>
            <BaseButtonsForm.Title>{t('browse.access.requestor.title')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>
        <BaseCol span={24}>
          <StringInputItem name="requestorName" label={t('browse.access.requestor.name')} disabled />
        </BaseCol>
        <BaseCol span={24}>
          <StringInputItem name="email" label={t('browse.access.requestor.email')} disabled />
        </BaseCol>
        <BaseCol span={24}>
          <StringInputItem name="orgName" label={t('browse.access.requestor.orgName')} required />
        </BaseCol>
        <BaseCol span={24}>
          <StringInputItem name="position" label={t('browse.access.requestor.position')} required />
        </BaseCol>
      </BaseRow>
    </BaseForm>
  );
};
