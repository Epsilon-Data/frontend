import React from 'react';
import { useTranslation } from 'react-i18next';
import { editRequestNavData } from '@app/constants/editRequestNavData';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as S from './EditNav.styles';

export const EditNav: React.FC<{ ownData: boolean }> = ({ ownData }) => {
  const { id } = useParams();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const filteredNavData = editRequestNavData.filter(
    (item) => item.id === 1 || item.id === 3 || (ownData ? item.id === 2 : item.id === 4 || item.id === 5),
  );

  return (
    <S.Wrapper>
      {filteredNavData.map((item) => (
        <S.Btn
          key={item.id}
          icon={item.icon}
          type="text"
          color={item.color}
          onClick={() => navigate(`/r-connection-requests/edit/${id}/${item.href}`)}
          $isActive={`/r-connection-requests/edit/${id}/${item.href}` === location.pathname}
        >
          {t(item.name)}
        </S.Btn>
      ))}
    </S.Wrapper>
  );
};
