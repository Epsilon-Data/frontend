import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Typography } from 'antd';
import { styled } from 'styled-components';

export const MultiSelect = styled(BaseSelect)`
  .ant-select-arrow {
    margin-top: -0.4rem;
  }
`;

export const SectionHeader = styled(Typography.Paragraph)`
  font-size: ${FONT_SIZE.lg};
  font-weight: ${FONT_WEIGHT.semibold};
  color: var(--text-dark-color);
  margin: 1rem 0;
`;
