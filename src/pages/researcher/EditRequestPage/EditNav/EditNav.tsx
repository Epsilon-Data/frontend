import React from 'react';
import { useTranslation } from 'react-i18next';
import { editRequestNavData } from '@app/constants/editRequestNavData';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as S from './EditNav.styles';

export const EditNav: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <S.Wrapper>
      {editRequestNavData.map((item) => (
        <S.Btn
          key={item.id}
          icon={item.icon}
          type="text"
          color={item.color}
          onClick={() => navigate(item.href)}
          $isActive={`/edit/${id}/${item.href}` === location.pathname}
        >
          {t(item.name)}
        </S.Btn>
      ))}
    </S.Wrapper>
  );
};
