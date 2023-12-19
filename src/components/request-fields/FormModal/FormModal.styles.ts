import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import styled from 'styled-components';

export const Modal = styled(BaseModal)`
  .ant-modal-close .ant-modal-close-x .anticon-close {
    margin-top: 0.2rem;
    margin-right: 2rem;
  }
`;

export const GroupCheckbox = styled(BaseCheckbox.Group)`
  .ant-checkbox {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;
