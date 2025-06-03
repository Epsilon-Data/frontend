import React from 'react';

import FormItem from 'antd/es/form/FormItem';
import * as S from './ModalDatePicker.styles';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FONT_SIZE } from '@app/styles/themes/constants';

dayjs.extend(customParseFormat);

export const ModalDatePicker: React.FC<{
  startName: string;
  endName: string;
  style?: React.CSSProperties;
  inputTitle: string;
  inputDescription?: string;
}> = ({ startName, endName, style, inputTitle, inputDescription }) => {
  //const dateFormat = 'YYYY-MM-DD';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <S.InputTitle>{inputTitle}</S.InputTitle>
        <S.InputDescription>{inputDescription}</S.InputDescription>
      </div>
      <S.DateWrapper>
        <div style={{ flex: 1 }}>
          <p style={{ marginBottom: '0.3rem', fontSize: FONT_SIZE.xs }}>Start</p>
          <FormItem name={startName} style={{ ...style }}>
            <S.Picker style={{ border: '1px solid var(--black)' }} />
          </FormItem>
        </div>
        <S.HorizontalLine />
        <div style={{ flex: 1 }}>
          <p style={{ marginBottom: '0.3rem', fontSize: FONT_SIZE.xs }}>End</p>
          <FormItem name={endName} style={{ ...style }}>
            <S.Picker style={{ border: '1px solid var(--black)' }} />
          </FormItem>
        </div>
      </S.DateWrapper>
    </div>
  );
};
