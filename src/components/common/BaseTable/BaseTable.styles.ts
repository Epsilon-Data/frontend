import styled from 'styled-components';
import { Table as AntdTable } from 'antd';
import { FONT_SIZE } from '@app/styles/themes/constants';

export const Table = styled(AntdTable)`
  .ant-table-content {
    border-radius: 1rem;
    border: 2px solid var(--border-color);
  }

  .ant-table-thead > tr > th:first-child,
  .ant-table-tbody > tr > td:first-child {
    border-left: none;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }

  & thead .ant-table-cell {
    color: var(--primary-color);
    font-size: ${FONT_SIZE.xs};
    border-top: 0;
    border-bottom: 2px solid var(--primary-color);
    border-left: 2px solid var(--border-color);
    & .anticon {
      color: var(--primary-color);
    }
  }

  & tbody .ant-table-cell {
    color: var(--text-main-color);
    font-size: ${FONT_SIZE.xs};
    line-height: 1.25rem;
    border-left: 2px solid var(--border-color);
  }

  & tbody .ant-table-row-expand-icon {
    min-height: 1.25rem;
    min-width: 1.25rem;
    border-radius: 0.1875rem;
    margin-top: 0;
  }

  // Override default antd selector
  &
    .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    background-color: transparent;
  }

  & .ant-pagination-prev,
  .ant-pagination-next,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next,
  .ant-pagination-item {
    min-width: 2.0625rem;
    height: 2.0625rem;
    line-height: 2.0625rem;
    font-size: ${FONT_SIZE.xs};
  }

  & .ant-checkbox-inner {
    border-radius: 0.1875rem;
    height: 1.25rem;
    width: 1.25rem;
    border: 1px solid var(--primary-color);
  }

  & .editable-row .ant-form-item-explain {
    position: absolute;
    top: 100%;
    font-size: 0.75rem;
  }

  .ant-table-column-sort {
    background-color: transparent;
  }

  .ant-pagination-item-container .ant-pagination-item-ellipsis {
    color: var(--disabled-color);
  }

  .ant-pagination-disabled {
    .ant-pagination-item-link,
    .ant-pagination-item a {
      color: var(--disabled-color);
    }
  }

  .ant-pagination.ant-pagination-disabled {
    .ant-pagination-item-link,
    .ant-pagination-item a {
      color: var(--disabled-color);
    }
  }
`;
