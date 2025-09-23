import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { Button, Col, Input, Row } from 'antd';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { PiWarningBold } from 'react-icons/pi';
import { InputLabel } from '../InputLabel/InputLabel';
import { NumberedFormItem } from '../NumberedFormItem/NumberedFormItem';

export const TestConnectionGroup: React.FC<{
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
  loading?: boolean;
  inputTitle: string;
  inputDescription?: string;
  connected: boolean;
  show: boolean;
}> = ({ onClick, loading, inputTitle, inputDescription, connected, show }) => {
  const { t } = useTranslation();
  const inputRules = [
    {
      required: true,
      message: t('fieldMessages.input.required'),
    },
    {
      whitespace: true,
      message: t('fieldMessages.input.whitespace'),
    },
  ];

  return (
    <div className="flex flex-col pb-12">
      <NumberedFormItem number={4}>
        <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />
        <Row className="flex justify-between">
          <Col span={18}>
            <Row>
              <div className="flex items-center w-full">
                <span className="mb-6 text-base">{t('dashboard.createProject.form.step3.dbUrl.inputLabel')}</span>
                &nbsp;&nbsp;
                <FormItem name="dbUrl" className="flex-1" rules={inputRules}>
                  <Input
                    className="w-full !border !border-black"
                    placeholder={t('dashboard.createProject.form.step3.dbCred.placeholder')}
                  />
                </FormItem>
              </div>
            </Row>
          </Col>
          <Col span={5} className="flex justify-end">
            <Button className="test-conn-btn bg-black border-none text-white flex" loading={loading} onClick={onClick}>
              {t('dashboard.createProject.form.step3.testConnection.label')}
              <IoChevronForwardOutline />
            </Button>
          </Col>
        </Row>
        <div>
          {connected ? (
            <div className="text-xs text-success flex leading-5">
              {t('dashboard.createProject.form.step3.testConnection.success')}
              <FaRegCircleCheck className="ml-2 mt-1" />
            </div>
          ) : show ? (
            <div className="text-xs text-error flex leading-5">
              {t('dashboard.createProject.form.step3.testConnection.failed')}
              <PiWarningBold className="ml-2 mt-1" />
            </div>
          ) : null}
        </div>
      </NumberedFormItem>
      <NumberedFormItem number={5} showDivider={false}>
        <InputLabel
          inputTitle={t('dashboard.createProject.form.step3.dbCred.title')}
          inputDescription={t('dashboard.createProject.form.step3.dbCred.description')}
        />
        <div className="flex-1">
          <p className="mb-1 text-xs">{t('dashboard.createProject.form.step3.dbCred.username.title')}</p>
          <FormItem name="username" rules={inputRules}>
            <Input
              className="border border-black bg-grey-4"
              placeholder={t('dashboard.createProject.form.step3.dbCred.username.placeholder')}
            />
          </FormItem>
        </div>
        <div className="flex-1">
          <p className="mb-1 text-xs">{t('dashboard.createProject.form.step3.dbCred.password.title')}</p>
          <FormItem
            name="password"
            rules={[
              {
                required: true,
                message: t('fieldMessages.input.required'),
              },
            ]}
          >
            <Input.Password
              className="border border-black bg-grey-4"
              placeholder={t('dashboard.createProject.form.step3.dbCred.password.placeholder')}
            />
          </FormItem>
        </div>
      </NumberedFormItem>
    </div>
  );
};
