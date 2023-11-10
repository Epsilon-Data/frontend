import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ConnectionRequest } from '@app/interfaces/interfaces';
import { StringInputItem } from './StringInput/StringInputItem';
import { useNavigate } from 'react-router-dom';
import { DropdownInputItem } from './DropdownInput/DropdownInputItem';
import { PasswordInputItem } from './PasswordInput/PasswordInputItem';
import { RequestDataInfo } from './RequestDataInfo';

export const RequestDatabaseInfo: React.FC<{
  formValue: ConnectionRequest;
  setFormValue: (value: ConnectionRequest) => void;
}> = ({ formValue, setFormValue }) => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const dropdownItems = [
    {
      key: 'postgres',
      label: t('connectionRequests.create.databaseInfo.postgres'),
    },
    {
      key: 'mysql',
      label: t('connectionRequests.create.databaseInfo.mysql'),
    },
    {
      key: 'mongo',
      label: t('connectionRequests.create.databaseInfo.mongo'),
    },
  ];

  const onFinish = useCallback(
    (values: ConnectionRequest) => {
      setLoading(true);
      const updatedRequest = {
        ...formValue,
        databaseInfo: {
          name: values.databaseInfo?.name || '',
          type: values.databaseInfo?.type || '',
          url: values.databaseInfo?.url || '',
          username: values.databaseInfo?.username || '',
          password: values.databaseInfo?.password || '',
        },
        dataInfo: {
          collectionDuration: values.dataInfo.collectionDuration,
          participantsNumber: values.dataInfo.participantsNumber,
          description: values.dataInfo.description,
          keywords: values.dataInfo.keywords,
        },
      };
      setFormValue(updatedRequest);
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
      initialValues={formValue}
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
            <BaseButtonsForm.Title>{t('connectionRequests.create.databaseInfo.title')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="databaseInfo.name" label={t('connectionRequests.create.databaseInfo.name')} required />
        </BaseCol>

        <BaseCol span={24}>
          <DropdownInputItem
            name="databaseInfo.type"
            label={t('connectionRequests.create.databaseInfo.type')}
            positionItems={dropdownItems}
            prompt={t('connectionRequests.create.databaseInfo.typePrompt')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="databaseInfo.url" label={t('connectionRequests.create.databaseInfo.url')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="databaseInfo.username"
            label={t('connectionRequests.create.databaseInfo.username')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <PasswordInputItem
            name="databaseInfo.password"
            label={t('connectionRequests.create.databaseInfo.password')}
            required
          />
        </BaseCol>
        <RequestDataInfo formValue={formValue} />
      </BaseRow>
    </BaseButtonsForm>
  );
};
