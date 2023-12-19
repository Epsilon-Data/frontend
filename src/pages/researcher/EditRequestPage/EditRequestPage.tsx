import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './EditRequestPage.styles';
import { useParams } from 'react-router-dom';

// const initialRequestFormValues: RequestDetails = {
//   projectName: '',
//   projectDuration: [],
//   projectLead: '',
//   projectTeamMembers: [],
//   university: '',
//   faculty: '',
//   ethicsApprovalId: '',
//   projectDescription: '',
//   isOwnData: null,
//   dataInfo: {
//     collectionDuration: [],
//     participantsNumber: null,
//     description: '',
//     keywords: [],
//   },
// };

const EditRequestPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  // const [request, setRequest] = useState<RequestDetails>(initialRequestFormValues);

  return (
    <>
      <PageTitle>{t('connectionRequests.edit')}</PageTitle>
      <S.FormWrapper>
        <S.Card
          id="edit-request"
          title={`${t('connectionRequests.edit')} ID ${id}`}
          padding="1.25rem 1.25rem 0"
        ></S.Card>
      </S.FormWrapper>
    </>
  );
};

export default EditRequestPage;
