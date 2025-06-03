import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import * as S from './ModalTextArea.styles';
import TextArea from 'antd/es/input/TextArea';

export const ModalTextArea: React.FC<{
  name: string;
  suffix?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  inputTitle: string;
  inputDescription?: string;
}> = ({ name, disabled, style, inputTitle, inputDescription }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <S.InputTitle>{inputTitle}</S.InputTitle>
        <S.InputDescription>{inputDescription}</S.InputDescription>
      </div>
      <FormItem name={name} style={{ ...style }}>
        <TextArea
          rows={4}
          disabled={disabled}
          style={{ border: '1px solid var(--black)', background: 'var(--grey4)' }}
        />
      </FormItem>
    </div>
  );
};
