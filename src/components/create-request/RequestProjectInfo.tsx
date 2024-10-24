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
import { isValidProjectId } from '@app/api/connectionRequests.api';
import config from '@app/config/config';
import { useAppSelector } from '@app/hooks/reduxHooks';

export const RequestProjectInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initialValues: any = {
    customId: formValue.projectInfo.customId,
    name: formValue.projectInfo.name || `${config.isDev ? 'Test Project' : ''}`,
    duration: formValue.projectInfo.duration.map((date: Date) => dayjs(date)),
    lead: formValue.projectInfo.lead || `${config.isDev ? 'Test Leader' : ''}`,
    members: formValue.projectInfo.members,
    university: formValue.projectInfo.university || `${config.isDev ? 'Test University' : ''}`,
    faculty: formValue.projectInfo.faculty || `${config.isDev ? 'Test Faculty' : ''}`,
    ethicsId: formValue.projectInfo.ethicsId || `${config.isDev ? 'test123' : ''}`,
    description: formValue.projectInfo.description || `${config.isDev ? 'Some test description.' : ''}`,
    isOwnData: formValue.projectInfo.isOwnData,
  };
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [members, setMembers] = useState(initialValues.members);
  const user = useAppSelector((state) => state.user.user);

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (values: any) => {
      setLoading(true);
      values.duration = values.duration.map((appDate: AppDate) => dayjs(appDate).toDate());
      values.members = members;
      const validId = await isValidProjectId(user?.id, values.customId);

      if (validId) {
        const updatedRequest = {
          ...formValue,
          projectInfo: values,
        };
        setFormValue(updatedRequest);
        setFieldsChanged(false);
        if (values.isOwnData) {
          navigate('/requests/database/create/database-info');
        } else {
          navigate('/requests/database/create/org-admin-info');
        }
      } else {
        form.setFields([{ name: 'id', errors: [t('connectionRequests.details.projectInfo.invalidId')] }]);
        form.scrollToField('id');
        setFieldsChanged(false);
        setLoading(false);
      }
    },
    [form, formValue, members, navigate, setFormValue, t, user?.id],
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
          <StringInputItem name="customId" label={t('connectionRequests.details.projectInfo.id')} required />
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
