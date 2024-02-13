import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './ViewRequestPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { RequestDetails } from '@app/interfaces/interfaces';
import { getRequestDetails } from '@app/api/connectionRequests.api';
import { useMounted } from '@app/hooks/useMounted';
import { InfoItem } from '@app/components/view-request/InfoItem';
import { InfoSectionHeader } from '@app/components/view-request/InfoSectionHeader';
import { RequestStatus } from '@app/constants/enums/requestStatus';
import { format } from 'date-fns';
import { DATE_FORMAT, INITIAL_REQUEST_VALUES } from '@app/constants/connectionRequest';

const ViewRequestPage: React.FC = () => {
  const initialRequestFormValues = INITIAL_REQUEST_VALUES;
  const { id } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestDetails>(initialRequestFormValues);

  const fetch = useCallback(
    (id: string | undefined) => {
      getRequestDetails(id).then((res) => {
        if (isMounted.current) {
          setRequest(res);
        }
      });
    },
    [setRequest, isMounted],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

  const actionButtons = (status: number | undefined) => {
    const handleBackClick = () => {
      navigate(-1);
    };

    switch (status) {
      case RequestStatus.PENDING:
        return React.Children.toArray([
          <S.ActionButton type="default" key="back" onClick={handleBackClick}>
            {t('common.back')}
          </S.ActionButton>,
        ]);
      case RequestStatus.REVISION:
        return React.Children.toArray([
          <S.ActionButton
            type="primary"
            key="edit"
            onClick={() => navigate(`/r-connection-requests/edit/${id}/project-info`)}
          >
            {t('common.edit')}
          </S.ActionButton>,
          <S.ActionButton type="default" key="back" onClick={handleBackClick}>
            {t('common.back')}
          </S.ActionButton>,
        ]);
      case RequestStatus.APPROVED:
        return React.Children.toArray([
          <S.ActionButton type="primary" key="source" onClick={() => navigate('/database-sources/metadata/' + id)}>
            {t('connectionRequests.viewSource')}
          </S.ActionButton>,
          <S.ActionButton type="default" key="back" onClick={handleBackClick}>
            {t('common.back')}
          </S.ActionButton>,
        ]);
    }
  };

  return (
    <>
      <PageTitle>{t('connectionRequests.view')}</PageTitle>
      <S.ViewWrapper>
        <S.Card
          id="view-request"
          title={t('connectionRequests.view', { id: id })}
          padding="1.25rem 1.25rem 0"
          actions={actionButtons(request.status)}
        >
          <S.InfoWrapper>
            <S.InfoHeader>
              <S.Title>{request.projectInfo.name}</S.Title>
            </S.InfoHeader>
            <S.InfoArea>
              <InfoSectionHeader text={t('connectionRequests.details.projectInfo.title')} />
              {request.projectInfo.duration.length > 0 && (
                <InfoItem
                  label={t('connectionRequests.details.projectInfo.duration')}
                  text={`${format(request.projectInfo.duration[0], DATE_FORMAT)} - ${format(
                    request.projectInfo.duration[1],
                    DATE_FORMAT,
                  )}`}
                />
              )}
              <InfoItem label={t('connectionRequests.details.projectInfo.lead')} text={request.projectInfo.lead} />
              <InfoItem
                label={t('connectionRequests.details.projectInfo.teamMembers')}
                text={request.projectInfo.members.join(', ')}
              />
              <InfoItem
                label={t('connectionRequests.details.projectInfo.university')}
                text={request.projectInfo.university}
              />
              <InfoItem
                label={t('connectionRequests.details.projectInfo.faculty')}
                text={request.projectInfo.faculty}
              />
              <InfoItem
                label={t('connectionRequests.details.projectInfo.ethicsId')}
                text={request.projectInfo.ethicsId}
              />
              <InfoItem
                label={t('connectionRequests.details.projectInfo.description')}
                text={request.projectInfo.description}
              />
              {request.databaseInfo && (
                <>
                  <InfoSectionHeader text={t('connectionRequests.details.databaseInfo.title')} />
                  <InfoItem
                    label={t('connectionRequests.details.databaseInfo.name')}
                    text={request.databaseInfo.name}
                  />
                  <InfoItem
                    label={t('connectionRequests.details.databaseInfo.type')}
                    text={request.databaseInfo.type}
                  />
                </>
              )}
              {request.orgAdminEmail && (
                <>
                  <InfoSectionHeader text={t('connectionRequests.details.orgAdminInfo.title')} />
                  <InfoItem label={t('connectionRequests.details.orgAdminInfo.email')} text={request.orgAdminEmail} />
                </>
              )}
              <InfoSectionHeader text={t('connectionRequests.details.dataInfo.title')} />
              {request.dataInfo.collectionDuration.length > 0 && (
                <InfoItem
                  label={t('connectionRequests.details.dataInfo.collectionDuration')}
                  text={`${format(request.dataInfo.collectionDuration[0], DATE_FORMAT)} - ${format(
                    request.dataInfo.collectionDuration[1],
                    DATE_FORMAT,
                  )}`}
                />
              )}
              <InfoItem
                label={t('connectionRequests.details.dataInfo.participantsNumber')}
                text={request.dataInfo.participantsNumber?.toString()}
              />
              <InfoItem
                label={t('connectionRequests.details.dataInfo.description')}
                text={request.dataInfo.description}
              />
              <InfoItem
                label={t('connectionRequests.details.dataInfo.keywords')}
                text={request.dataInfo.keywords?.join(', ')}
              />
            </S.InfoArea>
          </S.InfoWrapper>
        </S.Card>
      </S.ViewWrapper>
    </>
  );
};

export default ViewRequestPage;
