import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { Select, Typography } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const InputHeader = styled(Typography.Paragraph)`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--primary-color);
`;

export const CSVSelect = styled(Select)`
  width: 100%;
  .ant-select-arrow {
    margin-top: 0.2rem;
  }
`;
