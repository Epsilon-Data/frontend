import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './EditRequestPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { EditNav } from './EditNav/EditNav';
import { RequestDetails } from '@app/interfaces/interfaces';
import { getRequestDetails, editRequest } from '@app/api/connectionRequests.api';
import { useMounted } from '@app/hooks/useMounted';
import { INITIAL_REQUEST_VALUES } from '@app/constants/connectionRequest';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { EditFormNav } from './EditFormNav/EditFormNav';
import { notificationController } from '@app/controllers/notificationController';

const EditRequestPage: React.FC = () => {
  const initialRequestFormValues = INITIAL_REQUEST_VALUES;
  const { id, page } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestDetails>(initialRequestFormValues);
  const [isLoading, setLoading] = useState(false);
  const [isOwnData, setIsOwnData] = useState(false);

  const fetch = useCallback(
    (id: string | undefined) => {
      setLoading(true);
      getRequestDetails(id).then((res) => {
        if (isMounted.current) {
          if (id) {
            res.id = id;
            setRequest(res);
            if ('orgAdminEmail' in res) {
              setIsOwnData(false);
            } else {
              setIsOwnData(true);
            }
          }
        }
        setLoading(false);
      });
    },
    [setRequest, isMounted],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

  const handleUpdate = () => {
    editRequest(request)
      .then(() => {
        notificationController.success({
          message: t('connectionRequests.edit.successNotify'),
        });
      })
      .catch(() => {
        notificationController.error({
          message: t('connectionRequests.edit.failNotify'),
        });
      });
  };

  return (
    <>
      <PageTitle>{t('connectionRequests.edit.title')}</PageTitle>
      <S.CardWrapper>
        <BaseRow gutter={[30, 30]}>
          <BaseCol xs={7} md={7} xl={7}>
            <S.NavCard
              id="edit-request"
              title={t('connectionRequests.edit.title', { id: id })}
              padding="1.25rem 1.25rem 2rem"
            >
              <EditNav ownData={isOwnData} />
            </S.NavCard>
          </BaseCol>

          <BaseCol xs={17} md={17} xl={17}>
            <S.FormCard loading={isLoading}>
              <EditFormNav menu={page || ''} values={request} setValues={setRequest} />
            </S.FormCard>
          </BaseCol>
        </BaseRow>
        <BaseRow>
          <S.ButtonsWrapper>
            <S.UpdateButton type="primary" key="edit" onClick={() => handleUpdate()}>
              {t('connectionRequests.edit.update')}
            </S.UpdateButton>
            <S.CancelButton type="default" key="back" onClick={() => navigate('/connection-requests')}>
              {t('common.cancel')}
            </S.CancelButton>
          </S.ButtonsWrapper>
        </BaseRow>
      </S.CardWrapper>
    </>
  );
};

export default EditRequestPage;
