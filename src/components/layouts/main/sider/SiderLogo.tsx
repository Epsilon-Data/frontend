import React from 'react';
import * as S from './MainSider/MainSider.styles';
import { Link } from 'react-router-dom';

interface SiderLogoProps {
  title: string;
  url: string;
}
export const SiderLogo: React.FC<SiderLogoProps> = ({ title, url }) => {
  return (
    <S.SiderTitleDiv>
      <Link to={url}>
        <S.TitleSpan>{title}</S.TitleSpan>
      </Link>
    </S.SiderTitleDiv>
  );
};
