import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { DatabaseInfoFormValues, RequestDetails } from '@app/interfaces/interfaces';
import { StringInputItem } from '@app/components/request-fields/StringInput/StringInputItem';
import { SelectInputItem } from '@app/components/request-fields/SelectInput/SelectInputItem';
import { PasswordInputItem } from '@app/components/request-fields/PasswordInput/PasswordInputItem';
import { TestConnectionGroup } from '@app/components/request-fields/TestConnectionGroup/TestConnectionGroup';
import { testConnection } from '@epsilon-data/epsilon-connector';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { DATABASE_TYPES } from '@app/constants/connectionRequest';

export const DatabaseInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const initialValues: DatabaseInfoFormValues = {
    name: formValue.databaseInfo?.name || '',
    type: formValue.databaseInfo?.type || '',
    host: formValue.databaseInfo?.host,
    port: formValue.databaseInfo?.port,
    username: formValue.databaseInfo?.username,
    password: formValue.databaseInfo?.password,
  };
  const [isTestLoading, setTestLoading] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const [form] = BaseForm.useForm();

  const { t } = useTranslation();

  const onTestConnection = async () => {
    setTestLoading(true);
    const { databaseName, databaseType, databaseHost, databasePort, databaseUsername, databasePassword } =
      form.getFieldsValue([
        'databaseName',
        'databaseType',
        'databaseHost',
        'databasePort',
        'databaseUsername',
        'databasePassword',
      ]);

    const connectionData = {
      driver: databaseType,
      port: databasePort,
      host: databaseHost,
      user: databaseUsername,
      password: databasePassword,
      database: databaseName,
      ssl: false,
    };

    await testConnection(connectionData)
      .then(() => {
        setConnected(true);
      })
      .catch((error) => {
        setConnected(false);
        console.log(error);
      });

    setShowMessage(true);
    setTestLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    if (isConnected) {
      const updatedRequest = {
        ...formValue,
        databaseInfo: {
          name: allValues.name,
          type: allValues.type,
          host: allValues.host,
          port: allValues.port,
          username: allValues.username,
          password: allValues.password,
        },
      };
      setFormValue(updatedRequest);
    }
  };

  return (
    <BaseForm
      form={form}
      name="databaseInfo"
      initialValues={initialValues}
      style={{ width: '80%' }}
      onValuesChange={handleFormValueChange}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseForm.Item>
            <BaseForm.Title>{t('connectionRequests.details.databaseInfo.title')}</BaseForm.Title>
          </BaseForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="name" label={t('connectionRequests.details.databaseInfo.name')} required />
        </BaseCol>

        <BaseCol span={24}>
          <SelectInputItem
            name="type"
            label={t('connectionRequests.details.databaseInfo.type')}
            optionItems={DATABASE_TYPES}
            prompt={t('connectionRequests.details.databaseInfo.typePrompt')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="host" label={t('connectionRequests.details.databaseInfo.host')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="port" label={t('connectionRequests.details.databaseInfo.port')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="username" label={t('connectionRequests.details.databaseInfo.username')} required />
        </BaseCol>

        <BaseCol span={24}>
          <PasswordInputItem name="password" label={t('connectionRequests.details.databaseInfo.password')} required />
        </BaseCol>

        <BaseCol span={24}>
          <TestConnectionGroup
            onClick={onTestConnection}
            loading={isTestLoading}
            connected={isConnected}
            show={showMessage}
          />
        </BaseCol>
      </BaseRow>
    </BaseForm>
  );
};
