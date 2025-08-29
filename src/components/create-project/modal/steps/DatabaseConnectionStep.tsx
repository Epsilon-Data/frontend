import { testConnection } from '@app/api/connectionRequests.api';
import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { ModalSelect } from '@app/components/common/Modal/ModalSelect/ModalSelect';
import { TestConnectionGroup } from '@app/components/common/Modal/TestConnectionGroup/TestConnectionGroup';

import { Form } from 'antd';
import { FormInstance } from 'antd/lib';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type DatabaseConnectionStepProps = {
  form: FormInstance<unknown>;
  showMessage: boolean;
  setShowMessage: React.Dispatch<React.SetStateAction<boolean>>;
  isConnected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DatabaseConnectionStep = ({
  form,
  showMessage,
  setShowMessage,
  isConnected,
  setConnected,
}: DatabaseConnectionStepProps) => {
  const { t } = useTranslation();
  const [isTestLoading, setTestLoading] = useState(false);

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
        type: form.getFieldValue('dbType'),
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
        />
      </Form>
    </div>
  );
};
