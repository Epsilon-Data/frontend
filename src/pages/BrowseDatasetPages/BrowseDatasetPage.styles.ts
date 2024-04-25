import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { SearchInput } from '@app/components/common/inputs/SearchInput/SearchInput';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { Typography } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const SearchCard = styled(CommonCard)`
  height: 30%;
  width: 100%;
  background: var(--sider-bg);
`;

export const SearchBar = styled(SearchInput)`
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

export const SectionHeader = styled(Typography.Paragraph)`
  font-size: ${FONT_SIZE.lg};
  font-weight: ${FONT_WEIGHT.semibold};
  color: var(--text-dark-color);
`;

export const CardItem = styled(CommonCard)`
  margin-bottom: 2rem;
  border-radius: 1.5rem;
  background-color: var(--secondary-background-color);

  .ant-card-body {
    padding: 2.3rem 2rem;
  }
`;

export const AllLink = styled.a`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  color: var(--text-light-color);
  text-decoration: underline;
  &:hover {
    text-decoration: underline;
    color: var(--secondary-color);
  }
`;
