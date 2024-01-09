import React from 'react';
import { useTranslation } from 'react-i18next';
import { OverallDatabaseInfo } from '@app/interfaces/interfaces';
import * as S from './OverallDescription.styles';
import { Typography } from 'antd';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@app/constants/databaseSource';

export const OverallDescription: React.FC<{ info: OverallDatabaseInfo }> = ({ info }) => {
  const { t } = useTranslation();
  const { Title } = Typography;
  const formattedDate =
    info.dateCreated instanceof Date ? format(new Date(info.dateCreated), DATE_FORMAT) : info.dateCreated;

  return (
    <>
      <Title level={5} style={{ marginBottom: '1rem' }}>
        {t('databaseSources.metadata.overallDesc.title')}
      </Title>
      <S.InfoArea>
        <S.Header>{t('databaseSources.metadata.overallDesc.dateCreated')}</S.Header>
        <S.Content>{formattedDate}</S.Content>
        <S.Header>{t('databaseSources.metadata.overallDesc.schemaCount')}</S.Header>
        <S.Content>{info.schemaCount}</S.Content>
        <S.Header>{t('databaseSources.metadata.overallDesc.tableCount')}</S.Header>
        <S.Content>{info.totalTableCount}</S.Content>
        <S.Header>{t('databaseSources.metadata.overallDesc.viewCount')}</S.Header>
        <S.Content>{info.viewCount}</S.Content>
        <S.Header>{t('databaseSources.metadata.overallDesc.columnCount')}</S.Header>
        <S.Content>{info.totalColCount}</S.Content>
      </S.InfoArea>
    </>
  );
};
