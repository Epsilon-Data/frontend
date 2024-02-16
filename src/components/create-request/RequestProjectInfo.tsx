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
import dayjs from 'dayjs';
import { AppDate } from '@app/constants/Dates';

export const RequestProjectInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initialValues: any = {
    name: formValue.projectInfo.name,
    duration: formValue.projectInfo.duration.map((date: Date) => dayjs(date)),
    lead: formValue.projectInfo.lead,
    members: formValue.projectInfo.members,
    university: formValue.projectInfo.university,
    faculty: formValue.projectInfo.faculty,
    ethicsId: formValue.projectInfo.ethicsId,
    description: formValue.projectInfo.description,
    isOwnData: formValue.projectInfo.isOwnData,
  };
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [members, setMembers] = useState(initialValues.members);

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (values: any) => {
      setLoading(true);
      values.duration = values.duration.map((appDate: AppDate) => dayjs(appDate).toDate());
      values.members = members;

      const updatedRequest = {
        ...formValue,
        projectInfo: values,
      };
      setFormValue(updatedRequest);
      setLoading(false);
      setFieldsChanged(false);
      if (values.isOwnData) {
        navigate('/connection-requests/create/database-info');
      } else {
        navigate('/connection-requests/create/org-admin-info');
      }
    },
    [formValue, members, navigate, setFormValue],
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
          <StringInputItem name="name" label={t('connectionRequests.details.projectInfo.name')} required />
        </BaseCol>

        <BaseCol span={24}>
          <DateRangeInputItem name="duration" label={t('connectionRequests.details.projectInfo.duration')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="lead" label={t('connectionRequests.details.projectInfo.lead')} required />
        </BaseCol>

        <BaseCol span={24}>
          <TagInputItem
            name="members"
            tags={members}
            onTagsChange={setMembers}
            label={t('connectionRequests.details.projectInfo.teamMembers')}
            prompt={t('connectionRequests.details.projectInfo.addTeamMembers')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="university" label={t('connectionRequests.details.projectInfo.university')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="faculty" label={t('connectionRequests.details.projectInfo.faculty')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="ethicsId" label={t('connectionRequests.details.projectInfo.ethicsId')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem name="description" label={t('connectionRequests.details.projectInfo.description')} />
        </BaseCol>

        <BaseCol span={24}>
          <RadioInputItem name="isOwnData" label={t('connectionRequests.details.projectInfo.isOwnData')} required />
        </BaseCol>
      </BaseRow>
    </BaseButtonsForm>
  );
};
