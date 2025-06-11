import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button, Input, Radio, Select } from 'antd';
import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .sort-select .ant-select-selector {
    height: 2.1rem;
    white-space: wrap;
    font-size: ${FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.medium};
    font-family: ${FONT_FAMILY.secondary};
  }

  .sort-select .ant-select-selector .ant-select-prefix {
    font-size: ${FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
    font-family: ${FONT_FAMILY.secondary};
    color: var(--grey2) !important;
    margin-right: 0.5rem;
  }

  padding-bottom: 1rem;
  border-bottom: 1px solid var(--grey3);
`;

export const Title = styled.div`
  font-size: ${FONT_SIZE.xl};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.main};
`;

export const SearchBar = styled(Input)`
  padding: 0.3rem 0.5rem;
  font-size: ${FONT_SIZE.xs};
  font-family: ${FONT_FAMILY.secondary};
`;

export const ToolsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const LayoutSelector = styled(Radio.Group)`
  display: flex;
  background-color: var(--grey3);
  border-radius: 0.5rem;
  padding: 0.2rem;
  gap: 0.2rem;
  .ant-radio-button-wrapper {
    background: transparent;
    border: none;
    box-shadow: none;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.4rem;
    padding: 0.4rem;
    height: auto;
    max-height: 1.8rem;
    transition:
      background-color 0.3s,
      color 0.3s;

    .ant-radio-button-label {
      display: flex;
      padding: 0.25rem 0;
    }

    &:focus,
    &:focus-visible,
    &:active,
    &.ant-radio-button-wrapper:focus-within {
      outline: none;
      box-shadow: none;
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    &.ant-radio-button-wrapper-checked {
      background-color: white;
      color: var(--black);
    }

    &:not(:first-child) {
      margin-left: 0.2rem;
    }
  }

  .ant-radio-button-wrapper::before {
    display: none !important;
  }
`;

export const AddProjectButton = styled(Button)`
  display: flex;
  align-items: center;
  width: 20rem;
  height: 2.2rem;
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.secondary};
  background: var(--primary-gradient-color);

  &:hover {
    background: var(--primary-gradient-color) !important;
    color: var(--white) !important;
  }
`;

export const SortingSelect = styled(Select)`
  .ant-select-selector {
    border: 1px solid var(--grey2) !important;
  }
`;
