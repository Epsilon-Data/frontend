import styled, { css } from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

interface BtnProps {
  $isActive: boolean;
  color: 'primary' | 'error' | 'warning' | 'success';
}

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
`;

export const Button = styled(BaseButton)<BtnProps>`
  display: flex;
  justify-content: left;
  white-space: normal;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.87rem;
  height: auto;
  text-align: left;

  &:hover {
    background-color: rgba(var(--primary-rgb-color), 0.1);
  }

  &:focus {
    background-color: rgba(var(--primary-rgb-color), 0.1);
  }

  ${(props) =>
    props.$isActive &&
    css`
      background-color: rgba(var(--primary-rgb-color), 0.1);
    `};

  & > span:first-of-type {
    margin-right: 0.5rem;

    color: ${(props) => `var(--${props.color}-color)`};
  }
`;
