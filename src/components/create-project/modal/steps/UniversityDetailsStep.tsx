import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { NumberedFormItem } from '@app/components/common/Modal/NumberedFormItem/NumberedFormItem';
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
        <NumberedFormItem number={1}>
          <ModalInput
            placeholder={t('dashboard.createProject.form.step2.university.placeholder')}
            name="university"
            inputTitle={t('dashboard.createProject.form.step2.university.title')}
          />
        </NumberedFormItem>
        <NumberedFormItem number={2}>
          <ModalInput
            placeholder={t('dashboard.createProject.form.step2.faculty.placeholder')}
            name="faculty"
            inputTitle={t('dashboard.createProject.form.step2.faculty.title')}
          />
        </NumberedFormItem>
        <NumberedFormItem number={3} showDivider={false}>
          <ModalInput
            placeholder={t('dashboard.createProject.form.step2.ethicsId.placeholder')}
            name="ethicsId"
            inputTitle={t('dashboard.createProject.form.step2.ethicsId.title')}
          />
        </NumberedFormItem>
      </Form>
    </div>
  );
};
