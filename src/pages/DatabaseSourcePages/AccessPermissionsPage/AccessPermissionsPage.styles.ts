import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { Card as AntdCard, Checkbox } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Typography } from 'antd';

const { Text } = Typography;

export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;

  .ant-tabs {
    margin-top: 1rem;
  }
`;

export const MapWrapper = styled.div`
  height: 40rem;
  width: 100%;
`;

export const PermissionsPopover = styled(AntdCard)`
  width: 25%;
  background: var(--sider-bg);
  position: absolute;
  transform: translate(-50%, -50%);

  .ant-card-head-title {
    font-size: ${FONT_SIZE.md};
    font-weight: ${FONT_WEIGHT.semibold};
    margin-top: -1rem;
  }

  .ant-card-body {
    padding-top: 0;
    padding-bottom: 1rem;
  }
`;

export const PermissionsCheckboxGroup = styled(Checkbox.Group)`
  .ant-checkbox {
    margin-top: -0.4rem;
  }
`;

export const PermissionsMessage = styled(Text)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.medium};
  margin-left: 0.3rem;
  color: var(--secondary-color);
`;
