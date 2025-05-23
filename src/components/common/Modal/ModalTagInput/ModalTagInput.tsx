import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import * as S from './ModalTagInput.styles';
import { FONT_SIZE } from '@app/styles/themes/constants';

const MAX_COUNT = 6;

export const ModalTagInput: React.FC<{
  name: string;
  style?: React.CSSProperties;
  inputTitle: string;
  inputDescription?: string;
  value: string[];
  setValue: (value: string[]) => void;
}> = ({ name, style, inputTitle, inputDescription, value, setValue }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <S.InputTitle style={{ fontSize: FONT_SIZE.xl }}>{inputTitle}</S.InputTitle>
        <S.InputDescription style={{ fontSize: FONT_SIZE.xs }}>{inputDescription}</S.InputDescription>
      </div>
      <FormItem name={name} style={{ ...style }}>
        <S.TagSelect
          mode="tags"
          maxCount={MAX_COUNT}
          value={value}
          style={{ width: '100%' }}
          onChange={setValue}
          suffixIcon={null}
        />
      </FormItem>
      <S.Note>
        <span>Separate each one with a comma</span>
        <span>
          {value.length} / {MAX_COUNT}
        </span>
      </S.Note>
    </div>
  );
};
