import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const ColumnNodeWrapper = styled.div`
  background: var(--white);
  border: 2px solid var(--black);
  border-radius: 0.5rem;
`;

export const ColumnDisplay = styled.div`
  margin-top: 0.2rem;
  font-weight: ${FONT_WEIGHT.medium};
  font-size: ${FONT_SIZE.md};
  text-align: center;
  padding: 0.5rem;
  width: 200px;
  max-height: 53px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  border-left: 2px solid var(--black);
  border-right: 2px solid var(--black);
  margin: 0 1rem;
`;
