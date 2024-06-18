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
    projectBackground: formValue.projectBackground,
    projectObjective: formValue.projectObjective,
    projectHypotheses: formValue.projectHypotheses,
    projectOutcome: formValue.projectOutcome,
    projectMembers: formValue.projectMembers,
  };
  const [members, setMembers] = useState(initialValues.projectMembers);

  const [form] = BaseForm.useForm();

  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    allValues.projectDuration = allValues.projectDuration.map((appDate: AppDate) => dayjs(appDate).toDate());

    const updatedDetails = {
      ...formValue,
      projectName: allValues.projectName,
      projectDuration: allValues.projectDuration,
      projectBackground: allValues.projectBackground,
      projectObjective: allValues.projectObjective,
      projectHypotheses: allValues.projectHypotheses,
      projectOutcome: allValues.projectOutcome,
    };
    setFormValue(updatedDetails);
  };

  const handleTagsChange = (tags: string[]) => {
    setMembers(tags);
    setFormValue({ ...formValue, projectMembers: tags });
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
          <StringTextAreaItem name="projectBackground" label={t('browse.access.project.background')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem name="projectObjective" label={t('browse.access.project.objective')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem name="projectHypotheses" label={t('browse.access.project.hypotheses')} required />
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem name="projectOutcome" label={t('browse.access.project.outcome')} required />
        </BaseCol>

        <BaseCol span={24}>
          <TagInputItem
            name="projectMembers"
            tags={members}
            onTagsChange={handleTagsChange}
            label={t('browse.access.project.members')}
            prompt={t('browse.access.project.addMembers')}
          />
        </BaseCol>
      </BaseRow>
    </BaseForm>
  );
};
