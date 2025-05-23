import { FONT_FAMILY, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Select } from 'antd';
import styled from 'styled-components';

export const InputTitle = styled.div`
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.main};
  color: var(--blue-dark);
`;

export const InputDescription = styled.div`
  font-weight: ${FONT_WEIGHT.light};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--black);
`;

export const Selection = styled(Select)`
  .ant-select-arrow {
    color: var(--black);
    margin-top: 0.2rem;
    margin-right: 0.2rem;
  }
`;
