import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './CreateRequestPage.styles';
import { useParams } from 'react-router-dom';
import { RequestDetails } from '@app/interfaces/interfaces';
import { RequestProjectInfo } from '../../components/create-request/RequestProjectInfo';
import { RequestDatabaseInfo } from '@app/components/create-request/RequestDatabaseInfo';
import { RequestOrgAdminInfo } from '@app/components/create-request/RequestOrgAdminInfo';

const initialRequestFormValues: RequestDetails = {
  projectName: '',
  projectDuration: [],
  projectLead: '',
  projectTeamMembers: [],
  university: '',
  faculty: '',
  ethicsApprovalId: '',
  projectDescription: '',
  isOwnData: null,
  dataInfo: {
    collectionDuration: [],
    participantsNumber: null,
    description: '',
    keywords: [],
  },
};

const CreateRequestPage: React.FC = () => {
  const { page } = useParams();
  const { t } = useTranslation();
  const [request, setRequest] = useState<RequestDetails>(initialRequestFormValues);

  return (
    <>
      <PageTitle>{t('connectionRequests.create')}</PageTitle>
      <S.FormWrapper>
        <S.Card id="create-request" title={t('connectionRequests.create')} padding="1.25rem 1.25rem 0">
          {page === 'project-info' && <RequestProjectInfo formValue={request} setFormValue={setRequest} />}
          {page === 'database-info' && <RequestDatabaseInfo formValue={request} setFormValue={setRequest} />}
          {page === 'org-admin-info' && <RequestOrgAdminInfo formValue={request} setFormValue={setRequest} />}
        </S.Card>
      </S.FormWrapper>
    </>
  );
};

export default CreateRequestPage;
