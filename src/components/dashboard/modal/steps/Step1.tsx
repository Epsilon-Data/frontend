import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';

export const Step1 = ({ form }) => {
  const { t } = useTranslation();
  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form}>
        <ModalInput
          name="name"
          inputTitle={t('dashboard.createProject.form.step1.name.title')}
          inputDescription={t('dashboard.createProject.form.step1.name.description')}
          large
        />
      </Form>
    </div>
  );
};
