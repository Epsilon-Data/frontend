import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { RequestDetails } from '@app/interfaces/interfaces';
import { StringInputItem } from '@app/components/request-fields/StringInput/StringInputItem';
import { StringTextAreaItem } from '@app/components/request-fields/StringInput/StringTextAreaItem';
import { DateRangeInputItem } from '@app/components/request-fields/DateRangeInput/DateRangeInputItem';
import { TagInputItem } from '@app/components/request-fields/TagInput/TagInputItem';
import dayjs from 'dayjs';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { AppDate } from '@app/constants/Dates';

export const ProjectInfo: React.FC<{
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
  };
  const [members, setMembers] = useState(initialValues.members);

  const [form] = BaseForm.useForm();

  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    allValues.duration = allValues.duration.map((appDate: AppDate) => dayjs(appDate).toDate());
    allValues.members = members;
    const updatedRequest = {
      ...formValue,
      projectInfo: allValues,
    };
    setFormValue(updatedRequest);
  };

  return (
    <BaseForm
      form={form}
      name="projectInfo"
      initialValues={initialValues}
      style={{ width: '80%' }}
      onValuesChange={handleFormValueChange}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseForm.Item>
            <BaseForm.Title>{t('connectionRequests.details.projectInfo.title')}</BaseForm.Title>
          </BaseForm.Item>
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
      </BaseRow>
    </BaseForm>
  );
};
