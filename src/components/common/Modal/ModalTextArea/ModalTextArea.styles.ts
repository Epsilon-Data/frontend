import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const InputTitle = styled.div`
  font-size: ${FONT_SIZE.xl};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.main};
  color: var(--blue-dark);
`;

export const InputDescription = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.light};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--black);
`;
