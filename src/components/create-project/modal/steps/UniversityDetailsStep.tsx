import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { Form, FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';

export type UniversityDetailsStepProps = {
  form: FormInstance<unknown>;
};

export const UniversityDetailsStep = ({ form }: UniversityDetailsStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form} className="h-full">
        <ModalInput
          placeholder={t('dashboard.createProject.form.step3.university.placeholder')}
          name="university"
          inputTitle={t('dashboard.createProject.form.step3.university.title')}
        />
        <ModalInput
          placeholder={t('dashboard.createProject.form.step3.faculty.placeholder')}
          name="faculty"
          inputTitle={t('dashboard.createProject.form.step3.faculty.title')}
        />
        <ModalInput
          placeholder={t('dashboard.createProject.form.step3.ethicsId.placeholder')}
          name="ethicsId"
          inputTitle={t('dashboard.createProject.form.step3.ethicsId.title')}
        />
      </Form>
    </div>
  );
};
