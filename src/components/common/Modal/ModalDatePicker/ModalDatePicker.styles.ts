import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { DatePicker } from 'antd';

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

export const DateWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const Picker = styled(DatePicker)`
  width: 100%;
`;

export const HorizontalLine = styled.div`
  width: 3rem;
  height: 2px;
  background: var(--grey2);
  margin: 3rem 2rem;
`;
