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

export const RequestDatabaseInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
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
    (values: RequestDetails) => {
      setLoading(true);
      if (isConnected) {
        const updatedRequest = {
          ...formValue,
          databaseInfo: {
            name: values.databaseInfo?.name || '',
            type: values.databaseInfo?.type || '',
            url: values.databaseInfo?.url || '',
            username: values.databaseInfo?.username || '',
            password: values.databaseInfo?.password || '',
          },
          dataInfo: {
            collectionDuration: values.dataInfo?.collectionDuration,
            participantsNumber: values.dataInfo?.participantsNumber,
            description: values.dataInfo?.description,
            keywords: values.dataInfo?.keywords,
          },
        };
        setFormValue(updatedRequest);
        //TODO: add request to database
      }
      setTimeout(() => {
        setLoading(false);
        setFieldsChanged(false);
        setIsFormModalOpen(true);
        console.log(formValue);
      }, 1000);
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
      initialValues={formValue}
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
          <StringInputItem
            name="databaseInfo.name"
            label={t('connectionRequests.details.databaseInfo.name')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <SelectInputItem
            name="databaseInfo.type"
            label={t('connectionRequests.details.databaseInfo.type')}
            optionItems={selectItems}
            prompt={t('connectionRequests.details.databaseInfo.typePrompt')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="databaseInfo.url" label={t('connectionRequests.details.databaseInfo.url')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="databaseInfo.username"
            label={t('connectionRequests.details.databaseInfo.username')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <PasswordInputItem
            name="databaseInfo.password"
            label={t('connectionRequests.details.databaseInfo.password')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <TestConnectionGroup onClick={onTestConnection} connected={isConnected} show={showMessage} />
        </BaseCol>

        <RequestDataInfo formValue={formValue} />
        <FormModal isFormModalOpen={isFormModalOpen} setIsFormModalOpen={setIsFormModalOpen} />
      </BaseRow>
    </BaseButtonsForm>
  );
};
