/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './MetadataPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ClusterOutlined, TableOutlined } from '@ant-design/icons';
import { useMounted } from '@app/hooks/useMounted';
import { useAppSelector } from '@app/hooks/reduxHooks';

const MetadataPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMounted } = useMounted();
  const [projectId, setProjectId] = useState('');
  const projectDetails = useAppSelector((state: { project: { details: any } }) => state.project.details);
  const fetch = useCallback(() => {
    if (isMounted.current) {
      setProjectId(projectDetails?.customId);
    }
  }, [projectDetails?.customId, isMounted]);

  useEffect(() => {
    fetch();
  }, [id, fetch]);

  return (
    <>
      <PageTitle>{t('databaseSources.metadata.projectTitle', { id: projectId })}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="metadata"
          title={t('databaseSources.metadata.projectTitle', { id: projectId })}
          padding="1.25rem 1.25rem 0"
        >
          <BaseRow gutter={[50, 50]}>
            <BaseCol span={12}>
              <S.Button
                type="primary"
                block
                icon={<ClusterOutlined rev={undefined} />}
                onClick={() => navigate('db-summary')}
              >
                {t('databaseSources.metadata.dbSummary')}
              </S.Button>
            </BaseCol>
            <BaseCol span={12}>
              <S.Button
                type="primary"
                block
                icon={<TableOutlined rev={undefined} />}
                onClick={() => navigate('table-info')}
              >
                {t('databaseSources.metadata.tableInfo.title')}
              </S.Button>
            </BaseCol>
          </BaseRow>
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default MetadataPage;
