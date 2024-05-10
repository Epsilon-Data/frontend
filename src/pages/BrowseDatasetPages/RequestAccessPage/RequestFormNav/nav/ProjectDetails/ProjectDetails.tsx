import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { AccessDetails } from '@app/interfaces/interfaces';
import { StringInputItem } from '@app/components/request-fields/StringInput/StringInputItem';
import { StringTextAreaItem } from '@app/components/request-fields/StringInput/StringTextAreaItem';
import { DateRangeInputItem } from '@app/components/request-fields/DateRangeInput/DateRangeInputItem';
import { TagInputItem } from '@app/components/request-fields/TagInput/TagInputItem';
import dayjs from 'dayjs';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { AppDate } from '@app/constants/Dates';

export const ProjectDetails: React.FC<{
  formValue: AccessDetails;
  setFormValue: (value: AccessDetails) => void;
}> = ({ formValue, setFormValue }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initialValues: any = {
    projectName: formValue.projectName,
    projectDuration: formValue.projectDuration.map((date: Date) => dayjs(date)),
    projectDescription: formValue.projectDescription,
    projectMembers: formValue.projectMembers,
  };
  const [members, setMembers] = useState(initialValues.projectMembers);

  const [form] = BaseForm.useForm();

  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    allValues.projectDuration = allValues.projectDuration.map((appDate: AppDate) => dayjs(appDate).toDate());
    allValues.projectMembers = members;
    const updatedDetails = {
      ...formValue,
      projectName: allValues.projectName,
      projectDuration: allValues.projectDuration,
      projectDescription: allValues.projectDescription,
      projectMembers: allValues.projectMembers,
    };
    setFormValue(updatedDetails);
  };

  return (
    <BaseForm
      form={form}
      name="project"
      initialValues={initialValues}
      style={{ width: '80%' }}
      onValuesChange={handleFormValueChange}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseForm.Item>
            <BaseForm.Title>{t('browse.access.project.title')}</BaseForm.Title>
          </BaseForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="projectName" label={t('browse.access.project.name')} required />
        </BaseCol>

        <BaseCol span={24}>
          <DateRangeInputItem name="projectDuration" label={t('browse.access.project.duration')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem name="projectDescription" label={t('browse.access.project.description')} required />
        </BaseCol>

        <BaseCol span={24}>
          <TagInputItem
            name="projectMembers"
            tags={members}
            onTagsChange={setMembers}
            label={t('browse.access.project.members')}
            prompt={t('browse.access.project.addMembers')}
          />
        </BaseCol>
      </BaseRow>
    </BaseForm>
  );
};
