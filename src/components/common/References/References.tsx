import React from 'react';
import * as S from './References.styles';

export const References: React.FC = () => {
  return (
    <S.ReferencesWrapper>
      <S.Text>Made by Action Lab v {APP_VERSION}</S.Text>
    </S.ReferencesWrapper>
  );
};
