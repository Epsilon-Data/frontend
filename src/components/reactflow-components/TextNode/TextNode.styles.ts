import styled from 'styled-components';
import { Handle } from '@xyflow/react';

export const TextNodeWrapper = styled.div<{ $selected?: boolean }>`
  border-radius: 0.5rem;
  height: 50px;
  padding: 0.5rem;
`;

export const TextNodeInput = styled.input`
  color: #000000;
  background: transparent;
  font-weight: 500;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  text-align: center;
  width: 200px;
  height: 33px;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
  }
`;

export const TextDisplay = styled.div`
  color: #000000;
  margin-top: 0.25rem;
  float: right;
  font-weight: 500;
  font-size: 1rem;
  text-align: center;
  width: 200px;
  height: 36px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;

export const TextHandle = styled(Handle)`
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
