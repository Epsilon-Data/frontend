import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './MetadataPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ClusterOutlined, TableOutlined } from '@ant-design/icons';
import { useMounted } from '@app/hooks/useMounted';
import { getProjectName } from '@app/api/databaseSources.api';

const MetadataPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMounted } = useMounted();
  const [projectName, setProjectName] = useState('');
  const fetch = useCallback(() => {
    getProjectName(id).then((res) => {
      if (isMounted.current) {
        setProjectName(res);
      }
    });
  }, [id, isMounted]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <>
      <PageTitle>{t('databaseSources.metadata.projectTitle', { name: projectName })}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="metadata"
          title={t('databaseSources.metadata.projectTitle', { name: projectName })}
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
