import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { Button, Col, Input, Row, Switch } from 'antd';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { PiWarningBold } from 'react-icons/pi';
import { InputLabel } from '../InputLabel/InputLabel';
import { NumberedFormItem } from '../NumberedFormItem/NumberedFormItem';
import { ModalRadioGroup } from '../ModalRadioGroup/ModalRadioGroup';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { RadioChangeEvent } from 'antd/lib';

type TestConnectionGroupProps = {
  onClick?: React.MouseEventHandler<HTMLElement> | undefined;
  loading?: boolean;
  inputTitle: string;
  inputDescription?: string;
  connected: boolean;
  show: boolean;
  radioGroupOptions: CheckboxGroupProps<boolean>['options'];
  handleChange: (e: RadioChangeEvent) => void;
  isDbUrl: boolean;
  number: number;
  errorMessage?: string | null;
};

export const TestConnectionGroup: React.FC<TestConnectionGroupProps> = ({
  onClick,
  loading,
  inputTitle,
  inputDescription,
  connected,
  show,
  radioGroupOptions,
  handleChange,
  isDbUrl,
  number,
  errorMessage,
}) => {
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
      <NumberedFormItem number={number} showDivider={false}>
        <ModalRadioGroup
          name="isDbUrl"
          inputTitle={t('dashboard.createProject.form.step3.dbCred.configuration.title')}
          options={radioGroupOptions}
          defaultValue={true}
          onChange={handleChange}
        />
        {isDbUrl ? (
          <>
            <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />
            <Row className="flex">
              <Col span={18}>
                <Row>
                  <div className="flex items-center w-full">
                    <span className="mb-6 text-base">
                      {t('dashboard.createProject.form.step3.dbCred.dbUrl.inputLabel')}
                    </span>
                    &nbsp;&nbsp;
                    <FormItem name="dbUrl" className="flex-1" rules={inputRules}>
                      <Input
                        className="w-full border-grey-3 bg-grey-4 [&::placeholder]:text-grey-2"
                        placeholder={t('dashboard.createProject.form.step3.dbCred.placeholder')}
                      />
                    </FormItem>
                  </div>
                </Row>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <InputLabel
              inputTitle={t('dashboard.createProject.form.step3.dbCred.title')}
              inputDescription={t('dashboard.createProject.form.step3.dbCred.description')}
            />
            <div className="flex-1">
              <p className="mb-1 text-xs">{t('dashboard.createProject.form.step3.dbCred.username.title')}</p>
              <FormItem name="username" rules={inputRules}>
                <Input
                  className="border border-grey-3 bg-grey-4 [&::placeholder]:text-grey-2"
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
                  className="border border-grey-3 bg-grey-4 [&::placeholder]:text-grey-2"
                  placeholder={t('dashboard.createProject.form.step3.dbCred.password.placeholder')}
                />
              </FormItem>
            </div>
            <div className="flex-1">
              <p className="mb-1 text-xs">{t('dashboard.createProject.form.step3.dbCred.hostname.title')}</p>
              <FormItem name="hostname" rules={inputRules}>
                <Input
                  className="border border-grey-3 bg-grey-4 [&::placeholder]:text-grey-2"
                  placeholder={t('dashboard.createProject.form.step3.dbCred.hostname.placeholder')}
                />
              </FormItem>
            </div>
            <div className="flex-1">
              <p className="mb-1 text-xs">{t('dashboard.createProject.form.step3.dbCred.port.title')}</p>
              <FormItem name="port" rules={inputRules}>
                <Input
                  className="border border-grey-3 bg-grey-4 [&::placeholder]:text-grey-2"
                  placeholder={t('dashboard.createProject.form.step3.dbCred.port.placeholder')}
                />
              </FormItem>
            </div>
            <div className="flex-1">
              <p className="mb-1 text-xs">{t('dashboard.createProject.form.step3.dbCred.name.title')}</p>
              <FormItem name="name" rules={inputRules}>
                <Input
                  className="border border-grey-3 bg-grey-4 [&::placeholder]:text-grey-2"
                  placeholder={t('dashboard.createProject.form.step3.dbCred.name.placeholder')}
                />
              </FormItem>
            </div>
            <div className="flex-1">
              <p className="mb-1 text-xs">{t('dashboard.createProject.form.step3.dbCred.ssl.title')}</p>
              <FormItem name="ssl" valuePropName="checked" initialValue={false}>
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </FormItem>
            </div>
          </>
        )}
        <Button className="test-conn-btn bg-black border-none text-white flex" loading={loading} onClick={onClick}>
          {t('dashboard.createProject.form.step3.dbCred.testConnection.label')}
          <IoChevronForwardOutline />
        </Button>

        <div className="mt-1">
          {connected ? (
            <div className="text-sm text-success flex">
              {t('dashboard.createProject.form.step3.dbCred.testConnection.success')}
              <FaRegCircleCheck className="ml-2 mt-1" />
            </div>
          ) : show ? (
            <div className="text-sm text-error flex flex-col">
              <div className="flex items-center">
                <span>{errorMessage || t('dashboard.createProject.form.step3.dbCred.testConnection.failed')}</span>
                <PiWarningBold className="ml-2 mt-1" />
              </div>
            </div>
          ) : null}
        </div>
      </NumberedFormItem>
    </div>
  );
};
