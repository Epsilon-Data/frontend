import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { Form, FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';

type UniversityDetailsStepProps = {
  form: FormInstance<unknown>;
};

export const UniversityDetailsStep = ({ form }: UniversityDetailsStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form} className="h-full">
        <ModalInput name="university" inputTitle={t('dashboard.createProject.form.step3.university')} />
        <ModalInput name="faculty" inputTitle={t('dashboard.createProject.form.step3.faculty')} />
        <ModalInput name="ethicsId" inputTitle={t('dashboard.createProject.form.step3.ethicsId')} />
      </Form>
    </div>
  );
};
