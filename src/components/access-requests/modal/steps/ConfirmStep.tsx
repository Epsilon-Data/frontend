import { ModalCheckboxGroup } from '@app/components/common/Modal/ModalCheckboxGroup/ModalCheckboxGroup';
import { Form, FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';

export type ConfirmStepProps = {
  form: FormInstance<unknown>;
};

export const ConfirmStep = ({ form }: ConfirmStepProps) => {
  const { t } = useTranslation();
  const options = [
    { label: t('dashboard.createProject.form.step4.openAccess.criteria.1'), value: '1' },
    { label: t('dashboard.createProject.form.step4.openAccess.criteria.2'), value: '2' },
    { label: t('dashboard.createProject.form.step4.openAccess.criteria.3'), value: '3' },
  ];
  return (
    <div className="h-132 py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form} className="h-full">
        <ModalCheckboxGroup
          name="openAccess"
          inputTitle={t('dashboard.createProject.form.step4.openAccess.title')}
          options={options}
          inputRules={[
            {
              validator: (_, value) => {
                if (!value || value.length !== options.length) {
                  return Promise.reject(new Error(t('dashboard.createProject.form.error.allChecked')));
                }
                return Promise.resolve();
              },
            },
          ]}
        />
      </Form>
    </div>
  );
};
