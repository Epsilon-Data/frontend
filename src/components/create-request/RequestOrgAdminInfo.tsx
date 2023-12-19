import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { RequestDetails } from '@app/interfaces/interfaces';
import { StringInputItem } from '../request-fields/StringInput/StringInputItem';
import { useNavigate } from 'react-router-dom';
import { RequestDataInfo } from './RequestDataInfo';
import { StringTextAreaItem } from '../request-fields/StringInput/StringTextAreaItem';
import { BaseTooltip } from '../common/BaseTooltip/BaseTooltip';
import { InfoCircleOutlined } from '@ant-design/icons';

export const RequestOrgAdminInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback(
    (values: RequestDetails) => {
      setLoading(true);
      const updatedRequest = {
        ...formValue,
        orgAdminEmail: values.orgAdminEmail || '',
        dataInfo: {
          collectionDuration: values.dataInfo?.collectionDuration,
          participantsNumber: values.dataInfo?.participantsNumber,
          description: values.dataInfo?.description,
          keywords: values.dataInfo?.keywords,
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
      buttonText={t('connectionRequests.altCreate')}
      style={{ width: '80%' }}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseButtonsForm.Item>
            <BaseButtonsForm.Title>{t('connectionRequests.details.orgAdminInfo.title')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="orgAdminEmail"
            label={t('connectionRequests.details.orgAdminInfo.email')}
            suffix={
              <BaseTooltip title={t('connectionRequests.details.orgAdminInfo.tooltip')}>
                <InfoCircleOutlined rev={undefined} />
              </BaseTooltip>
            }
            required
          />
        </BaseCol>

        <RequestDataInfo formValue={formValue} />

        <BaseCol span={24}>
          <StringTextAreaItem
            name="additionalInfo"
            label={t('connectionRequests.details.addInfo.title')}
            placeholder={t('connectionRequests.details.addInfo.placeholder')}
          />
        </BaseCol>
      </BaseRow>
    </BaseButtonsForm>
  );
};
