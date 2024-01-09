import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { styled } from 'styled-components';
import { Typography } from 'antd';

const { Paragraph } = Typography;

export const InfoArea = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--text-main-color);

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
