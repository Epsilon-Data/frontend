import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './TestConnectionGroup.styles';

export const TestConnectionGroup: React.FC<{
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
  message: string;
}> = ({ onClick, message }) => {
  const { t } = useTranslation();
  return (
    <>
      <S.ConnectionButton type="primary" onClick={onClick}>
        {t('connectionRequests.create.databaseInfo.testConnection')}
      </S.ConnectionButton>
      <S.ButtonTip>{t('connectionRequests.create.databaseInfo.testConnectionTip')}</S.ButtonTip>
      <S.TestMessage>{message}</S.TestMessage>
    </>
  );
};
