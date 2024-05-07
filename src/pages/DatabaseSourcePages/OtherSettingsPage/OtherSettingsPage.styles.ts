import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { Space, Typography } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const VisInputSpace = styled(Space)`
  display: flex;
`;

export const InputTitle = styled(Typography.Text)`
  font-size: 0.92rem;
  font-weight: ${FONT_WEIGHT.medium};
  color: var(--primary-color);
`;

export const VisInput = styled(BaseInput)`
  .ant-form-item-explain-error {
    display: inline-block;
    position: relative;
    margin: 0;
  }

  @media only screen {
    span.ant-input-group-addon:first-of-type {
      font-size: ${FONT_SIZE.md};
      font-weight: ${FONT_WEIGHT.medium};
    }
  }
`;
