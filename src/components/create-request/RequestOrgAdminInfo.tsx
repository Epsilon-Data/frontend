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
import { createRequest } from '@app/api/connectionRequests.api';
import { AppDate } from '@app/constants/Dates';
import dayjs from 'dayjs';
import { notificationController } from '@app/controllers/notificationController';

export const RequestOrgAdminInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const initialValues = {
    orgAdminEmail: formValue.orgAdminEmail,
    dataCollectionDuration: formValue.dataInfo.collectionDuration.map((date: Date) => dayjs(date)),
    dataParticipantsNumber: formValue.dataInfo.participantsNumber,
    dataDescription: formValue.dataInfo.description,
    dataKeywords: formValue.dataInfo.keywords,
    additionalInfo: formValue.additionalInfo,
  };

  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState(initialValues.dataKeywords);

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (values: any) => {
      setLoading(true);
      values.dataCollectionDuration = values.dataCollectionDuration.map((appDate: AppDate) => dayjs(appDate).toDate());
      values.dataKeywords = keywords;

      const updatedRequest = {
        ...formValue,
        orgAdminEmail: values.orgAdminEmail || '',
        dataInfo: {
          collectionDuration: values.dataCollectionDuration,
          participantsNumber: values.dataParticipantsNumber,
          description: values.dataDescription,
          keywords: values.dataKeywords,
        },
        additionalInfo: values.additionalInfo || '',
      };
      setFormValue(updatedRequest);
      createRequest(updatedRequest)
        .then(() => {
          setLoading(false);
          setFieldsChanged(false);
          navigate('/r-connection-requests');
          notificationController.success({
            message: t('connectionRequests.create.successNotify'),
          });
        })
        .catch(() => {
          notificationController.error({
            message: t('connectionRequests.create.failNotify'),
          });
        });
    },
    [formValue, keywords, navigate, setFormValue, t],
  );

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
      buttonText={t('connectionRequests.create.altTitle')}
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

        <RequestDataInfo tags={keywords} onTagsChange={setKeywords} />

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
