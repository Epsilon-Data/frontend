import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { RequestDetails } from '@app/interfaces/interfaces';
import { StringInputItem } from '../request-fields/StringInput/StringInputItem';
import { StringTextAreaItem } from '../request-fields/StringInput/StringTextAreaItem';
import { useNavigate } from 'react-router-dom';
import { DateRangeInputItem } from '../request-fields/DateRangeInput/DateRangeInputItem';
import { TagInputItem } from '../request-fields/TagInput/TagInputItem';
import { RadioInputItem } from '../request-fields/RadioInput/RadioInputItem';

export const RequestProjectInfo: React.FC<{
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
        isOwnData: values.isOwnData,
        projectInfo: {
          name: values.projectInfo.name,
          duration: values.projectInfo.duration,
          lead: values.projectInfo.lead,
          members: values.projectInfo.members,
          university: values.projectInfo.university,
          faculty: values.projectInfo.faculty,
          ethicsApprovalId: values.projectInfo.ethicsApprovalId,
          description: values.projectInfo.description,
        },
      };
      setFormValue(updatedRequest);
      //TODO: add request to database
      setTimeout(() => {
        setLoading(false);
        setFieldsChanged(false);
        if (values.isOwnData) {
          navigate('/r-connection-requests/create/database-info');
        } else {
          navigate('/r-connection-requests/create/org-admin-info');
        }
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
      initialValues={formValue}
      isFieldsChanged={isFieldsChanged}
      setFieldsChanged={setFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      onFinish={onFinish}
      buttonText={t('connectionRequests.details.projectInfo.continue')}
      style={{ width: '80%' }}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseButtonsForm.Item>
            <BaseButtonsForm.Title>{t('connectionRequests.details.projectInfo.title')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="projectInfo.name" label={t('connectionRequests.details.projectInfo.name')} required />
        </BaseCol>

        <BaseCol span={24}>
          <DateRangeInputItem
            name="projectInfo.duration"
            label={t('connectionRequests.details.projectInfo.duration')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="projectInfo.lead" label={t('connectionRequests.details.projectInfo.lead')} required />
        </BaseCol>

        <BaseCol span={24}>
          <TagInputItem
            name="projectInfo.members"
            label={t('connectionRequests.details.projectInfo.teamMembers')}
            initialTags={formValue.projectInfo.members}
            prompt={t('connectionRequests.details.projectInfo.addTeamMembers')}
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="projectInfo.university"
            label={t('connectionRequests.details.projectInfo.university')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="projectInfo.faculty"
            label={t('connectionRequests.details.projectInfo.faculty')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="projectInfo.ethicsApprovalId"
            label={t('connectionRequests.details.projectInfo.ethicsApprovalId')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem
            name="projectInfo.description"
            label={t('connectionRequests.details.projectInfo.description')}
          />
        </BaseCol>

        <BaseCol span={24}>
          <RadioInputItem name="isOwnData" label={t('connectionRequests.details.projectInfo.isOwnData')} required />
        </BaseCol>
      </BaseRow>
    </BaseButtonsForm>
  );
};
