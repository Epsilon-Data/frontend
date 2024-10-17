import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './ApproveRequestPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { StringInputItem } from '@app/components/request-fields/StringInput/StringInputItem';
import { SelectInputItem } from '@app/components/request-fields/SelectInput/SelectInputItem';
import { DATABASE_TYPES } from '@app/constants/connectionRequest';
import { PasswordInputItem } from '@app/components/request-fields/PasswordInput/PasswordInputItem';
import { TestConnectionGroup } from '@app/components/request-fields/TestConnectionGroup/TestConnectionGroup';
import { notificationController } from '@app/controllers/notificationController';
import { approveRequest, testConnection } from '@app/api/connectionRequests.api';
import config from '@app/config/config';
import { DatabaseConnectionDetails, DatabaseInfoFormValues } from '@app/interfaces/interfaces';

const ApproveRequestPage: React.FC = () => {
  const { id } = useParams();
  const initialValues = {
    name: `${config.isDev ? 'test' : ''}`,
    type: `${config.isDev ? 'postgres' : ''}`,
    host: `${config.isDev ? 'localhost' : ''}`,
    port: `${config.isDev ? '5433' : ''}`,
    username: `${config.isDev ? 'test_admin' : ''}`,
    password: `${config.isDev ? 'supersecret' : ''}`,
  };
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isFormLoading, setFormLoading] = useState(false);
  const [isTestLoading, setTestLoading] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const [form] = BaseButtonsForm.useForm();
  const { t } = useTranslation();

  const onFinish = useCallback(
    (values: DatabaseInfoFormValues) => {
      setFieldsChanged(true);
      setFormLoading(true);

      if (isConnected) {
        approveRequest(values, id)
          .then(() => {
            setFormLoading(false);
            setFieldsChanged(false);
            navigate('/requests/database/receive');
            notificationController.success({
              message: t('connectionRequests.approve.successNotify'),
            });
          })
          .catch(() => {
            notificationController.error({
              message: t('connectionRequests.approve.failNotify'),
            });
          });
      }
    },
    [id, isConnected, navigate, t],
  );

  const onTestConnection = async () => {
    setTestLoading(true);
    const { name, type, host, port, username, password } = form.getFieldsValue([
      'name',
      'type',
      'host',
      'port',
      'username',
      'password',
    ]);

    const connectionData: DatabaseConnectionDetails = {
      type: type,
      port: port,
      host: host,
      username: username,
      password: password,
      name: name,
      ssl: false,
    };

    testConnection(connectionData)
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

  return (
    <>
      <PageTitle>{t('connectionRequests.create.title')}</PageTitle>
      <S.FormWrapper>
        <S.Card id="approve-request" title={t('connectionRequests.approve.title')} padding="1.25rem 1.25rem 0">
          <BaseButtonsForm
            form={form}
            name="info"
            loading={isFormLoading}
            initialValues={initialValues}
            isFieldsChanged={isFieldsChanged}
            setFieldsChanged={setFieldsChanged}
            onFieldsChange={() => setFieldsChanged(true)}
            onFinish={onFinish}
            buttonText={t('connectionRequests.approve.confirm')}
            style={{ width: '80%' }}
            disabled={!isConnected}
          >
            <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
              <BaseCol span={24}>
                <BaseButtonsForm.Item>
                  <BaseButtonsForm.Title>{t('connectionRequests.details.databaseInfo.title')}</BaseButtonsForm.Title>
                </BaseButtonsForm.Item>
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
                <StringInputItem
                  name="username"
                  label={t('connectionRequests.details.databaseInfo.username')}
                  required
                />
              </BaseCol>

              <BaseCol span={24}>
                <PasswordInputItem
                  name="password"
                  label={t('connectionRequests.details.databaseInfo.password')}
                  required
                />
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
          </BaseButtonsForm>
        </S.Card>
      </S.FormWrapper>
    </>
  );
};

export default ApproveRequestPage;
