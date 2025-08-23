import KeywordGuidance from '@app/components/common/Modal/KeywordGuidance/KeywordGuidance';
import { ModalDatePicker } from '@app/components/common/Modal/ModalDatePicker/ModalDatePicker';
import { ModalFormList } from '@app/components/common/Modal/ModalFormList/ModalFormList';
import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { ModalTagInput } from '@app/components/common/Modal/ModalTagInput/ModalTagInput';
import { ModalTextArea } from '@app/components/common/Modal/ModalTextArea/ModalTextArea';
import { Form, FormInstance } from 'antd';

import { useTranslation } from 'react-i18next';

type ProjectDetailsStepProps = {
  form: FormInstance<unknown>;
  dbKeywords: string[];
  setDbKeywords: (keywords: string[]) => void;
  members: { email: string; role: string }[];
  setMembers: React.Dispatch<React.SetStateAction<{ email: string; role: string }[]>>;
};

export const ProjectDetailsStep = ({
  form,
  dbKeywords,
  setDbKeywords,
  members,
  setMembers,
}: ProjectDetailsStepProps) => {
  const { t } = useTranslation();

  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <Form form={form} className="h-full">
        <ModalDatePicker
          startName="startDate"
          endName="endDate"
          inputTitle={t('dashboard.createProject.form.step2.duration.title')}
          inputDescription={t('dashboard.createProject.form.step2.duration.description')}
        />
        <ModalTextArea
          name="description"
          inputTitle={t('dashboard.createProject.form.step2.description.title')}
          inputDescription={t('dashboard.createProject.form.step2.description.description')}
        />
        <ModalInput
          name="participantsNum"
          inputTitle={t('dashboard.createProject.form.step2.participantsNum.title')}
          inputDescription={t('dashboard.createProject.form.step2.participantsNum.description')}
        />
        <ModalFormList
          name="members"
          inputTitle={t('dashboard.createProject.form.step2.members.title')}
          inputDescription={t('dashboard.createProject.form.step2.members.description')}
          members={members}
          setMembers={setMembers}
          form={form}
        />
        <ModalTagInput
          name="dbKeywords"
          inputTitle={t('dashboard.createProject.form.step2.dbKeywords.title')}
          inputDescription={t('dashboard.createProject.form.step2.dbKeywords.description')}
          value={dbKeywords}
          setValue={setDbKeywords}
        />
        <KeywordGuidance />
      </Form>
    </div>
  );
};
