import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ConnectionRequest } from '@app/interfaces/interfaces';
import { StringInputItem } from './StringInput/StringInputItem';
import { StringTextAreaItem } from './StringInput/StringTextAreaItem';
import { useNavigate } from 'react-router-dom';
import { DateRangeInputItem } from './DateRangeInput/DateRangeInputItem';
import { TagInputItem } from './TagInput/TagInputItem';
import { RadioInputItem } from './RadioInput/RadioInputItem';

export const RequestOrgAdminInfo: React.FC<{
  formValue: ConnectionRequest;
  setFormValue: (value: ConnectionRequest) => void;
}> = (input) => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback(
    (values: ConnectionRequest) => {
      setLoading(true);
      input.setFormValue(values);
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
    [input, navigate],
  );

  return (
    <BaseButtonsForm
      form={form}
      name="info"
      loading={isLoading}
      initialValues={input.formValue}
      isFieldsChanged={isFieldsChanged}
      setFieldsChanged={setFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      onFinish={onFinish}
      buttonText={t('connectionRequests.create.projectInfo.continue')}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseButtonsForm.Item>
            <BaseButtonsForm.Title>{t('connectionRequests.create.projectInfo.title')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>

        <BaseCol span={20}>
          <StringInputItem name="projectName" label={t('connectionRequests.create.projectInfo.name')} />
        </BaseCol>

        <BaseCol span={20} style={{ paddingBottom: '1rem' }}>
          <DateRangeInputItem name="projectDuration" label={t('connectionRequests.create.projectInfo.duration')} />
        </BaseCol>

        <BaseCol span={20}>
          <StringInputItem name="projectLead" label={t('connectionRequests.create.projectInfo.lead')} />
        </BaseCol>

        <BaseCol span={20}>
          <TagInputItem
            name="projectTeamMembers"
            label={t('connectionRequests.create.projectInfo.teamMembers')}
            initialTags={input.formValue.projectTeamMembers}
            prompt={t('connectionRequests.create.projectInfo.addTeamMembers')}
          />
        </BaseCol>

        <BaseCol span={20}>
          <StringInputItem name="university" label={t('connectionRequests.create.projectInfo.university')} />
        </BaseCol>

        <BaseCol span={20}>
          <StringInputItem name="faculty" label={t('connectionRequests.create.projectInfo.faculty')} />
        </BaseCol>

        <BaseCol span={20}>
          <StringInputItem
            name="ethicsApprovalId"
            label={t('connectionRequests.create.projectInfo.ethicsApprovalId')}
          />
        </BaseCol>

        <BaseCol span={20}>
          <StringTextAreaItem
            name="projectDescription"
            label={t('connectionRequests.create.projectInfo.description')}
          />
        </BaseCol>

        <BaseCol span={20}>
          <RadioInputItem name="isOwnData" label={t('connectionRequests.create.projectInfo.isOwnData')} />
        </BaseCol>
      </BaseRow>
    </BaseButtonsForm>
  );
};
