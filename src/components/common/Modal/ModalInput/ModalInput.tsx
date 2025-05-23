import React from 'react';
import { Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import * as S from './ModalInput.styles';
import { FONT_SIZE } from '@app/styles/themes/constants';

export const ModalInput: React.FC<{
  name: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  inputTitle: string;
  inputDescription?: string;
  large?: boolean;
}> = ({ name, suffix, disabled, style, inputTitle, inputDescription, large }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem' }}>
      <div style={{ marginBottom: large ? '3rem' : '2rem' }}>
        <S.InputTitle style={{ fontSize: large ? FONT_SIZE.xxl : FONT_SIZE.xl }}>{inputTitle}</S.InputTitle>
        <S.InputDescription style={{ fontSize: large ? FONT_SIZE.md : FONT_SIZE.xs }}>
          {inputDescription}
        </S.InputDescription>
      </div>
      <FormItem name={name} style={{ ...style }}>
        <Input suffix={suffix} disabled={disabled} />
      </FormItem>
    </div>
  );
};
