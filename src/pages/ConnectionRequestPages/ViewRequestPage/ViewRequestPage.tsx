import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './ViewRequestPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { RequestDetails } from '@app/interfaces/interfaces';
import { getRequestDetails, reviseRequest } from '@app/api/connectionRequests.api';
import { useMounted } from '@app/hooks/useMounted';
import { InfoItem } from '@app/components/view-request/InfoItem';
import { InfoSectionHeader } from '@app/components/view-request/InfoSectionHeader';
import { RequestStatus } from '@app/constants/enums/requestStatus';
import { format } from 'date-fns';
import { DATE_FORMAT, INITIAL_REQUEST_VALUES } from '@app/constants/connectionRequest';
import { StringTextAreaItem } from '@app/components/request-fields/StringInput/StringTextAreaItem';
import { notificationController } from '@app/controllers/notificationController';
import { useAppSelector } from '@app/hooks/reduxHooks';

const ViewRequestPage: React.FC = () => {
  const initialRequestFormValues = INITIAL_REQUEST_VALUES;
  const { id } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestDetails>(initialRequestFormValues);
  const [revisionDefined, setRevisionDefined] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [form] = S.AddInfoForm.useForm();
  const admin = useAppSelector((state) => state.user.user?.roles.includes('admin') || false);
  const [revisionInfo, setRevisionInfo] = useState('');

  const fetch = useCallback(
    (id: string | undefined) => {
      getRequestDetails(id).then((res) => {
        if (isMounted.current) {
          setRequest(res);
          form.setFieldsValue({ info: res.revisionInfo });
          if (res.revisionInfo) {
            setRevisionInfo(res.revisionInfo);
          }
        }
      });
    },
    [isMounted, form],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

  const onFinish = (values: { info: string }) => {
    reviseRequest({ requestId: id, revisionInfo: values.info })
      .then(() => {
        notificationController.success({
          message: t('connectionRequests.revision.successNotify'),
        });
        setRevisionInfo(values.info);
      })
      .catch(() => {
        notificationController.error({
          message: t('connectionRequests.revision.failNotify'),
        });
      });
    setSubmitLoading(false);
  };

  const actionButtons = (status: number | undefined) => {
    const handleBackClick = () => {
      navigate(-1);
    };

    if (!admin) {
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
              onClick={() => navigate(`/connection-requests/edit/${id}/project-info`)}
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
    } else {
      switch (status) {
        case RequestStatus.APPROVED:
          return React.Children.toArray([
            <S.ActionButton type="default" key="back" onClick={handleBackClick}>
              {t('common.back')}
            </S.ActionButton>,
          ]);
        default:
          return React.Children.toArray([
            <S.ActionButton type="primary" key="proceed" onClick={() => navigate(`/connection-requests/approve/${id}`)}>
              {t('connectionRequests.proceed')}
            </S.ActionButton>,
          ]);
      }
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
                </>
              )}
              {request.orgAdminEmail && !admin && (
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

              {request.orgAdminEmail && (
                <>
                  <InfoSectionHeader text={t('connectionRequests.details.addInfo.title')} />
                  <InfoItem text={request.additionalInfo} />
                </>
              )}
            </S.InfoArea>
            {request.status == RequestStatus.REVISION && (
              <S.RevisionCard>
                <S.RevisionHeader>{t('connectionRequests.details.revisionInfo.title')}</S.RevisionHeader>
                <S.RevisionContent>{revisionInfo}</S.RevisionContent>
              </S.RevisionCard>
            )}
            {admin && request.status != RequestStatus.APPROVED && (
              <S.AddInfoForm form={form} onFinish={onFinish}>
                <div style={{ marginBottom: '1rem' }}>
                  <S.Instructions>{t('connectionRequests.revision.instruction')}</S.Instructions>
                </div>
                <StringTextAreaItem
                  name="info"
                  placeholder={t('connectionRequests.revision.placeholder')}
                  onChange={(e) => setRevisionDefined(e.target.value.length > 0)}
                />
                <S.AddInfoForm.Item style={{ marginTop: '1rem' }}>
                  <S.AddInfoButton type="default" htmlType="submit" disabled={!revisionDefined} loading={submitLoading}>
                    {t('connectionRequests.revision.title')}
                  </S.AddInfoButton>
                </S.AddInfoForm.Item>
              </S.AddInfoForm>
            )}
          </S.InfoWrapper>
        </S.Card>
      </S.ViewWrapper>
    </>
  );
};

export default ViewRequestPage;
