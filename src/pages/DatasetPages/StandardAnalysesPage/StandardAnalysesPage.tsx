import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './StandardAnalysesPage.styles';
import { useParams } from 'react-router-dom';
import { Descriptive } from './Descriptive/Descriptive';
import { getAnalysisColumns } from '@app/api/datasets.api';
import { CaretRightOutlined } from '@ant-design/icons';
import Markdown from 'react-markdown';
import { GUIDE_CONTENT } from '@app/constants/datasets';

const StandardAnalysesPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lookupTable, setLookupTable] = useState<any[]>([]);

  const fetch = useCallback(() => {
    getAnalysisColumns(id).then((res) => {
      setLookupTable(res);
    });
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: 'var(--sider-bg)',
    borderRadius: '1rem',
    border: 'none',
  };

  return (
    <>
      <PageTitle>{t('dataset.standard.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card id="metadata" title={t('dataset.standard.title')} padding="1.25rem 1.25rem 0">
          <S.Guide
            bordered={false}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} rev={undefined} />}
            items={[
              {
                key: '1',
                label: t('dataset.standard.descriptive.guide'),
                children: <Markdown>{GUIDE_CONTENT}</Markdown>,
                style: panelStyle,
              },
            ]}
          />
          <Descriptive lookup={lookupTable} />
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default StandardAnalysesPage;
