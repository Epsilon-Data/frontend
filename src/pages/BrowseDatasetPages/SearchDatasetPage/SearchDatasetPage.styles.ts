import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { Checkbox, Input, Tag, Typography } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 3rem;
`;

export const SearchCard = styled(CommonCard)`
  height: 30%;
  width: 100%;
  background: var(--sider-bg);
`;

export const SearchBar = styled(Input.Search)`
  width: 80%;
  align-items: center;
  justify-content: center;

  ::placeholder {
    opacity: 0.7;
  }

  .ant-input-search-button {
    height: 3.1rem;
    border: 1px solid var(--text-light-color);
    background: var(--white);
  }
`;

export const SearchRow = styled(BaseRow)`
  margin-bottom: 1rem;
`;

export const Label = styled(Typography.Text)`
  display: flex;
  font-weight: ${FONT_WEIGHT.semibold};
  font-size: ${FONT_SIZE.md};
  margin-right: 1rem;
  margin-top: 0.1rem;

  color: var(--text-dark-color);
`;

export const ResultsHeader = styled(Typography.Paragraph)`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  color: var(--text-light-color);
  margin-top: 1rem;
`;

export const CardItem = styled(CommonCard)`
  width: 95%;
  margin-bottom: 2rem;
  border-radius: 1.5rem;
  background-color: var(--secondary-background-color);

  .ant-card-body {
    padding: 2.3rem 2rem;
  }
`;

export const FilterSidebar = styled(CommonCard)`
  border-radius: 1rem;
  background-color: var(--text-dark-color);
  margin-top: 1rem;

  .ant-card-head-title {
    color: var(--white);
    font-weight: ${FONT_WEIGHT.semibold};
    font-size: ${FONT_SIZE.xl};
  }

  .ant-card-body {
    padding: 1rem 1.5rem;
  }
`;

export const SidebarText = styled(Typography.Text)`
  color: var(--white);
`;

export const SidebarRow = styled(BaseRow)`
  margin-bottom: 0.6rem;
`;

export const KeywordTag = styled(Tag.CheckableTag)`
  border: 1px solid var(--white);
  padding: 0.3rem 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--white);
  font-size: ${FONT_SIZE.xxs};

  &:hover {
    color: var(--white);
    border: 1px solid var(--secondary-color);
  }

  &.ant-tag-checkable:not(.ant-tag-checkable-checked):hover {
    color: var(--secondary-color);
  }

  ${({ checked }) =>
    checked &&
    `
    background-color: var(--white);
    color: var(--secondary-color);
  `}
`;

export const SearchDescription = styled(Typography.Text)`
  font-weight: ${FONT_WEIGHT.regular};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  max-lines: 2;
`;

export const KeywordCheckbox = styled(Checkbox)`
  color: var(--white);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};

  .ant-checkbox {
    margin-top: -0.5rem;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: var(--secondary-color);
  }

  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: var(--white);
    border-radius: 0.1rem;
  }
`;
