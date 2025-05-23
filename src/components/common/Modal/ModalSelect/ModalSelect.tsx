import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import * as S from './ModalSelect.styles';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { FaChevronDown } from 'react-icons/fa6';

export const ModalSelect: React.FC<{
  name: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  inputTitle: string;
  inputDescription?: string;
  options: { value: string; label: string }[];
}> = ({ name, disabled, style, inputTitle, inputDescription, options }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <S.InputTitle style={{ fontSize: FONT_SIZE.xl }}>{inputTitle}</S.InputTitle>
        <S.InputDescription style={{ fontSize: FONT_SIZE.xs }}>{inputDescription}</S.InputDescription>
      </div>
      <FormItem name={name} style={{ ...style }}>
        <S.Selection disabled={disabled} suffixIcon={<FaChevronDown />} options={options} />
      </FormItem>
    </div>
  );
};
