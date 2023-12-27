import React from 'react';
import * as S from './MainSider/MainSider.styles';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { findUrlByKey } from '../topNavigation';

interface SiderLogoProps {
  selectedNav: string;
}
export const SiderLogo: React.FC<SiderLogoProps> = ({ selectedNav }) => {
  const { t } = useTranslation();
  const title = 'topNavigation.' + selectedNav;

  const url = findUrlByKey(selectedNav);

  return (
    <S.SiderTitleDiv>
      <Link to={url}>
        <S.TitleSpan>{t(title)}</S.TitleSpan>
      </Link>
    </S.SiderTitleDiv>
  );
};
