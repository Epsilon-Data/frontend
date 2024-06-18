import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { Collapse } from 'antd';
import { FONT_SIZE } from '@app/styles/themes/constants';
export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const Guide = styled(Collapse)`
  background: transparent;
  width: 80%;

  .ant-collapse-expand-icon {
    margin-top: 0.05rem;
  }

  .ant-collapse-content {
    font-size: ${FONT_SIZE.xs};
    padding: 0 2rem 1rem;
  }
`;
