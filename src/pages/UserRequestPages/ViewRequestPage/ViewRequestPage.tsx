import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './ViewRequestPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessDetails } from '@app/interfaces/interfaces';
import { getRequestDetails, reviseRequest } from '@app/api/userRequests.api';
import { useMounted } from '@app/hooks/useMounted';
import { InfoItem } from '@app/components/display-info/InfoItem';
import { InfoSectionHeader } from '@app/components/display-info/InfoSectionHeader';
import { RequestStatus } from '@app/constants/enums/requestStatus';
import { format } from 'date-fns';
import { DATE_FORMAT, INITIAL_REQUEST_VALUES } from '@app/constants/userRequest';
import { StringTextAreaItem } from '@app/components/request-fields/StringInput/StringTextAreaItem';
import { notificationController } from '@app/controllers/notificationController';

const ViewRequestPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const navigate = useNavigate();
  const [request, setRequest] = useState<AccessDetails>(INITIAL_REQUEST_VALUES);
  const [revisionDefined, setRevisionDefined] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [form] = S.AddInfoForm.useForm();
  const [revisionInfo, setRevisionInfo] = useState(t('connectionRequests.details.revisionInfo.default'));

  const fetch = useCallback(
    (id: string | undefined) => {
      getRequestDetails(id).then((res) => {
        if (isMounted.current) {
          setRequest(res);
        }
      });
    },
    [isMounted],
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

    switch (status) {
      case RequestStatus.APPROVED:
        return React.Children.toArray([
          <S.ActionButton type="default" key="back" onClick={handleBackClick}>
            {t('common.back')}
          </S.ActionButton>,
        ]);
      default:
        return React.Children.toArray([
          <S.ActionButton type="primary" key="proceed">
            {t('connectionRequests.proceed')}
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
          title={t('connectionRequests.view')}
          padding="1.25rem 1.25rem 0"
          actions={actionButtons(request.status)}
        >
          <S.InfoWrapper>
            <S.InfoArea>
              <InfoSectionHeader text={t('connectionRequests.details.requestDatasetInfo.title')} />
              <InfoItem label={t('connectionRequests.requestingProject')} text={request.name} />
              <InfoItem label={t('browse.access.dataset.accessPurpose')} text={request.accessPurpose} />
              <InfoSectionHeader text={t('connectionRequests.details.requestorInfo.title')} />
              <InfoItem label={t('browse.access.requestor.name')} text={request.requestorName} />
              <InfoItem label={t('browse.access.requestor.email')} text={request.email} />
              <InfoItem label={t('browse.access.requestor.orgName')} text={request.orgName} />
              <InfoItem label={t('browse.access.requestor.position')} text={request.position} />
              <InfoSectionHeader text={t('connectionRequests.details.projectInfo.title')} />
              <InfoItem label={t('browse.access.project.name')} text={request.projectName} />
              {request.projectDuration.length > 0 && (
                <InfoItem
                  label={t('browse.access.project.duration')}
                  text={`${format(request.projectDuration[0], DATE_FORMAT)} - ${format(
                    request.projectDuration[1],
                    DATE_FORMAT,
                  )}`}
                />
              )}
              <InfoItem label={t('browse.access.project.background')} text={request.projectBackground} />
              <InfoItem label={t('browse.access.project.objective')} text={request.projectObjective} />
              <InfoItem label={t('browse.access.project.hypotheses')} text={request.projectHypotheses} />
              <InfoItem label={t('browse.access.project.outcome')} text={request.projectOutcome} />
              <InfoItem label={t('browse.access.project.members')} text={request.projectMembers.join(', ')} />
              <InfoSectionHeader text={t('browse.access.ethics.title')} />
              <InfoItem label={t('browse.access.ethics.id')} text={request.ethicsId} />
            </S.InfoArea>
            {request.status == RequestStatus.REVISION && (
              <S.RevisionCard>
                <S.RevisionHeader>{t('connectionRequests.details.revisionInfo.title')}</S.RevisionHeader>
                <S.RevisionContent>{revisionInfo}</S.RevisionContent>
              </S.RevisionCard>
            )}
            <S.AddInfoForm hidden={request.status == RequestStatus.APPROVED} form={form} onFinish={onFinish}>
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
          </S.InfoWrapper>
        </S.Card>
      </S.ViewWrapper>
    </>
  );
};

export default ViewRequestPage;
