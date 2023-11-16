import styled from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { FONT_SIZE } from '@app/styles/themes/constants';

export const ConnectionButton = styled(BaseButton)`
  background: var(--warning-color);
  color: var(--black);
  border: none;
  height: 2.5rem;
  margin: 1rem 0 0.5rem;
`;
export const ButtonTip = styled(BaseTypography)`
  font-size: ${FONT_SIZE.xs};
  color: var(--text-main-color);
  line-height: 1.25rem;
`;

export const TestMessage = styled(BaseTypography)`
  font-size: ${FONT_SIZE.xs};
  color: var(--success-color);
  line-height: 1.25rem;
`;
