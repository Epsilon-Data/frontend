import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ConnectionRequest } from '@app/interfaces/interfaces';
import { StringInputItem } from './StringInput/StringInputItem';
import { useNavigate } from 'react-router-dom';
import { RequestDataInfo } from './RequestDataInfo';
import { StringTextAreaItem } from './StringInput/StringTextAreaItem';

export const RequestOrgAdminInfo: React.FC<{
  formValue: ConnectionRequest;
  setFormValue: (value: ConnectionRequest) => void;
}> = ({ formValue, setFormValue }) => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const ownDataInfo = formValue.databaseInfo
    ? formValue.databaseInfo
    : { name: '', type: '', url: '', username: '', password: '' };

  const onFinish = useCallback(
    (values: ConnectionRequest) => {
      setLoading(true);
      setFormValue(values);
      //TODO: add request to database
      setTimeout(() => {
        setLoading(false);
        setFieldsChanged(false);
        navigate('/r-connection-requests');
        console.log(formValue);
      }, 1000);
    },
    [formValue, navigate, setFormValue],
  );

  return (
    <BaseButtonsForm
      form={form}
      name="info"
      loading={isLoading}
      initialValues={ownDataInfo}
      isFieldsChanged={isFieldsChanged}
      setFieldsChanged={setFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      onFinish={onFinish}
      buttonText={t('connectionRequests.create.altTitle')}
      style={{ width: '80%' }}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseButtonsForm.Item>
            <BaseButtonsForm.Title>{t('connectionRequests.create.orgAdminInfo.title')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="orgAdminEmail" label={t('connectionRequests.create.orgAdminInfo.email')} />
        </BaseCol>

        <RequestDataInfo formValue={formValue} />

        <BaseCol span={24}>
          <StringTextAreaItem
            name="additionalInfo"
            label={t('connectionRequests.create.addInfo.title')}
            placeholder={t('connectionRequests.create.addInfo.placeholder')}
          />
        </BaseCol>
      </BaseRow>
    </BaseButtonsForm>
  );
};
