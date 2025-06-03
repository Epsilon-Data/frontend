import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { media } from '@app/styles/themes/constants';
import { LAYOUT } from '@app/styles/themes/constants';
import { BaseLayout } from '@app/components/common/BaseLayout/BaseLayout';

export const Sider = styled(BaseLayout.Sider)`
  right: 0;
  overflow: hidden;
  height: 100%;
  box-shadow: inset 4px 0 10px rgba(0, 0, 0, 0.8);

  @media only screen and ${media.md} {
    right: unset;
    left: 0;
  }

  @media only screen and ${media.xl} {
    position: unset;
  }
`;

export const SiderContent = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
`;

export const SiderTitleLink = styled(Link)`
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

export const SiderTitleDiv = styled.div`
  height: ${LAYOUT.mobile.headerHeight};
  padding: ${LAYOUT.mobile.headerPadding};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media only screen and ${media.md} {
    height: ${LAYOUT.desktop.headerHeight};
    padding-top: ${LAYOUT.desktop.paddingVertical};
    padding-bottom: ${LAYOUT.desktop.paddingVertical};
  }
`;

export const TitleSpan = styled.span`
  margin: 0 1rem;
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--white);
`;

export const HorizontalDivider = styled.hr`
  height: 2px;
  margin-left: 20px;
  margin-right: 20px;
`;
