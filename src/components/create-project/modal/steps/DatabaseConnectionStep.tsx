import { testConnection } from '@app/api/connectionRequests.api';
import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { ModalSelect } from '@app/components/common/Modal/ModalSelect/ModalSelect';
import { TestConnectionGroup } from '@app/components/common/Modal/TestConnectionGroup/TestConnectionGroup';

import { Form, Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { FormInstance } from 'antd/lib';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type DatbaseConnectionStepProps = {
  form: FormInstance<unknown>;
  showMessage: boolean;
  setShowMessage: (show: boolean) => void;
};

export const DatabaseConnectionStep = ({ form, showMessage, setShowMessage }: DatbaseConnectionStepProps) => {
  const { t } = useTranslation();
  const [isTestLoading, setTestLoading] = useState(false);
  const [isConnected, setConnected] = useState(false);

  const dbTypeOptions = [
    { value: 'postgres', label: 'PostgreSQL' },
    { value: 'csv', label: 'CSV' },
  ];
  const onTestConnection = async () => {
    setTestLoading(true);

    const { dbUrl } = form.getFieldsValue(['dbUrl']);

    let url = dbUrl;

    try {
      url = new URL(dbUrl);
      const connectionData = {
        type: 'postgres',
        port: url.port,
        host: url.hostname,
        username: url.username,
        password: url.password,
        name: url.pathname.replace(/^\//, ''),
        ssl: false,
      };

      try {
        await testConnection(connectionData);
        setConnected(true);
      } catch (error) {
        setConnected(false);
      }
    } catch (error) {
      setConnected(false);
    }

    setShowMessage(true);
    setTestLoading(false);
  };

  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form} className="h-full">
        <ModalInput
          name="dbName"
          inputTitle={t('dashboard.createProject.form.step4.dbName.title')}
          placeholder={t('dashboard.createProject.form.step4.dbName.placeholder')}
        />
        <ModalSelect
          name="dbType"
          inputTitle={t('dashboard.createProject.form.step4.dbType.title')}
          options={dbTypeOptions}
        />
        <TestConnectionGroup
          inputTitle={t('dashboard.createProject.form.step4.dbUrl.title')}
          inputDescription={t('dashboard.createProject.form.step4.dbUrl.description')}
          connected={isConnected}
          loading={isTestLoading}
          show={showMessage}
          onClick={onTestConnection}
        >
          <div className="flex-1">
            <p className="mb-1 text-xs">{t('dashboard.createProject.form.step4.username.title')}</p>
            <FormItem name="username">
              <Input
                placeholder={t('dashboard.createProject.form.step4.username.placeholder')}
                className="border border-black bg-grey-4"
              />
            </FormItem>
          </div>
          <div className="flex-1">
            <p className="mb-1 text-xs">{t('dashboard.createProject.form.step4.password.title')}</p>
            <FormItem name="password">
              <Input.Password
                placeholder={t('dashboard.createProject.form.step4.password.placeholder')}
                className="border border-black bg-grey-4"
              />
            </FormItem>
          </div>
        </TestConnectionGroup>
      </Form>
    </div>
  );
};
