import { testConnection } from '@app/api/connectionRequests.api';
import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { ModalRadioGroup } from '@app/components/common/Modal/ModalRadioGroup/ModalRadioGroup';
import { ModalSelect } from '@app/components/common/Modal/ModalSelect/ModalSelect';
import { NumberedFormItem } from '@app/components/common/Modal/NumberedFormItem/NumberedFormItem';
import { TestConnectionGroup } from '@app/components/common/Modal/TestConnectionGroup/TestConnectionGroup';
import { buildDatabaseUrl } from '@app/utils/databaseUrl';

import { Form, Radio, RadioChangeEvent, Typography } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { FormInstance } from 'antd/lib';
import React, { useState } from 'react';

const { Text, Paragraph } = Typography;
import { useTranslation } from 'react-i18next';

export type DatabaseConnectionStepProps = {
  form: FormInstance<unknown>;
  showMessage: boolean;
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>;
  isConnected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setDbUrl: React.Dispatch<React.SetStateAction<string>>;
  isEditing?: boolean;
  connectionType?: string;
  onConnectionTypeChange?: (type: any) => void;
};

export const DatabaseConnectionStep = ({
  form,
  showMessage,
  setShowMessage,
  isConnected,
  setConnected,
  setDbUrl,
  isEditing = false,
  connectionType = 'CLOUD_CONNECT',
  onConnectionTypeChange,
}: DatabaseConnectionStepProps) => {
  const { t } = useTranslation();
  const [isTestLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

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

        // Try to extract a helpful message from the API error
        const message =
          err?.options?.message ||
          err?.data?.message ||
          err?.message ||
          err?.response?.data?.message ||
          'Connection test failed';
        setTestError(message);
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
        {!isEditing && (
          <NumberedFormItem number={1}>
            <div className="flex flex-col gap-2">
              <Text strong>{t('dashboard.createProject.form.step3.connectionType.title')}</Text>
              <Text type="secondary" className="text-xs">
                {t('dashboard.createProject.form.step3.connectionType.description')}
              </Text>
              <Radio.Group
                value={connectionType}
                onChange={(e) => onConnectionTypeChange?.(e.target.value)}
                className="flex flex-col gap-3 mt-2"
              >
                <Radio value="CLOUD_CONNECT" className="flex items-start">
                  <div>
                    <Text strong className="text-sm">
                      {t('dashboard.createProject.form.step3.connectionType.cloudConnect')}
                    </Text>
                    <Paragraph type="secondary" className="text-xs mb-0">
                      {t('dashboard.createProject.form.step3.connectionType.cloudConnectDesc')}
                    </Paragraph>
                  </div>
                </Radio>
                <Radio value="PROXY" className="flex items-start">
                  <div>
                    <Text strong className="text-sm">
                      {t('dashboard.createProject.form.step3.connectionType.proxy')}
                    </Text>
                    <Paragraph type="secondary" className="text-xs mb-0">
                      {t('dashboard.createProject.form.step3.connectionType.proxyDesc')}
                    </Paragraph>
                  </div>
                </Radio>
              </Radio.Group>
            </div>
          </NumberedFormItem>
        )}

        {connectionType === 'PROXY' && !isEditing && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <Text strong className="text-sm">
              {t('dashboard.createProject.form.step3.proxy.title')}
            </Text>
            <Paragraph type="secondary" className="text-xs mt-1 mb-3">
              {t('dashboard.createProject.form.step3.proxy.description')}
            </Paragraph>
            <div className="bg-gray-900 text-green-400 rounded-md p-3 font-mono text-xs leading-relaxed">
              <div># 1. Install epsilon-proxy</div>
              <div className="text-white">
                curl -fsSL https://raw.githubusercontent.com/Epsilon-Data/epsilon-proxy/main/scripts/install.sh | sh
              </div>
              <div className="mt-2"># 2. Register (token will be generated after project creation)</div>
              <div className="text-white">epsilon-proxy register --token &lt;TOKEN&gt;</div>
              <div className="mt-2"># 3. Start the proxy</div>
              <div className="text-white">epsilon-proxy start</div>
            </div>
            <Paragraph type="secondary" className="text-xs mt-3 mb-0">
              {t('dashboard.createProject.form.step3.proxy.note')}
            </Paragraph>
          </div>
        )}

        {connectionType !== 'PROXY' && (
          <>
            <NumberedFormItem number={isEditing ? 1 : 2}>
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
                  <NumberedFormItem number={3} showDivider={false}>
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
                    number={isEditing ? 3 : 5}
                    errorMessage={testError}
                  />
                )}
                {!isEditing && !hasCreds && (
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
          </>
        )}
      </Form>
    </div>
  );
};
