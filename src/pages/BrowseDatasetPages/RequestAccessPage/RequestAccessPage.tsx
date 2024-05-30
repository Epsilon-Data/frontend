import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './RequestAccessPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { useMounted } from '@app/hooks/useMounted';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { RequestNav } from './RequestNav/RequestNav';
import { RequestFormNav } from './RequestFormNav/RequestFormNav';
import { notificationController } from '@app/controllers/notificationController';
import { AccessDetails } from '@app/interfaces/interfaces';
import { getProjectSummary, requestAccess } from '@app/api/browseDatasets.api';
import { INITIAL_ACCESS_VALUES } from '@app/constants/browseDatasets';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { editRequest, getRequestDetails } from '@app/api/userRequests.api';

const RequestAccessPage: React.FC<{ mode: string }> = ({ mode }) => {
  const { id, page } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMounted } = useMounted();
  const [isLoading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const [details, setDetails] = useState<AccessDetails>(INITIAL_ACCESS_VALUES);

  const fetch = useCallback(
    (id: string | undefined) => {
      setLoading(true);
      if (mode == 'create') {
        getProjectSummary(id).then((res) => {
          if (isMounted.current) {
            if (id) {
              setDetails({
                ...INITIAL_ACCESS_VALUES,
                requestor: user?.id ?? '',
                id: id,
                customId: res.id,
                name: res.name,
              });
            }
          }
        });
      } else {
        getRequestDetails(id).then((res) => {
          if (isMounted.current) {
            if (id) {
              setDetails({
                ...res,
                id: id,
                requestor: user?.id ?? '',
              });
            }
          }
        });
      }
      setLoading(false);
    },
    [isMounted, user?.id, mode],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

  const handleAccess = () => {
    if (mode == 'create') {
      requestAccess(details)
        .then(() => {
          notificationController.success({
            message: t('browse.access.submitSuccess'),
          });
          navigate(`/browse/summary/${id}`);
        })
        .catch(() => {
          notificationController.error({
            message: t('browse.access.submitFail'),
          });
        });
    } else {
      editRequest(details)
        .then(() => {
          notificationController.success({
            message: t('connectionRequests.edit.successNotify'),
          });
          navigate('/requests');
        })
        .catch(() => {
          notificationController.error({
            message: t('connectionRequests.edit.failNotify'),
          });
        });
    }
  };

  return (
    <>
      <PageTitle>{t('browse.access.title')}</PageTitle>
      <S.CardWrapper>
        <BaseRow gutter={[30, 30]}>
          <BaseCol xs={7} md={7} xl={7}>
            <S.NavCard id="request-access" title={t('browse.access.title')} padding="1.25rem 1.25rem 2rem">
              <RequestNav mode={mode} />
            </S.NavCard>
          </BaseCol>

          {details.name && (
            <BaseCol xs={17} md={17} xl={17}>
              <S.FormCard loading={isLoading}>
                <RequestFormNav menu={page || ''} values={details} setValues={setDetails} />
              </S.FormCard>
            </BaseCol>
          )}
        </BaseRow>
        <BaseRow>
          <S.ButtonsWrapper>
            <S.RequestAccessButton type="primary" key="edit" onClick={() => handleAccess()}>
              {mode == 'create' ? t('browse.access.submit') : t('connectionRequests.edit.update')}
            </S.RequestAccessButton>
            <S.CancelButton type="default" key="back" onClick={() => navigate(`/browse/summary/${id}`)}>
              {t('common.cancel')}
            </S.CancelButton>
          </S.ButtonsWrapper>
        </BaseRow>
      </S.CardWrapper>
    </>
  );
};

export default RequestAccessPage;
