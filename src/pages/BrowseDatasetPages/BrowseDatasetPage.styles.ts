import styled from 'styled-components';
import { Button, Input, Modal, Radio, Row, Select, Tabs, Tag, Typography } from 'antd';
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, LAYOUT } from '@app/styles/themes/constants';

export const SearchHeader = styled(Row)`
  background: linear-gradient(to bottom, #e2edf8, transparent);
  padding: 5rem 4rem;
  display: flex;
  flex-direction: column;
`;

export const SearchInput = styled(Input)`
  width: 100%;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--blue-dark);
  background: rgba(159, 203, 249, 0.2);
  padding-right: 3rem;
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchRow = styled(Row)`
  margin-bottom: 1rem;
`;

export const SearchButton = styled(Button)`
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  border-radius: 50%;
  height: 2.3rem;
  width: 2.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

export const SearchLabel = styled(Typography.Text)`
  display: flex;
  font-weight: ${FONT_WEIGHT.regular};
  font-size: ${FONT_SIZE.md};
  margin-right: 1rem;
  margin-top: 0.1rem;

  color: var(--black);
`;

export const SectionTitle = styled.div`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--black);
`;

export const SectionDescription = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--grey1);
`;

export const SearchRadio = styled(Radio)`
  margin-top: 0.15rem;
  font-weight: ${FONT_WEIGHT.regular};
  font-size: ${FONT_SIZE.xs};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--gray);
  .ant-radio-inner {
    margin-bottom: 0.35rem;
  }
`;

export const BrowseTitle = styled.div`
  font-size: 3.5rem;
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.main};
  color: var(--blue-dark);
`;

export const BrowseDescription = styled.div`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--black);
`;

export const SearchContent = styled.div`
  padding: 0 ${LAYOUT.desktop.paddingHorizontal};
  display: flex;
  flex-direction: column;
`;

export const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;

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

export const SortingSelect = styled(Select)`
  .ant-select-selector {
    border: 1px solid var(--grey2) !important;
  }
`;

export const DetailsModal = styled(Modal)`
  margin-top: -3rem;
  .ant-modal-mask {
    backdrop-filter: blur(6px);
    background-color: rgba(0, 0, 0, 0.3);
  }

  .ant-modal-content {
    padding: 0;
    border-radius: 0.5rem;
  }

  .ant-modal-footer {
    background: var(--grey4);
    border-radius: 0 0 0.5rem 0.5rem;
    padding: 1rem 2rem;
    display: flex;
    justify-content: flex-end;
  }
`;

export const AccessContent = styled.div`
  height: 48rem;
  padding: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-top: -2rem;
  border-radius: 0.5rem;
`;

export const DetailsHeader = styled(Row)`
  background: var(--grey4);
  height: 33rem;
  border-radius: 0.5rem 0.5rem 0 0;
`;

export const DetailsTitle = styled.div`
  font-size: ${FONT_SIZE.xxl};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.main};
  color: var(--black);
`;

export const DetailsSubtitle = styled.div`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.light};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--black);
`;

export const RequestButton = styled(Button)`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  width: 15rem;
  height: 2.2rem;
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.secondary};

  background: var(--primary-gradient-color);
  color: var(--white);

  span,
  .ant-btn-icon {
    transition: transform 0.3s ease;
    display: inline-flex;
    align-items: center;
  }

  &:hover,
  &:focus,
  &:active {
    background: var(--primary-gradient-color) !important;
    color: var(--white) !important;
    box-shadow: none;
  }

  &:hover span {
    transform: translateX(-4px);
  }

  &:hover .ant-btn-icon {
    transform: translateX(4px);
  }
`;

export const Cover = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cover-bg-color);
  font-size: 48px;
  font-weight: bold;
  color: var(--cover-text-color);
  border-radius: 0 0.5rem 0 0;
  overflow: hidden;
`;

export const CoverText = styled.div`
  line-height: 1;
  padding: 2rem;
  text-align: center;
`;

export const DetailsSection = styled(Row)`
  margin: 2rem 6rem 0rem 6rem;
`;

export const TextHeader = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.secondary};
  margin-bottom: 1rem;
`;

export const DetailsTabs = styled(Tabs)`
  .ant-tabs-nav .ant-tabs-nav-wrap {
    border-bottom: 1px solid var(--grey3);
  }

  .ant-tabs-nav .ant-tabs-nav-wrap .ant-tabs-nav-list .ant-tabs-tab {
    font-size: ${FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.regular};
    font-family: ${FONT_FAMILY.secondary};
    padding: 0 0 0.3rem;
  }

  .ant-tabs-content-holder .ant-tabs-content {
    font-size: ${FONT_SIZE.xs};
    font-weight: ${FONT_WEIGHT.light};
    font-family: ${FONT_FAMILY.secondary};
  }
`;

export const KeywordTag = styled(Tag)`
  width: max-content;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
  border-radius: 1rem;
  padding: 0.3rem 0.8rem;
  text-align: center;
  background: var(--grey1);
  color: var(--white);
  word-wrap: break-word;
`;

export const AboutText = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded: boolean }>`
  position: relative;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: ${({ expanded }) => (expanded ? 'none' : 6)};
  -webkit-box-orient: vertical;
  white-space: normal;
`;

export const ShowButton = styled.button`
  background: none;
  border: none;
  color: var(--blue-dark);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.secondary};
  cursor: pointer;
  margin-top: 0.5rem;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;
