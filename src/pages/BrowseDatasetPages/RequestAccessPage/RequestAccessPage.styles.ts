import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const NavCard = styled(CommonCard)`
  .ant-card-head {
    font-size: 1.2rem;
  }
`;

export const FormCard = styled(CommonCard)`
  padding-bottom: 2rem;
`;

export const ButtonsWrapper = styled.div`
  margin: 2rem 0;
  width: 100%;
`;

export const RequestAccessButton = styled(BaseButton)`
  float: left;
  width: 47%;
`;

export const CancelButton = styled(BaseButton)`
  float: right;
  width: 47%;
`;
