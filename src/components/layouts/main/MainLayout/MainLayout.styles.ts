import styled from 'styled-components';
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { BaseLayout } from '@app/components/common/BaseLayout/BaseLayout';
import { Layout, Menu } from 'antd';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { Link } from 'react-router-dom';

export const LayoutMaster = styled(BaseLayout)`
  height: 100vh;
  width: 100vw;

  .ant-layout-has-sider {
    margin-top: 3rem;
  }
`;

export const LayoutMain = styled(BaseLayout)`
  margin-top: 2rem;
  @media only screen and ${media.md} {
    margin-left: 80px;
  }

  @media only screen and ${media.xl} {
    margin-left: unset;
  }
`;

export const TopNav = styled(Menu)`
  position: fixed;
  width: 100vw;
  height: 3rem;
`;

export const Header = styled(Layout)`
  width: 100vw;
  height: 3.5rem;
  position: fixed;
  padding: 0.3rem 2rem;
  background: var(--header-color);
  display: flex;
  justify-content: flex-start;
  font-size: ${FONT_SIZE.xxxl};
  font-weight: ${FONT_WEIGHT.semibold};
  font-family: ${FONT_FAMILY.main};
  font-color: var(--white);
`;

export const LogoutBtn = styled(BaseButton)`
  background: var(--info-color);
  color: var(--white);
  border: 0;
  position: absolute;
  top: 0.5rem;
  height: 2rem;
  right: 1rem;

  &:hover {
    background: var(--lightgrey);
    border: 0;
  }
`;

export const LayoutWrapper = styled(Layout)`
  overflow-y: hidden;
`;

export const Username = styled(Link)`
  color: var(--text-main-color);
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.medium};
  position: absolute;
  top: 0.3rem;
  right: 9rem;
`;

export const HeaderLink = styled(Link)`
  color: var(--white);

  &:hover {
    color: var(--white);
  }
`;
