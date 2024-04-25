import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { styled } from 'styled-components';

export const InfoArea = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--text-main-color);

  @media only screen and ${media.xxl} {
    font-size: 1rem;
  }
`;
