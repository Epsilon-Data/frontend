import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './MetadataPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ClusterOutlined, TableOutlined } from '@ant-design/icons';

const MetadataPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <PageTitle>{t('databaseSources.metadata.projectTitle', { id: id })}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="metadata"
          title={t('databaseSources.metadata.projectTitle', { id: id })}
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
