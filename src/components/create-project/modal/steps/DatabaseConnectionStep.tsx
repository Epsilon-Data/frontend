import { testConnection } from '@app/api/connectionRequests.api';
import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { ModalRadioGroup } from '@app/components/common/Modal/ModalRadioGroup/ModalRadioGroup';
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
  isEditing?: boolean;
};

export const DatabaseConnectionStep = ({
  form,
  showMessage,
  setShowMessage,
  isConnected,
  setConnected,
  setDbUrl,
  isEditing = false,
}: DatabaseConnectionStepProps) => {
  const { t } = useTranslation();
  const [isTestLoading, setTestLoading] = useState(false);

  const hasCreds = Form.useWatch('hasCreds', form);
  const isDbUrl = Form.useWatch('isDbUrl', form);
  const dbType = Form.useWatch('dbType', form);
  const updateDatabase = Form.useWatch('updateDatabase', form);

  const dbTypeOptions = [{ value: 'postgres', label: 'PostgreSQL' }];

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
      form.resetFields(['username', 'password', 'hostname', 'port', 'name', 'ssl']);
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
      const type = form.getFieldValue('dbType');
      if (isDbUrl) {
        dbUrl = form.getFieldValue('dbUrl');
        const parsedUrl = new URL(dbUrl);
        const sslmode = parsedUrl.searchParams.get('sslmode');

        if (!sslmode) {
          throw new Error('Missing sslmode');
        }

        username = parsedUrl.username;
        password = parsedUrl.password;
        hostname = parsedUrl.hostname;
        port = parsedUrl.port;
        name = parsedUrl.pathname.replace(/^\//, '');
        ssl = sslmode.toLowerCase() !== 'disable';
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
      } catch {
        setConnected(false);
      }
    } catch {
      setConnected(false);
    }

    setShowMessage(true);
    setTestLoading(false);
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
            {isEditing && (
              <NumberedFormItem number={2} showDivider={false}>
                <ModalRadioGroup
                  name="updateDatabase"
                  inputTitle={t('dashboard.createProject.form.step3.updateDatabase.title')}
                  options={hasCredsOptions}
                  defaultValue={false}
                />
              </NumberedFormItem>
            )}
            {!isEditing && (
              <NumberedFormItem number={2} showDivider={false}>
                <ModalRadioGroup
                  name="hasCreds"
                  inputTitle={t('dashboard.createProject.form.step3.hasCreds.title')}
                  options={hasCredsOptions}
                  defaultValue={true}
                  onChange={handleHasCredsChange}
                />
              </NumberedFormItem>
            )}
            {(isEditing ? updateDatabase : hasCreds) && (
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
                number={isEditing ? 3 : 4}
              />
            )}
            {!isEditing && !hasCreds && (
              <NumberedFormItem number={3} showDivider={false}>
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
