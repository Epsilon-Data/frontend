import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ConnectionRequest, DatabaseInfo } from '@app/interfaces/interfaces';
import { StringInputItem } from './StringInput/StringInputItem';
import { useNavigate } from 'react-router-dom';
import { DropdownInputItem } from './DropdownInput/DropdownInputItem';
import { DateRangeInputItem } from './DateRangeInput/DateRangeInputItem';
import { StringTextAreaItem } from './StringInput/StringTextAreaItem';
import { TagInputItem } from './TagInput/TagInputItem';

export const RequestDatabaseInfo: React.FC<{
  formValue: ConnectionRequest;
  setFormValue: (value: ConnectionRequest) => void;
}> = ({ formValue, setFormValue }) => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const databaseInfo = formValue.databaseInfo
    ? formValue.databaseInfo
    : { name: '', type: '', url: '', username: '', password: '' };

  const dropdownItems = [
    {
      key: 'postgres',
      label: t('connectionRequests.create.databaseInfo.postgres'),
    },
    {
      key: 'mysql',
      label: t('connectionRequests.create.databaseInfo.mysql'),
    },
    {
      key: 'mongo',
      label: t('connectionRequests.create.databaseInfo.mongo'),
    },
  ];

  const onFinish = useCallback(
    (values: DatabaseInfo) => {
      setLoading(true);
      formValue.databaseInfo = values;
      setFormValue(formValue);
      //TODO: add request to database
      setTimeout(() => {
        setLoading(false);
        setFieldsChanged(false);
        navigate('/r-connection-requests');
        console.log(values);
      }, 1000);
    },
    [formValue, navigate, setFormValue],
  );

  return (
    <BaseButtonsForm
      form={form}
      name="info"
      loading={isLoading}
      initialValues={databaseInfo}
      isFieldsChanged={isFieldsChanged}
      setFieldsChanged={setFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      onFinish={onFinish}
      buttonText={t('connectionRequests.create.altTitle')}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseButtonsForm.Item>
            <BaseButtonsForm.Title>{t('connectionRequests.create.databaseInfo.title')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>

        <BaseCol span={20}>
          <StringInputItem name="name" label={t('connectionRequests.create.databaseInfo.name')} />
        </BaseCol>

        <BaseCol span={20}>
          <DropdownInputItem
            name="type"
            label={t('connectionRequests.create.databaseInfo.type')}
            positionItems={dropdownItems}
            prompt={t('connectionRequests.create.databaseInfo.typePrompt')}
          />
        </BaseCol>

        <BaseCol span={20}>
          <StringInputItem name="url" label={t('connectionRequests.create.databaseInfo.url')} />
        </BaseCol>

        <BaseCol span={20}>
          <StringInputItem name="username" label={t('connectionRequests.create.databaseInfo.username')} />
        </BaseCol>

        <BaseCol span={20}>
          <BaseButtonsForm.Title>{t('connectionRequests.create.dataInfo.title')}</BaseButtonsForm.Title>
        </BaseCol>

        <BaseCol span={20}>
          <DateRangeInputItem
            name="collectionDuration"
            label={t('connectionRequests.create.dataInfo.collectionDuration')}
          />
        </BaseCol>

        <BaseCol span={20}>
          <StringTextAreaItem name="description" label={t('connectionRequests.create.dataInfo.description')} />
        </BaseCol>

        <BaseCol span={20}>
          <TagInputItem
            name="keywords"
            label={t('connectionRequests.create.dataInfo.keywords')}
            initialTags={formValue.dataInfo.keywords ? formValue.dataInfo.keywords : []}
            prompt={t('connectionRequests.create.dataInfo.addKeywords')}
          />
        </BaseCol>
      </BaseRow>
    </BaseButtonsForm>
  );
};
