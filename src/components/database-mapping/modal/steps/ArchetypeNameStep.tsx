import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { Form, FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';

type ArchetypeNameStepProps = {
  form: FormInstance<unknown>;
};
export const ArchetypeNameStep = ({ form }: ArchetypeNameStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form}>
        <ModalInput
          name="name"
          inputTitle={t('project.createTemplate.form.step1.name.title')}
          inputDescription={t('project.createTemplate.form.step1.name.description')}
        />
      </Form>
    </div>
  );
};
