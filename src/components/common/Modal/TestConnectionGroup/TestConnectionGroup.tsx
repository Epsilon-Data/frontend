import React from 'react';
import * as S from './TestConnectionGroup.styles';
import FormItem from 'antd/es/form/FormItem';
import { Col, Input, Row } from 'antd';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { PiWarningBold } from 'react-icons/pi';

export const TestConnectionGroup: React.FC<{
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
  loading?: boolean;
  inputTitle: string;
  inputDescription?: string;
  connected: boolean;
  show: boolean;
}> = ({ onClick, loading, inputTitle, inputDescription, connected, show }) => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <S.InputTitle>{inputTitle}</S.InputTitle>
        <S.InputDescription>{inputDescription}</S.InputDescription>
      </div>
      <S.UrlWrapper>
        <Col span={19} style={{ flex: 1 }}>
          <Row align={'middle'}>
            <span style={{ fontSize: FONT_SIZE.md, marginBottom: '0.7rem' }}>URL link:</span>&nbsp;&nbsp;
            <FormItem name="dbUrl" style={{ width: '80%' }}>
              <S.UrlInput />
            </FormItem>
          </Row>
        </Col>
        <Col span={5}>
          <S.TestConnectionButton loading={loading} onClick={onClick}>
            Test connection
            <IoChevronForwardOutline style={{ marginLeft: '0.5rem' }} />
          </S.TestConnectionButton>
        </Col>
      </S.UrlWrapper>
      <div>
        {connected ? (
          <S.TestMessage>
            {t('dashboard.createProject.form.step4.dbUrl.testSuccess')}
            <FaRegCircleCheck style={{ marginLeft: '0.5rem', marginTop: '0.2rem' }} />
          </S.TestMessage>
        ) : show ? (
          <S.TestMessage style={{ color: 'var(--error-color)' }}>
            {t('dashboard.createProject.form.step4.dbUrl.testFailed')}
            <PiWarningBold style={{ marginLeft: '0.5rem', marginTop: '0.2rem' }} />
          </S.TestMessage>
        ) : null}
      </div>
      <div style={{ marginBottom: '2rem', marginTop: '3rem' }}>
        <S.InputTitle style={{ fontSize: FONT_SIZE.xl, color: 'var(--black)' }}>
          {t('dashboard.createProject.form.step4.dbCred.title')}
        </S.InputTitle>
        <S.InputDescription style={{ fontSize: FONT_SIZE.xs }}>
          {t('dashboard.createProject.form.step4.dbCred.description')}
        </S.InputDescription>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ marginBottom: '0.3rem', fontSize: FONT_SIZE.xs }}>Enter database username</p>
        <FormItem name="username">
          <Input />
        </FormItem>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ marginBottom: '0.3rem', fontSize: FONT_SIZE.xs }}>Enter database password</p>
        <FormItem name="password">
          <Input.Password />
        </FormItem>
      </div>
    </div>
  );
};
