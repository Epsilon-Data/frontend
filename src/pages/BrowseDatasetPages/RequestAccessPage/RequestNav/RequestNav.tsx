import React from 'react';
import { useTranslation } from 'react-i18next';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as S from './RequestNav.styles';
import { requestAccessNavData } from '@app/constants/requestAccessNavData';

export const RequestNav: React.FC<{ mode: string }> = ({ mode }) => {
  const { id } = useParams();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const prefix = mode === 'create' ? '/browse/access' : '/requests/user/edit';

  return (
    <S.Wrapper>
      {requestAccessNavData.map((item) => (
        <S.Button
          key={item.id}
          icon={item.icon}
          type="text"
          color={item.color}
          onClick={() => navigate(`${prefix}/${id}/${item.href}`)}
          $isActive={`${prefix}/${id}/${item.href}` === location.pathname}
        >
          {t(item.name)}
        </S.Button>
      ))}
    </S.Wrapper>
  );
};
