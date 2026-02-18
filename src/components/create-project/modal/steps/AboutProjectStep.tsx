import KeywordGuidance from '@app/components/common/Modal/KeywordGuidance/KeywordGuidance';
import { ModalDatePicker } from '@app/components/common/Modal/ModalDatePicker/ModalDatePicker';
import { ModalFormList } from '@app/components/common/Modal/ModalFormList/ModalFormList';
import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { ModalNumberInput } from '@app/components/common/Modal/ModalNumberInput/ModalNumberInput';
import { ModalTagInput } from '@app/components/common/Modal/ModalTagInput/ModalTagInput';
import { ModalTextArea } from '@app/components/common/Modal/ModalTextArea/ModalTextArea';
import { NumberedFormItem } from '@app/components/common/Modal/NumberedFormItem/NumberedFormItem';
import { Form, FormInstance, Switch } from 'antd';

import { useTranslation } from 'react-i18next';

export type AboutProjectStepProps = {
  form: FormInstance<unknown>;
  dbKeywords: string[];
  setDbKeywords: (keywords: string[]) => void;
  hideMembers?: boolean;
};

export const AboutProjectStep = ({ form, dbKeywords, setDbKeywords, hideMembers = false }: AboutProjectStepProps) => {
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
        {!hideMembers && (
          <NumberedFormItem number={5}>
            <ModalFormList
              name="members"
              inputTitle={t('dashboard.createProject.form.step1.members.title')}
              inputDescription={t('dashboard.createProject.form.step1.members.description')}
              form={form}
              inputProps={{ placeholder: t('dashboard.createProject.form.step1.members.placeholder') }}
            />
          </NumberedFormItem>
        )}
        <NumberedFormItem number={hideMembers ? 5 : 6} showDivider={false}>
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
        <NumberedFormItem number={hideMembers ? 6 : 7} showDivider={false}>
          <div className="flex items-center justify-between pb-20">
            <div className="flex flex-col">
              <div className="text-sm font-medium font-inter text-black">
                {t('dashboard.createProject.form.step1.isPublic.title')}
              </div>
              <div className="text-xs font-light font-inter text-black mt-1">
                {t('dashboard.createProject.form.step1.isPublic.description')}
              </div>
            </div>
            <Form.Item name="isPublic" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </div>
        </NumberedFormItem>
      </Form>
    </div>
  );
};
