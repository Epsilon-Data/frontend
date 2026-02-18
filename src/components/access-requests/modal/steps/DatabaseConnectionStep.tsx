import { testConnection } from '@app/api/connectionRequests.api';
import { ModalSelect } from '@app/components/common/Modal/ModalSelect/ModalSelect';
import { NumberedFormItem } from '@app/components/common/Modal/NumberedFormItem/NumberedFormItem';
import { TestConnectionGroup } from '@app/components/common/Modal/TestConnectionGroup/TestConnectionGroup';
import { buildDatabaseUrl } from '@app/utils/databaseUrl';

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
  const [testError, setTestError] = useState<string | null>(null);
  const isDbUrl = Form.useWatch('isDbUrl', form);
  const dbType = Form.useWatch('dbType', form);

  const dbTypeOptions = [{ value: 'postgres', label: 'PostgreSQL' }];

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
      form.resetFields(['username', 'password', 'hostname', 'port', 'name', 'ssl']);
    } else {
      form.resetFields(['dbUrl']);
    }
  };

  const onTestConnection = async () => {
    setTestLoading(true);
    setTestError(null);

    let username = '';
    let password = '';
    let hostname = '';
    let port = '';
    let name = '';
    let ssl = false;
    let dbUrl = '';

    try {
      const type = form.getFieldValue('dbType');
      if (isDbUrl) {
        dbUrl = form.getFieldValue('dbUrl');
        try {
          const parsedUrl = new URL(dbUrl);
          const sslmode = parsedUrl.searchParams.get('sslmode');

          const missing: string[] = [];
          if (!sslmode) missing.push('sslmode');
          if (!parsedUrl.hostname) missing.push('host');
          if (!parsedUrl.port) missing.push('port');
          if (!parsedUrl.pathname || parsedUrl.pathname === '/') missing.push('database name');
          if (!parsedUrl.username) missing.push('username');
          if (!parsedUrl.password) missing.push('password');

          if (missing.length) {
            setTestError(`Missing in URL: ${missing.join(', ')}`);
            throw new Error('validation');
          }

          username = parsedUrl.username;
          password = parsedUrl.password;
          hostname = parsedUrl.hostname;
          port = parsedUrl.port;
          name = parsedUrl.pathname.replace(/^\//, '');
          ssl = sslmode!.toLowerCase() !== 'disable';
        } catch (e: any) {
          if (e.message === 'validation') throw e;
          setTestError('Invalid database URL');
          throw e;
        }
      } else {
        ({ username, password, hostname, port, name } = form.getFieldsValue([
          'username',
          'password',
          'hostname',
          'port',
          'name',
        ]));

        ssl = !!form.getFieldValue('ssl');
        dbUrl = buildDatabaseUrl({ type, host: hostname, port, username, password, name, ssl }) || '';
      }

      const connectionData = {
        type: type,
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
      } catch (err: any) {
        setConnected(false);
        const message = err?.options?.message || err?.data?.message || err?.message || err?.response?.data?.message || 'Connection test failed';
        setTestError(message);
      }
    } catch {
      setConnected(false);
    }

    setShowMessage(true);
    setTestLoading(false);
  };

  const onValuesChange = (changed: Record<string, unknown>) => {
    const keys = Object.keys(changed);
    const shouldInvalidate = keys.some((k) =>
      ['isDbUrl', 'dbUrl', 'username', 'password', 'hostname', 'port', 'name', 'ssl', 'dbType'].includes(k),
    );

    if (shouldInvalidate) invalidateConnection();
  };

  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form} className="h-full" onValuesChange={onValuesChange}>
        <NumberedFormItem number={1}>
          <ModalSelect
            name="dbType"
            inputTitle={t('dashboard.createProject.form.step3.dbType.title')}
            options={dbTypeOptions}
          />
        </NumberedFormItem>
        {dbType === 'postgres' && (
          <>
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
              number={2}
              errorMessage={testError}
            />
          </>
        )}
      </Form>
    </div>
  );
};
