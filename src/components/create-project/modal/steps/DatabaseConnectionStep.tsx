import { testConnection } from '@app/api/connectionRequests.api';
import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { ModalRadioGroup } from '@app/components/common/Modal/ModalRadioGroup/ModalRadioGroup';
import { ModalSelect } from '@app/components/common/Modal/ModalSelect/ModalSelect';
import { NumberedFormItem } from '@app/components/common/Modal/NumberedFormItem/NumberedFormItem';
import { TestConnectionGroup } from '@app/components/common/Modal/TestConnectionGroup/TestConnectionGroup';

import { Form, RadioChangeEvent } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { FormInstance } from 'antd/lib';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type DatabaseConnectionStepProps = {
  form: FormInstance<unknown>;
  showMessage: boolean;
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>;
  isConnected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setDbUrl: React.Dispatch<React.SetStateAction<string>>;
};

export const DatabaseConnectionStep = ({
  form,
  showMessage,
  setShowMessage,
  isConnected,
  setConnected,
  setDbUrl,
}: DatabaseConnectionStepProps) => {
  const { t } = useTranslation();
  const [isTestLoading, setTestLoading] = useState(false);

  const hasCreds = Form.useWatch('hasCreds', form);
  const isDbUrl = Form.useWatch('isDbUrl', form);
  const dbType = Form.useWatch('dbType', form);

  const dbTypeOptions = [
    { value: 'postgres', label: 'PostgreSQL' },
    { value: 'csv', label: 'CSV' },
  ];

  const hasCredsOptions: CheckboxGroupProps<boolean>['options'] = [
    { label: t('common.yes'), value: true },
    { label: t('common.no'), value: false },
  ];

  const configureOptions: CheckboxGroupProps<boolean>['options'] = [
    { label: t('dashboard.createProject.form.step3.dbCred.configuration.dbUrl'), value: true },
    { label: t('dashboard.createProject.form.step3.dbCred.configuration.manual'), value: false },
  ];

  const invalidateConnection = () => {
    setShowMessage(false);
    setConnected(false);
    setDbUrl('');
  };

  const handleIsDbUrlChange = (e: RadioChangeEvent) => {
    const value = e.target.value as boolean;

    invalidateConnection();

    if (value) {
      form.resetFields(['username', 'password', 'hostname', 'port', 'name']);
    } else {
      form.resetFields(['dbUrl']);
    }
  };

  const onValuesChange = (changed: Record<string, unknown>) => {
    const keys = Object.keys(changed);
    const shouldInvalidate = keys.some((k) =>
      ['isDbUrl', 'dbUrl', 'username', 'password', 'hostname', 'port', 'name', 'ssl', 'dbType'].includes(k),
    );

    if (shouldInvalidate) invalidateConnection();
  };

  const handleHasCredsChange = (e: RadioChangeEvent) => {
    const value = e.target.value as boolean;

    setShowMessage(false);
    setConnected(false);

    if (value) {
      form.resetFields(['orgAdminEmail']);
    } else {
      form.resetFields(['dbUrl', 'username', 'password', 'hostname', 'port', 'name', 'ssl']);
    }

    form.setFieldsValue({ hasCreds: value });
  };

  const onTestConnection = async () => {
    setTestLoading(true);

    let username = '';
    let password = '';
    let hostname = '';
    let port = '';
    let name = '';
    let ssl = false;
    let dbUrl = '';

    try {
      if (isDbUrl) {
        dbUrl = form.getFieldValue('dbUrl');
        const parsedUrl = new URL(dbUrl);

        username = parsedUrl.username;
        password = parsedUrl.password;
        hostname = parsedUrl.hostname;
        port = parsedUrl.port;
        name = parsedUrl.pathname.replace(/^\//, '');
      } else {
        ({ username, password, hostname, port, name } = form.getFieldsValue([
          'username',
          'password',
          'hostname',
          'port',
          'name',
        ]));

        const safeUser = encodeURIComponent(username || '');
        const safePass = encodeURIComponent(password || '');
        const auth = username ? `${safeUser}${password ? `:${safePass}` : ''}@` : '';
        const portPart = port ? `:${port}` : '';
        dbUrl = `${dbType}://${auth}${hostname}${portPart}/${name}`;
      }

      ssl = form.getFieldValue('ssl');

      const connectionData = {
        type: form.getFieldValue('dbType'),
        port: port,
        host: hostname,
        username: username,
        password: password,
        name: name.replace(/^\//, ''),
        ssl: ssl,
      };

      try {
        await testConnection(connectionData);
        setConnected(true);
        setDbUrl(dbUrl);
      } catch (error) {
        console.error('Connection test failed:', error);
        setConnected(false);
      }
    } catch (error) {
      console.error('Error in onTestConnection:', error);
      setConnected(false);
    }

    setShowMessage(true);
    setTestLoading(false);
  };

  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form} className="h-full" onValuesChange={onValuesChange}>
        <NumberedFormItem number={1}>
          <ModalInput
            name="dbName"
            inputTitle={t('dashboard.createProject.form.step3.dbName.title')}
            placeholder={t('dashboard.createProject.form.step3.dbName.placeholder')}
          />
        </NumberedFormItem>
        <NumberedFormItem number={2}>
          <ModalSelect
            name="dbType"
            inputTitle={t('dashboard.createProject.form.step3.dbType.title')}
            options={dbTypeOptions}
          />
        </NumberedFormItem>
        {dbType === 'postgres' && (
          <>
            <NumberedFormItem number={3} showDivider={false}>
              <ModalRadioGroup
                name="hasCreds"
                inputTitle={t('dashboard.createProject.form.step3.hasCreds.title')}
                options={hasCredsOptions}
                defaultValue={true}
                onChange={handleHasCredsChange}
              />
            </NumberedFormItem>
            {hasCreds ? (
              <TestConnectionGroup
                inputTitle={t('dashboard.createProject.form.step3.dbCred.dbUrl.title')}
                inputDescription={t('dashboard.createProject.form.step3.dbCred.dbUrl.description')}
                connected={isConnected}
                loading={isTestLoading}
                show={showMessage}
                onClick={onTestConnection}
                radioGroupOptions={configureOptions}
                handleChange={handleIsDbUrlChange}
                isDbUrl={isDbUrl}
                number={4}
              />
            ) : (
              <NumberedFormItem number={4} showDivider={false}>
                <ModalInput
                  name="orgAdminEmail"
                  inputTitle={t('dashboard.createProject.form.step3.orgAdminEmail.title')}
                  inputDescription={t('dashboard.createProject.form.step3.orgAdminEmail.description')}
                  inputRules={[{ type: 'email', message: t('fieldMessages.input.email') }]}
                  placeholder={t('dashboard.createProject.form.step3.orgAdminEmail.placeholder')}
                />
              </NumberedFormItem>
            )}
          </>
        )}
      </Form>
    </div>
  );
};
