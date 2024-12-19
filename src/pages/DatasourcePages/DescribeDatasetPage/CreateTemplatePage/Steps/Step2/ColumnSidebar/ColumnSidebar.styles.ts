import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';
import { Checkbox } from 'antd';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';

export const Sidebar = styled.aside`
  padding: 15px 0;
  font-size: ${FONT_SIZE.xl};

  .description {
    font-size: ${FONT_SIZE.md};
    margin-bottom: 2rem;
  }
`;

export const Column = styled.div`
  background: var(--white);
  margin: 0 1.5rem 2rem;
  border-radius: 0.5rem;
  border: 1px solid var(--black);
  width: 80%;
  .text {
    display: flex;
    border-left: 1px solid var(--black);
    border-right: 1px solid var(--black);
    margin: 0 1rem;
    padding: 0.2rem 0.5rem;
    height: 100%;
    word-break: break-all;
    justify-content: space-between;
  }

  .text span {
    display: block;
    font-size: 0.9rem;
    text-align: right;
  }

  .text span span {
    font-size: ${FONT_SIZE.xxs};
    font-weight: ${FONT_WEIGHT.light};
  }
`;

export const ColumnSearch = styled(BaseInput)`
  margin: 0 1.5rem 0;
  width: 80%;
`;

export const ColumnCheckbox = styled(Checkbox)`
  float: left;
  margin-right: 0.6rem;
  margin-top: -0.3rem;
`;

export const CheckAllCheckbox = styled(Checkbox)`
  margin: 1rem 1.5rem 1.2rem;
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};

  .ant-checkbox {
    margin-top: -0.3rem;
  }
`;

export const ColumnCheckboxGroup = styled(Checkbox.Group)`
  width: 100%;
  max-height: 38rem;
  overflow-y: auto;
  overflow-x: hidden;
`;
