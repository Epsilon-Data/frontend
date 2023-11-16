import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './TestConnectionGroup.styles';

export const TestConnectionGroup: React.FC<{
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
  connected: boolean;
  show: boolean;
}> = ({ onClick, connected, show }) => {
  const { t } = useTranslation();
  return (
    <>
      <S.ConnectionButton type="primary" onClick={onClick}>
        {t('connectionRequests.create.databaseInfo.testConnection')}
      </S.ConnectionButton>
      <S.ButtonTip>{t('connectionRequests.create.databaseInfo.testConnectionTip')}</S.ButtonTip>
      {connected ? (
        <S.TestMessage>{t('connectionRequests.create.databaseInfo.testSuccess')}</S.TestMessage>
      ) : show ? (
        <S.TestMessage style={{ color: 'var(--error-color)' }}>
          {t('connectionRequests.create.databaseInfo.testFailed')}
        </S.TestMessage>
      ) : null}
    </>
  );
};
