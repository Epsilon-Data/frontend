import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ConnectionRequest } from '@app/interfaces/interfaces';
import { StringInputItem } from './StringInput/StringInputItem';
import { useNavigate } from 'react-router-dom';
import { RequestDataInfo } from './RequestDataInfo';
import { StringTextAreaItem } from './StringInput/StringTextAreaItem';
import { BaseTooltip } from '../common/BaseTooltip/BaseTooltip';
import { InfoCircleOutlined } from '@ant-design/icons';

export const RequestOrgAdminInfo: React.FC<{
  formValue: ConnectionRequest;
  setFormValue: (value: ConnectionRequest) => void;
}> = ({ formValue, setFormValue }) => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback(
    (values: ConnectionRequest) => {
      setLoading(true);
      const updatedRequest = {
        ...formValue,
        orgAdminEmail: values.orgAdminEmail || '',
        dataInfo: {
          collectionDuration: values.dataInfo.collectionDuration,
          participantsNumber: values.dataInfo.participantsNumber,
          description: values.dataInfo.description,
          keywords: values.dataInfo.keywords,
        },
        additionalInfo: values.additionalInfo || '',
      };
      setFormValue(updatedRequest);
      //TODO: add request to database
      setTimeout(() => {
        setLoading(false);
        setFieldsChanged(false);
        navigate('/r-connection-requests');
        console.log(formValue);
      }, 1000);
    },
    [formValue, navigate, setFormValue],
  );

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
      buttonText={t('connectionRequests.create.altTitle')}
      style={{ width: '80%' }}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseButtonsForm.Item>
            <BaseButtonsForm.Title>{t('connectionRequests.create.orgAdminInfo.title')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="orgAdminEmail"
            label={t('connectionRequests.create.orgAdminInfo.email')}
            suffix={
              <BaseTooltip title={t('connectionRequests.create.orgAdminInfo.tooltip')}>
                <InfoCircleOutlined rev={undefined} />
              </BaseTooltip>
            }
          />
        </BaseCol>

        <RequestDataInfo formValue={formValue} />

        <BaseCol span={24}>
          <StringTextAreaItem
            name="additionalInfo"
            label={t('connectionRequests.create.addInfo.title')}
            placeholder={t('connectionRequests.create.addInfo.placeholder')}
          />
        </BaseCol>
      </BaseRow>
    </BaseButtonsForm>
  );
};
