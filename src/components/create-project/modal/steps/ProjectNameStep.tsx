import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { Form, FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';

type ProjectNameStepProps = {
  form: FormInstance<unknown>;
};
export const ProjectNameStep = ({ form }: ProjectNameStepProps) => {
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
