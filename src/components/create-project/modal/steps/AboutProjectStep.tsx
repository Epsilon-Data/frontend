import KeywordGuidance from '@app/components/common/Modal/KeywordGuidance/KeywordGuidance';
import { ModalDatePicker } from '@app/components/common/Modal/ModalDatePicker/ModalDatePicker';
import { ModalFormList } from '@app/components/common/Modal/ModalFormList/ModalFormList';
import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { ModalNumberInput } from '@app/components/common/Modal/ModalNumberInput/ModalNumberInput';
import { ModalTagInput } from '@app/components/common/Modal/ModalTagInput/ModalTagInput';
import { ModalTextArea } from '@app/components/common/Modal/ModalTextArea/ModalTextArea';
import { NumberedFormItem } from '@app/components/common/Modal/NumberedFormItem/NumberedFormItem';
import { Form, FormInstance } from 'antd';

import { useTranslation } from 'react-i18next';

export type AboutProjectStepProps = {
  form: FormInstance<unknown>;
  dbKeywords: string[];
  setDbKeywords: (keywords: string[]) => void;
};

export const AboutProjectStep = ({ form, dbKeywords, setDbKeywords }: AboutProjectStepProps) => {
  const { t } = useTranslation();

  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form} className="h-full">
        <NumberedFormItem number={1}>
          <ModalInput
            name="name"
            placeholder={t('dashboard.createProject.form.step1.name.placeholder')}
            inputTitle={t('dashboard.createProject.form.step1.name.title')}
            inputDescription={t('dashboard.createProject.form.step1.name.description')}
          />
        </NumberedFormItem>
        <NumberedFormItem number={2}>
          <ModalDatePicker
            rangeName="duration"
            inputTitle={t('dashboard.createProject.form.step1.duration.title')}
            inputDescription={t('dashboard.createProject.form.step1.duration.description')}
          />
        </NumberedFormItem>
        <NumberedFormItem number={3}>
          <ModalTextArea
            placeholder={t('dashboard.createProject.form.step1.description.placeholder')}
            name="description"
            inputTitle={t('dashboard.createProject.form.step1.description.title')}
            inputDescription={t('dashboard.createProject.form.step1.description.description')}
          />
        </NumberedFormItem>
        <NumberedFormItem number={4}>
          <ModalNumberInput
            placeholder={t('dashboard.createProject.form.step1.participantsNum.placeholder')}
            name="participantsNum"
            inputTitle={t('dashboard.createProject.form.step1.participantsNum.title')}
            inputDescription={t('dashboard.createProject.form.step1.participantsNum.description')}
          />
        </NumberedFormItem>
        <NumberedFormItem number={5}>
          <ModalFormList
            name="members"
            inputTitle={t('dashboard.createProject.form.step1.members.title')}
            inputDescription={t('dashboard.createProject.form.step1.members.description')}
            form={form}
            inputProps={{ placeholder: t('dashboard.createProject.form.step1.members.placeholder') }}
          />
        </NumberedFormItem>
        <NumberedFormItem number={6} showDivider={false}>
          <ModalTagInput
            selectProps={{ placeholder: t('dashboard.createProject.form.step1.dbKeywords.placeholder') }}
            name="dbKeywords"
            inputTitle={t('dashboard.createProject.form.step1.dbKeywords.title')}
            inputDescription={t('dashboard.createProject.form.step1.dbKeywords.description')}
            value={dbKeywords}
            setValue={setDbKeywords}
          />
        </NumberedFormItem>
        <KeywordGuidance />
      </Form>
    </div>
  );
};
