import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { Handle } from 'reactflow';

export const ColumnNodeWrapper = styled.div`
  background: var(--white);
  border: 1px solid var(--black);
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
  border-left: 1px solid var(--black);
  border-right: 1px solid var(--black);
  margin: 0 1rem;
`;

export const ColumnHandle = styled(Handle)`
  && {
    visibility: hidden;
    border: none;
    background: var(--gray);
    height: 10px;
    width: 10px;
    transition:
      height 0.3s ease,
      width 0.3s ease;
    &:hover {
      background: var(--secondary-color);
      height: 13px;
      width: 13px;
    }
  }
`;
