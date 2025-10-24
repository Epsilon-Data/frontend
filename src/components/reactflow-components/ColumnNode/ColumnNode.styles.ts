import styled from 'styled-components';
import { Handle } from '@xyflow/react';

export const ColumnNodeWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #000000;
  border-radius: 0.5rem;
`;

export const ColumnDisplay = styled.div`
  margin-top: 0.2rem;
  font-weight: 500;
  font-size: 1rem;
  text-align: center;
  padding: 0.5rem;
  width: 200px;
  max-height: 53px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  border-left: 1px solid #000000;
  border-right: 1px solid #000000;
  margin: 0 1rem;
`;

export const ColumnHandle = styled(Handle)`
  && {
    visibility: hidden;
    border: none;
    background: #4a5565;
    height: 10px;
    width: 10px;
    transition:
      height 0.3s ease,
      width 0.3s ease;
    &:hover {
      background: #1481f1;
      height: 13px;
      width: 13px;
    }
  }
`;
