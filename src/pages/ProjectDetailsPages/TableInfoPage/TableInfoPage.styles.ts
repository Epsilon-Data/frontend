import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { Typography } from 'antd';

const { Paragraph } = Typography;

export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;

  .ant-tabs {
    margin-top: 1rem;
  }

  .ant-tabs-tab-btn {
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.medium};
  }
`;

export const Button = styled(BaseButton)`
  width: 100%;
  background: var(--aquamarine);
  border-color: var(--aquamarine);
  color: var(--black);

  &:focus {
    background: var(--aquamarine);
    border-color: var(--aquamarine);
    color: var(--black);
  }
`;
export const InfoArea = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--text-main-color);
  padding-bottom: 2rem;

  @media only screen and ${media.xxl} {
    font-size: 1rem;
  }
`;

export const Header = styled(Paragraph)`
  font-size: ${FONT_SIZE.md};
  margin-bottom: 0.5rem;
`;

export const Content = styled(Paragraph)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
`;
