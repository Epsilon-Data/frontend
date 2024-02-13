import { FONT_SIZE } from '@app/styles/themes/constants';
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
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  border: 2px solid var(--black);

  .text {
    display: flex;
    border-left: 2px solid var(--black);
    border-right: 2px solid var(--black);
    margin: 0 1rem;
    padding: 0.5rem;
    height: 100%;
    word-break: break-all;
  }

  .text span {
    flex: 1;
    font-size: 0.9rem;
    text-align: right;
  }
`;

export const ColumnSearch = styled(BaseInput)`
  margin-bottom: 2rem;
`;

export const ColumnCheckbox = styled(Checkbox)`
  float: left;
  margin-right: 0.6rem;
  margin-top: -0.3rem;
`;
