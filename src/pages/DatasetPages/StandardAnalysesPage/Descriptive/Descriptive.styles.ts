import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Typography } from 'antd/lib';
import { styled } from 'styled-components';
import { Tag as AntTag } from 'antd';

export const MultiSelect = styled(BaseSelect)`
  .ant-select-arrow {
    margin-top: -0.4rem;
  }
`;

export const GroupCheckbox = styled(BaseCheckbox.Group)`
  .ant-checkbox-wrapper {
    margin-bottom: 0.5rem;
  }

  .ant-checkbox {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

export const RadioGroup = styled(BaseRadio.Group)`
  .ant-radio-inner {
    margin-top: -0.5rem;
  }
`;

export const Tag = styled(AntTag)`
  .ant-radio-inner {
    margin-top: -0.5rem;
  }
  &:hover {
    background-color: #cfd8ff; /* Change this to your desired hover background color */
  }
  &.selected {
    background-color: #cfd8ff; /* Color when tag is selected */
  }
`;

export const InputHeader = styled(Typography.Paragraph)`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--primary-color);
`;

export const SectionHeader = styled(Typography.Paragraph)`
  font-size: ${FONT_SIZE.lg};
  font-weight: ${FONT_WEIGHT.semibold};
  color: var(--text-dark-color);
  margin: 1rem 0;
`;

export const Output = styled.div`
  thead {
    border-bottom: 2px solid var(--border-color);
  }
`;
