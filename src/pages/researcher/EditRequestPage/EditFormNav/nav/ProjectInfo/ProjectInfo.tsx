import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { RequestDetails } from '@app/interfaces/interfaces';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ProjectInfoFormValues } from '@app/interfaces/interfaces';
import { StringInputItem } from '@app/components/request-fields/StringInput/StringInputItem';
import { StringTextAreaItem } from '@app/components/request-fields/StringInput/StringTextAreaItem';
import { DateRangeInputItem } from '@app/components/request-fields/DateRangeInput/DateRangeInputItem';
import { TagInputItem } from '@app/components/request-fields/TagInput/TagInputItem';

const initialPersonalInfoValues: ProjectInfoFormValues = {
  name: '',
  duration: [],
  lead: '',
  members: [],
  university: '',
  faculty: '',
  ethicsId: '',
  description: '',
};

export const ProjectInfo: React.FC<{ formValue: RequestDetails }> = ({ formValue }) => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const projectFormValues = useMemo(
    () =>
      formValue
        ? {
            name: formValue.projectInfo.name,
            duration: formValue.projectInfo.duration,
            lead: formValue.projectInfo.lead,
            members: formValue.projectInfo.members,
            university: formValue.projectInfo.university,
            faculty: formValue.projectInfo.faculty,
            ethicsId: formValue.projectInfo.ethicsId,
            description: formValue.projectInfo.description,
          }
        : initialPersonalInfoValues,
    [formValue],
  );

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback((values: RequestDetails) => {
    setLoading(true);
    console.log(values);
    setTimeout(() => {
      setLoading(false);
      setFieldsChanged(false);
    }, 1000);
  }, []);

  return (
    <BaseCard>
      <BaseButtonsForm
        form={form}
        name="info"
        loading={isLoading}
        initialValues={projectFormValues}
        isFieldsChanged={isFieldsChanged}
        setFieldsChanged={setFieldsChanged}
        onFieldsChange={() => setFieldsChanged(true)}
        onFinish={onFinish}
      >
        <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('profile.nav.personalInfo.title')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol span={24} md={12}>
            <StringInputItem
              name="projectInfo.name"
              label={t('connectionRequests.details.projectInfo.name')}
              required
            />
          </BaseCol>

          <BaseCol span={24} md={12}>
            <DateRangeInputItem
              name="projectInfo.duration"
              label={t('connectionRequests.details.projectInfo.duration')}
              required
            />
          </BaseCol>

          <BaseCol span={24} md={12}>
            <StringInputItem
              name="projectInfo.lead"
              label={t('connectionRequests.details.projectInfo.lead')}
              required
            />
          </BaseCol>

          <BaseCol span={24} md={12}>
            <TagInputItem
              name="projectInfo.members"
              label={t('connectionRequests.details.projectInfo.teamMembers')}
              initialTags={formValue.projectInfo.members}
              prompt={t('connectionRequests.details.projectInfo.addTeamMembers')}
            />
          </BaseCol>

          <BaseCol span={24} md={12}>
            <StringInputItem
              name="projectInfo.university"
              label={t('connectionRequests.details.projectInfo.university')}
              required
            />
          </BaseCol>

          <BaseCol span={24} md={12}>
            <StringInputItem
              name="projectInfo.faculty"
              label={t('connectionRequests.details.projectInfo.faculty')}
              required
            />
          </BaseCol>

          <BaseCol span={24}>
            <StringInputItem
              name="projectInfo.ethicsId"
              label={t('connectionRequests.details.projectInfo.ethicsId')}
              required
            />
          </BaseCol>

          <BaseCol span={24} md={12}>
            <StringTextAreaItem
              name="projectInfo.description"
              label={t('connectionRequests.details.projectInfo.description')}
            />
          </BaseCol>
        </BaseRow>
      </BaseButtonsForm>
    </BaseCard>
  );
};
