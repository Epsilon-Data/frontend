import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { RequestDetails } from '@app/interfaces/interfaces';
import { StringInputItem } from '../request-fields/StringInput/StringInputItem';
import { SelectInputItem } from '../request-fields/SelectInput/SelectInputItem';
import { PasswordInputItem } from '../request-fields/PasswordInput/PasswordInputItem';
import { RequestDataInfo } from './RequestDataInfo';
import { TestConnectionGroup } from '../request-fields/TestConnectionGroup/TestConnectionGroup';
import { FormModal } from '../request-fields/FormModal/FormModal';
import { createRequest } from '@app/api/connectionRequests.api';

export const RequestDatabaseInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const initialValues = {
    databaseName: formValue.databaseInfo?.name,
    databaseType: formValue.databaseInfo?.type,
    databaseUrl: formValue.databaseInfo?.url,
    databaseUsername: formValue.databaseInfo?.username,
    databasePassword: formValue.databaseInfo?.password,
    dataCollectionDuration: formValue.dataInfo.collectionDuration,
    dataParticipantsNumber: formValue.dataInfo.participantsNumber,
    dataDescription: formValue.dataInfo.description,
    dataKeywords: formValue.dataInfo.keywords,
  };
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const selectItems = [
    {
      value: 'postgres',
      label: t('connectionRequests.details.databaseInfo.postgres'),
    },
    {
      value: 'mysql',
      label: t('connectionRequests.details.databaseInfo.mysql'),
    },
    {
      value: 'mongo',
      label: t('connectionRequests.details.databaseInfo.mongo'),
    },
  ];

  const onFinish = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (values: any) => {
      setLoading(true);
      if (isConnected) {
        const updatedRequest = {
          ...formValue,
          databaseInfo: {
            name: values.databaseName,
            type: values.databaseType,
            url: values.databaseUrl || '',
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
        createRequest(formValue);
      }

      setLoading(false);
      setFieldsChanged(false);
      setIsFormModalOpen(true);
      console.log(formValue);
    },
    [formValue, isConnected, setFormValue],
  );

  const onTestConnection = () => {
    //TODO: test connection
    setConnected(true);
    setShowMessage(true);
  };

  return (
    <BaseButtonsForm
      form={form}
      name="info"
      loading={isLoading}
      initialValues={initialValues}
      isFieldsChanged={isFieldsChanged}
      setFieldsChanged={setFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      onFinish={onFinish}
      buttonText={t('connectionRequests.altCreate')}
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
            optionItems={selectItems}
            prompt={t('connectionRequests.details.databaseInfo.typePrompt')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="databaseUrl" label={t('connectionRequests.details.databaseInfo.url')} required />
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
          <TestConnectionGroup onClick={onTestConnection} connected={isConnected} show={showMessage} />
        </BaseCol>

        <RequestDataInfo initialKeywords={initialValues.dataKeywords} />
        <FormModal isFormModalOpen={isFormModalOpen} setIsFormModalOpen={setIsFormModalOpen} />
      </BaseRow>
    </BaseButtonsForm>
  );
};
