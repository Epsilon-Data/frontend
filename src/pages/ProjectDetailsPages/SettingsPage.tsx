import { testConnection } from '@app/api/connectionRequests.api';
import { deleteProject, updateCredentials } from '@app/api/projects.api';
import { InputLabel } from '@app/components/common/Modal/InputLabel/InputLabel';
import { ModalSelect } from '@app/components/common/Modal/ModalSelect/ModalSelect';
import { useProjectContext } from '@app/hooks/useProjectContext';
import { buildDatabaseUrl } from '@app/utils/databaseUrl';
import { Breadcrumb, Button, Col, Form, Input, message, Popconfirm, Radio, RadioChangeEvent, Row } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import FormItem from 'antd/es/form/FormItem';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillDelete } from 'react-icons/ai';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { PiWarningBold } from 'react-icons/pi';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const { t } = useTranslation();
  const { project } = useProjectContext();
  const [isTestLoading, setTestLoading] = useState(false);
  const [form] = Form.useForm();
  const isDbUrl = Form.useWatch('isDbUrl', form);
  const [showMessage, setShowMessage] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [dbUrl, setDbUrl] = useState('');
  const [isSyncLoading, setSyncLoading] = useState(false);
  const navigate = useNavigate();

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

  const dbTypeOptions = [{ value: 'postgres', label: 'PostgreSQL' }];

  const handleIsDbUrlChange = (e: RadioChangeEvent) => {
    const value = e.target.value as boolean;

    setShowMessage(false);
    setConnected(false);

    if (value) {
      form.resetFields(['username', 'password', 'hostname', 'port', 'name']);
    } else {
      form.resetFields(['dbUrl']);
    }
  };

  const onTestConnection = async () => {
    setTestLoading(true);

    let dbUrl = '';

    if (isDbUrl) {
      dbUrl = form.getFieldValue('dbUrl');
    } else {
      const { username, password, hostname, port, name } = form.getFieldsValue([
        'username',
        'password',
        'hostname',
        'port',
        'name',
      ]);

      const safeUser = encodeURIComponent(username || '');
      const safePass = encodeURIComponent(password || '');
      const auth = username ? `${safeUser}${password ? `:${safePass}` : ''}@` : '';
      const portPart = port ? `:${port}` : '';
      dbUrl = `pg://${auth}${hostname}${portPart}/${name}`;
    }

    try {
      const parsedUrl = new URL(dbUrl);
      const connectionData = {
        type: form.getFieldValue('dbType'),
        port: parsedUrl.port,
        host: parsedUrl.hostname,
        username: parsedUrl.username,
        password: parsedUrl.password,
        name: parsedUrl.pathname.replace(/^\//, ''),
        ssl: false,
      };

      try {
        await testConnection(connectionData);
        setConnected(true);
        setDbUrl(dbUrl);
      } catch {
        setConnected(false);
      }
    } catch {
      setConnected(false);
    }

    setShowMessage(true);
    setTestLoading(false);
  };

  const confirmDeletion = async () => {
    try {
      await deleteProject(projectId);
      message.success(t('project.main.dbMapping.fallback.actions.delete.success'));
    } catch {
      message.error(t('project.main.dbMapping.fallback.actions.delete.failed'));
    }
    navigate('/');
  };

  const configureOptions: CheckboxGroupProps<boolean>['options'] = [
    { label: t('dashboard.createProject.form.step3.dbCred.configuration.dbUrl'), value: true },
    { label: t('dashboard.createProject.form.step3.dbCred.configuration.manual'), value: false },
  ];

  const breadcrumbItems = [
    { title: <Link to="/">{t('project.breadcrumb.home')}</Link> },
    { title: project?.name || '' },
    { title: <Link to={`/project/settings?id=${projectId}`}>{t('project.breadcrumb.settings')}</Link> },
  ];

  const handleSync = async () => {
    setSyncLoading(true);

    try {
      await form.validateFields();
      if (!isConnected) {
        message.error(t('dashboard.createProject.form.error.invalidDbUrl'));
        return;
      }

      const rawDbUrl = dbUrl?.trim() ?? '';

      const type = form.getFieldValue('dbType') || '';
      const host = form.getFieldValue('hostname') || '';
      const port = form.getFieldValue('port') || '';
      const username = form.getFieldValue('username') || '';
      const password = form.getFieldValue('password') || '';
      const name = form.getFieldValue('name') || '';
      const ssl = form.getFieldValue('ssl') || false;

      let finalUrl = rawDbUrl;
      if (!finalUrl) {
        const built = buildDatabaseUrl({ type, host, port, username, password, name, ssl });
        if (built) {
          finalUrl = built;
        }
      }

      let parsedUrl: URL | null = null;
      if (finalUrl) {
        try {
          parsedUrl = new URL(finalUrl);
        } catch {
          console.warn('Invalid DB URL generated/provided, skipping parsing.');
        }
      }

      const formData = {
        isApproved: true,
        dbDetails: {
          name: name || parsedUrl?.pathname.replace(/^\//, '') || '',
          type: type || (parsedUrl?.protocol.replace(':', '') ?? ''),
          host: host || parsedUrl?.hostname || '',
          port: port || parsedUrl?.port || '',
          url: finalUrl || undefined,
          username: username || parsedUrl?.username || '',
          password: password || parsedUrl?.password || '',
          ssl: ssl || parsedUrl?.searchParams.get('sslmode')?.toLowerCase() !== 'disable' || false,
        },
      };
      console.log('Updating credentials with data:', formData);
      await updateCredentials(formData, projectId);
      message.success(t('project.main.settings.update.success'));
    } catch (err) {
      const error = err as ValidateErrorEntity;
      if (error.errorFields) {
        form.scrollToField(error.errorFields[0].name, {
          behavior: 'smooth',
          block: 'center',
        });
      } else {
        message.error(t('project.main.settings.update.failed'));
      }
    } finally {
      setSyncLoading(false);
    }
  };

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <Breadcrumb separator=">" className="my-4" items={breadcrumbItems} />
      <div className="flex items-start w-full mt-8 pb-4 mb-8 border-b border-grey-3">
        <div className="text-xl font-medium font-sans">{t('project.main.settings.title')}</div>
      </div>
      <div className="mb-10">
        <div className="text-2xl font-medium font-sans text-black">{project?.name}</div>
        <div className="text-base font-light font-inter text-black">
          <span className="font-normal">By: </span>
          {`${project?.university} - ${project?.faculty}`}
        </div>
      </div>

      <Form form={form} layout="vertical" initialValues={{ isDbUrl: true }}>
        <InputLabel
          inputTitle={t('project.main.settings.update.title')}
          inputDescription={t('project.main.settings.update.description')}
        />
        <ModalSelect
          name="dbType"
          inputTitle={t('dashboard.createProject.form.step3.dbType.title')}
          options={dbTypeOptions}
        />
        <FormItem name="isDbUrl">
          <Radio.Group
            className="modal-radio-group"
            options={configureOptions}
            optionType="button"
            buttonStyle="solid"
            onChange={handleIsDbUrlChange}
          />
        </FormItem>
        {isDbUrl ? (
          <>
            <InputLabel
              inputTitle={t('dashboard.createProject.form.step3.dbCred.dbUrl.title')}
              inputDescription={t('dashboard.createProject.form.step3.dbCred.dbUrl.description')}
            />
            <Row className="flex justify-between">
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
              <Col span={5} className="flex">
                <Button
                  className="test-conn-btn bg-black border-none text-white flex"
                  loading={isTestLoading}
                  onClick={onTestConnection}
                >
                  {t('dashboard.createProject.form.step3.dbCred.testConnection.label')}
                  <IoChevronForwardOutline />
                </Button>
              </Col>
            </Row>
            <div className="mt-1">
              {isConnected ? (
                <div className="text-sm text-success flex">
                  {t('dashboard.createProject.form.step3.dbCred.testConnection.success')}
                  <FaRegCircleCheck className="ml-2 mt-1" />
                </div>
              ) : showMessage ? (
                <div className="text-sm text-error flex">
                  {t('dashboard.createProject.form.step3.dbCred.testConnection.failed')}
                  <PiWarningBold className="ml-2 mt-1" />
                </div>
              ) : null}
            </div>
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
            <Button
              className="test-conn-btn bg-black border-none text-white flex"
              loading={isTestLoading}
              onClick={onTestConnection}
            >
              {t('dashboard.createProject.form.step3.dbCred.testConnection.label')}
              <IoChevronForwardOutline />
            </Button>
            <div className="mt-1">
              {isConnected ? (
                <div className="text-sm text-success flex">
                  {t('dashboard.createProject.form.step3.dbCred.testConnection.success')}
                  <FaRegCircleCheck className="ml-2 mt-1" />
                </div>
              ) : showMessage ? (
                <div className="text-sm text-error flex">
                  {t('dashboard.createProject.form.step3.dbCred.testConnection.failed')}
                  <PiWarningBold className="ml-2 mt-1" />
                </div>
              ) : null}
            </div>
          </>
        )}
      </Form>
      <Button
        className="flex items-center w-72 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white mt-8"
        type="primary"
        onClick={handleSync}
        loading={isSyncLoading}
      >
        {t('project.main.settings.update.button')}
      </Button>

      <div className="border-2 border-red-300 border-solid rounded-xl mt-8 p-8">
        <InputLabel
          inputTitle={t('project.main.settings.delete.title')}
          inputDescription={t('project.main.settings.delete.description')}
        />
        <Popconfirm
          placement="bottom"
          title={t('project.main.dbMapping.fallback.actions.delete.confirm.title')}
          description={t('project.main.dbMapping.fallback.actions.delete.confirm.description')}
          okText="Yes"
          cancelText="No"
          onConfirm={confirmDeletion}
          icon={<BsFillQuestionCircleFill color="#ff4d4f" size={16} className="mr-2 mt-0.5" />}
        >
          <Button type="primary" danger icon={<AiFillDelete />} className="font-medium font-inter h-9 text-xs">
            {t('project.main.dbMapping.fallback.actions.delete.title')}
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default SettingsPage;
