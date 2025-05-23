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

export const UrlWrapper = styled(Row)`
  display: flex;
`;

export const UrlInput = styled(Input)`
  width: 100%;
`;

export const RoleSelect = styled(Select)`
  width: 100%;

  .ant-select-arrow {
    margin-top: 0.2rem;
    color: var(--black);
  }
`;

export const TestConnectionButton = styled(Button)`
  background-color: var(--black);
  border: none;
  color: var(--white);
  margin-top: 0.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TestMessage = styled.div`
  font-size: ${FONT_SIZE.xs};
  color: var(--success-color);
  line-height: 1.25rem;
  display: flex;
`;
