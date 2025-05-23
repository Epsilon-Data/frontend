import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Select } from 'antd';
import styled from 'styled-components';

export const TagSelect = styled(Select)`
  .ant-select-selector {
    height: 2.5rem !important;

    .ant-select-selection-overflow-item .ant-select-selection-item {
      border-radius: 1rem;
      background: var(--secondary-color);

      .ant-select-selection-item-content {
        font-size: ${FONT_SIZE.xxs};
        font-weight: ${FONT_WEIGHT.regular};
        font-family: ${FONT_FAMILY.secondary};
        color: var(--white);
        padding: 0 0.5rem;
      }

      .ant-select-selection-item-remove {
        margin-top: 0.1rem;
        padding-right: 0.5rem;
        color: var(--white);
      }
    }
  }
`;

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

export const Note = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
`;
