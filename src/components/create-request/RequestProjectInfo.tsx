import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ConnectionRequest } from '@app/interfaces/interfaces';
import { StringInputItem } from './StringInput/StringInputItem';
import { StringTextAreaItem } from './StringInput/StringTextAreaItem';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import * as S from './CreateRequest.styles';
import { DayjsDatePicker } from '../common/pickers/DayjsDatePicker';
import { useNavigate } from 'react-router-dom';

const initialRequestFormValues: ConnectionRequest = {
  projectName: '',
  projectStartDate: null,
  projectEndDate: null,
  projectLead: '',
  projectTeamMembers: [],
  university: '',
  faculty: '',
  ethicsApprovalId: '',
  projectDescription: '',
  isOwnData: null,
  dataInfo: {
    collectionStartDate: new Date(),
    collectionEndDate: new Date(),
    participantsNumber: null,
    description: '',
    keywords: [],
  },
};

export const RequestProjectInfo: React.FC = () => {
  const [request, setRequest] = useState<ConnectionRequest>(initialRequestFormValues);
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback(
    (values: ConnectionRequest) => {
      setLoading(true);
      setRequest(values);
      setTimeout(() => {
        setLoading(false);
        setFieldsChanged(false);
        navigate('/r-connection-requests/create');
        console.log(values);
      }, 1000);
    },
    [navigate],
  );

  return (
    <BaseButtonsForm
      form={form}
      name="info"
      loading={isLoading}
      initialValues={initialRequestFormValues}
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

        <BaseCol span={24}>
          <StringInputItem name="projectName" label={t('connectionRequests.create.projectInfo.name')} />
        </BaseCol>

        <BaseCol span={24} style={{ paddingBottom: '1rem' }}>
          <S.InputHeader>{t('connectionRequests.create.projectInfo.duration')}</S.InputHeader>
          <DayjsDatePicker.RangePicker format="L" />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="projectLead" label={t('connectionRequests.create.projectInfo.lead')} />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="projectLead" label={t('connectionRequests.create.projectInfo.teamMembers')} />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="university" label={t('connectionRequests.create.projectInfo.university')} />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem name="faculty" label={t('connectionRequests.create.projectInfo.faculty')} />
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="ethicsApprovalId"
            label={t('connectionRequests.create.projectInfo.ethicsApprovalId')}
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem
            name="projectDescription"
            label={t('connectionRequests.create.projectInfo.description')}
          />
        </BaseCol>

        <BaseCol span={24}>
          <S.Subtitle>{t('connectionRequests.create.projectInfo.isOwnData')}</S.Subtitle>
          <BaseRadio.Group defaultValue="">
            <BaseRadio.Button value={true}>Yes</BaseRadio.Button>
            <BaseRadio.Button value={false}>No</BaseRadio.Button>
          </BaseRadio.Group>
        </BaseCol>
      </BaseRow>
    </BaseButtonsForm>
  );
};
