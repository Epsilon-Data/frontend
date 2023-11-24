import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { RequestDetails } from '@app/interfaces/interfaces';
import { StringInputItem } from './StringInput/StringInputItem';
import { StringTextAreaItem } from './StringInput/StringTextAreaItem';
import { useNavigate } from 'react-router-dom';
import { DateRangeInputItem } from './DateRangeInput/DateRangeInputItem';
import { TagInputItem } from './TagInput/TagInputItem';
import { RadioInputItem } from './RadioInput/RadioInputItem';

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
        projectName: values.projectName,
        projectDuration: values.projectDuration,
        projectLead: values.projectLead,
        projectTeamMembers: values.projectTeamMembers,
        university: values.university,
        faculty: values.faculty,
        ethicsApprovalId: values.ethicsApprovalId,
        projectDescription: values.projectDescription,
        isOwnData: values.isOwnData,
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
          <StringInputItem name="projectName" label={t('connectionRequests.details.projectInfo.name')} required />
        </BaseCol>

        <BaseCol span={24}>
          <DateRangeInputItem
            name="projectDuration"
            label={t('connectionRequests.details.projectInfo.duration')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="projectLead" label={t('connectionRequests.details.projectInfo.lead')} required />
        </BaseCol>

        <BaseCol span={24}>
          <TagInputItem
            name="projectTeamMembers"
            label={t('connectionRequests.details.projectInfo.teamMembers')}
            initialTags={formValue.projectTeamMembers}
            prompt={t('connectionRequests.details.projectInfo.addTeamMembers')}
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="university" label={t('connectionRequests.details.projectInfo.university')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="faculty" label={t('connectionRequests.details.projectInfo.faculty')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="ethicsApprovalId"
            label={t('connectionRequests.details.projectInfo.ethicsApprovalId')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem
            name="projectDescription"
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
