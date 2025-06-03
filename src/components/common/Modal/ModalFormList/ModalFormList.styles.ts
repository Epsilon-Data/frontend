import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button, Input, Row, Select } from 'antd';
import styled from 'styled-components';

export const InputTitle = styled.div`
  font-size: ${FONT_SIZE.xl};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.main};
  color: var(--blue-dark);
`;

export const InputDescription = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.light};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--black);
`;

export const EmailWrapper = styled(Row)`
  display: flex;
`;

export const EmailInput = styled(Input)`
  width: 100%;
`;

export const RoleSelect = styled(Select)`
  width: 100%;

  .ant-select-selector {
    border: 1px solid var(--black) !important;
  }

  .ant-select-arrow {
    margin-top: 0.2rem;
    color: var(--black);
  }
`;

export const AddButton = styled(Button)`
  margin-top: 1.7rem;
  margin-left: 1rem;
  background-color: var(--black);
  border: none;
  color: var(--white);

  &:hover,
  &:focus,
  &:active {
    background: var(--black) !important;
    color: var(--white) !important;
  }
`;

export const HorizontalLine = styled.div`
  height: 2px;
  background: var(--grey2);
`;

export const Text = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--black);
`;
