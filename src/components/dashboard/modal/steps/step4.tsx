import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { ModalSelect } from '@app/components/common/Modal/ModalSelect/ModalSelect';
import { TestConnectionGroup } from '@app/components/common/Modal/TestConnectionGroup/TestConnectionGroup';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';

export const Step4 = ({ form, dbTypeOptions, isConnected, isTestLoading, showMessage, onTestConnection }) => {
  const { t } = useTranslation();
  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form} className="h-full">
        <ModalInput name="dbName" inputTitle={t('dashboard.createProject.form.step4.dbName')} />
        <ModalSelect
          name="dbType"
          inputTitle={t('dashboard.createProject.form.step4.dbType')}
          options={dbTypeOptions}
        />
        <TestConnectionGroup
          inputTitle={t('dashboard.createProject.form.step4.dbUrl.title')}
          inputDescription={t('dashboard.createProject.form.step4.dbUrl.description')}
          connected={isConnected}
          loading={isTestLoading}
          show={showMessage}
          onClick={onTestConnection}
        />
      </Form>
    </div>
  );
};
