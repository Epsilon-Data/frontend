import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import styled from 'styled-components';
import { Typography } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

const { Text } = Typography;

export const Modal = styled(BaseModal)`
  .ant-modal-close .ant-modal-close-x .anticon-close {
    margin-top: 0.2rem;
    margin-right: 2rem;
  }
`;

export const Prompt = styled(Text)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.regular};
  margin-bottom: 0.5rem;
`;
