import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button, Tag } from 'antd';
import styled from 'styled-components';

export const Text = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--black);
`;

export const SubText = styled.div`
  font-size: ${FONT_SIZE.xxs};
  font-weight: ${FONT_WEIGHT.light};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--black);
`;

export const StatusTag = styled(Tag)`
  font-size: ${FONT_SIZE.xxs};
  font-weight: ${FONT_WEIGHT.regular};
  font-family: ${FONT_FAMILY.secondary};
  border-radius: 1rem;
  padding: 0.25rem 0.5rem;
`;

export const Cover = styled.div`
  width: 100%;
  height: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cover-bg-color);
  font-size: 48px;
  font-weight: bold;
  color: var(--cover-text-color);
  border-radius: 4px 4px 0 0;
  overflow: hidden;

  &:hover .overlay {
    opacity: 1;
  }
`;

export const CoverText = styled.div`
  line-height: 1;
  padding: 2rem;
  text-align: center;
`;

export const CoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 55%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border-radius: 4px 4px 0 0;
`;

export const ViewButton = styled(Button)`
  display: flex;
  align-items: center;
  width: 20rem;
  height: 2.2rem;
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.secondary};

  background: var(--primary-gradient-color);
  border: none;
  color: var(--white);
  width: 60%;

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
