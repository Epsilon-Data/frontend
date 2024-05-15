import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { DatabaseConnectionDetails, RequestDetails } from '@app/interfaces/interfaces';
import { StringInputItem } from '../request-fields/StringInput/StringInputItem';
import { SelectInputItem } from '../request-fields/SelectInput/SelectInputItem';
import { PasswordInputItem } from '../request-fields/PasswordInput/PasswordInputItem';
import { RequestDataInfo } from './RequestDataInfo';
import { TestConnectionGroup } from '../request-fields/TestConnectionGroup/TestConnectionGroup';
import { FormModal } from '../request-fields/FormModal/FormModal';
import { createRequest } from '@app/api/connectionRequests.api';
import { AppDate } from '@app/constants/Dates';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { testConnection } from '@app/api/connectionRequests.api';
import config from '@app/config/config';
import { notificationController } from '@app/controllers/notificationController';
import { DATABASE_TYPES } from '@app/constants/connectionRequest';

export const RequestDatabaseInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const initialValues = {
    databaseName: formValue.databaseInfo?.name || `${config.isDev ? 'test' : ''}`,
    databaseType: formValue.databaseInfo?.type || `${config.isDev ? 'postgres' : ''}`,
    databaseHost: formValue.databaseInfo?.host || `${config.isDev ? 'localhost' : ''}`,
    databasePort: formValue.databaseInfo?.port || `${config.isDev ? '5433' : ''}`,
    databaseUsername: formValue.databaseInfo?.username || `${config.isDev ? 'test_admin' : ''}`,
    databasePassword: formValue.databaseInfo?.password || `${config.isDev ? 'supersecret' : ''}`,
    dataCollectionDuration: formValue.dataInfo.collectionDuration.map((date: Date) => dayjs(date)),
    dataParticipantsNumber: formValue.dataInfo.participantsNumber || `${config.isDev ? 100 : null}`,
    dataDescription: formValue.dataInfo.description || `${config.isDev ? 'Some test data description.' : ''}`,
    dataKeywords: formValue.dataInfo.keywords,
  };
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isFormLoading, setFormLoading] = useState(false);
  const [isTestLoading, setTestLoading] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [keywords, setKeywords] = useState(initialValues.dataKeywords);
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (values: any) => {
      setFormLoading(true);
      values.dataCollectionDuration = values.dataCollectionDuration.map((appDate: AppDate) => dayjs(appDate).toDate());
      values.dataKeywords = keywords;

      if (isConnected) {
        const updatedRequest = {
          ...formValue,
          databaseInfo: {
            name: values.databaseName,
            type: values.databaseType,
            host: values.databaseHost || '',
            port: values.databasePort || '',
            username: values.databaseUsername || '',
            password: values.databasePassword || '',
          },
          dataInfo: {
            collectionDuration: values.dataCollectionDuration,
            participantsNumber: values.dataParticipantsNumber,
            description: values.dataDescription,
            keywords: values.dataKeywords,
          },
        };
        setFormValue(updatedRequest);
        setIsFormModalOpen(true);
      }
    },
    [formValue, isConnected, keywords, setFormValue],
  );

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

    const connectionData: DatabaseConnectionDetails = {
      type: databaseType,
      port: databasePort,
      host: databaseHost,
      username: databaseUsername,
      password: databasePassword,
      name: databaseName,
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

  const handleSubmit = () => {
    setFormLoading(true);
    setFieldsChanged(true);
    setSubmitLoading(true);
    createRequest(formValue)
      .then(() => {
        navigate('/requests/database');
        notificationController.success({
          message: t('connectionRequests.create.successNotify'),
        });
      })
      .catch(() => {
        notificationController.error({
          message: t('connectionRequests.create.failNotify'),
        });
      });

    setFormLoading(false);
    setFieldsChanged(false);
    setSubmitLoading(false);
  };

  return (
    <BaseButtonsForm
      form={form}
      name="info"
      loading={isFormLoading}
      initialValues={initialValues}
      isFieldsChanged={isFieldsChanged}
      setFieldsChanged={setFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      onFinish={onFinish}
      buttonText={t('connectionRequests.create.altTitle')}
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
          <StringInputItem name="databaseName" label={t('connectionRequests.details.databaseInfo.name')} required />
        </BaseCol>

        <BaseCol span={24}>
          <SelectInputItem
            name="databaseType"
            label={t('connectionRequests.details.databaseInfo.type')}
            optionItems={DATABASE_TYPES}
            prompt={t('connectionRequests.details.databaseInfo.typePrompt')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="databaseHost" label={t('connectionRequests.details.databaseInfo.host')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="databasePort" label={t('connectionRequests.details.databaseInfo.port')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="databaseUsername"
            label={t('connectionRequests.details.databaseInfo.username')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <PasswordInputItem
            name="databasePassword"
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

        <RequestDataInfo tags={keywords} onTagsChange={setKeywords} />
        <FormModal
          isModalOpen={isFormModalOpen}
          setIsModalOpen={setIsFormModalOpen}
          onSubmit={handleSubmit}
          loading={isSubmitLoading}
        />
      </BaseRow>
    </BaseButtonsForm>
  );
};
