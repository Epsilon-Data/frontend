import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { Form, FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';

type ArchetypeNameStepProps = {
  form: FormInstance<unknown>;
};
export const ArchetypeNameStep = ({ form }: ArchetypeNameStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="h-full py-12 px-20 overflow-y-auto flex flex-col items-center justify-center">
      <Form form={form} className="w-full max-w-lg">
        <ModalInput
          name="name"
          inputTitle={t('project.createTemplate.form.step1.name.title')}
          inputDescription={t('project.createTemplate.form.step1.name.description')}
        />
      </Form>
    </div>
  );
};
