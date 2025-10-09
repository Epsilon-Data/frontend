import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';
import { NumberedFormItem } from '@app/components/common/Modal/NumberedFormItem/NumberedFormItem';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Form, FormInstance, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { DetailsRow } from './AboutDatasetPage/components/DetailsRow';
import { InputLabel } from '@app/components/common/Modal/InputLabel/InputLabel';
import { ProjectInfo } from '@app/api/projects.api';
import { ModalDatePicker } from '@app/components/common/Modal/ModalDatePicker/ModalDatePicker';
import { ModalEmailTag } from '@app/components/common/Modal/ModalEmailTag/ModalEmailTag';

export type RequestAccessPageProps = {
  project: ProjectInfo;
  form: FormInstance<unknown>;
  members: string[];
  setMembers: React.Dispatch<React.SetStateAction<string[]>>;
};

export const RequestAccessPage = ({ project, form, members, setMembers }: RequestAccessPageProps) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="-mt-8">
      <Row className="bg-grey-4 rounded-t-3xl">
        <div className="pt-12 pb-6 pr-16 pl-20 text-lg">{t('browse.createRequest.form.title')}</div>
      </Row>
      <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
        <Form form={form} className="h-full">
          <div className="mb-20">
            <div className="font-medium font-sans text-grey-1 text-xl">{project.name}</div>
            <div className="text-base font-light font-inter text-black">
              <span className="font-normal">By: </span>
              {`${project.university} - ${project.faculty}`}
            </div>
          </div>
          <hr className="mb-8 border-grey-2" />
          <NumberedFormItem number={1}>
            <InputLabel
              inputTitle={t('browse.createRequest.form.requestor.title')}
              inputDescription={t('browse.createRequest.form.requestor.description')}
            />
            <div className="mb-12">
              <DetailsRow
                title={t('browse.createRequest.form.requestor.firstName')}
                content={user?.firstName || ''}
                titleWidth={7}
                contentWidth={15}
              />
              <DetailsRow
                title={t('browse.createRequest.form.requestor.lastName')}
                content={user?.lastName || ''}
                titleWidth={7}
                contentWidth={15}
              />
              <DetailsRow
                title={t('browse.createRequest.form.requestor.position')}
                content={''}
                titleWidth={7}
                contentWidth={15}
              />
              <DetailsRow
                title={t('browse.createRequest.form.requestor.email')}
                content={user?.email.name || ''}
                titleWidth={7}
                contentWidth={15}
              />
              <DetailsRow
                title={t('browse.createRequest.form.requestor.orgName')}
                content={''}
                titleWidth={7}
                contentWidth={15}
              />
            </div>
          </NumberedFormItem>
          <NumberedFormItem number={2} showDivider={false}>
            <InputLabel
              inputTitle={t('browse.createRequest.form.project.title')}
              inputDescription={t('browse.createRequest.form.project.description')}
            />
            <ModalInput
              placeholder={t('browse.createRequest.form.project.name.placeholder')}
              name="projectName"
              inputTitle={t('browse.createRequest.form.project.name.title')}
              className="mb-0"
              labelLarge={false}
            />
            <ModalDatePicker
              startName="projectStartDate"
              endName="projectEndDate"
              inputTitle={t('browse.createRequest.form.project.duration')}
              labelLarge={false}
            />
            <ModalInput
              placeholder={t('browse.createRequest.form.project.describe.placeholder')}
              name="projectDescription"
              inputTitle={t('browse.createRequest.form.project.describe.title')}
              className="mb-0"
              labelLarge={false}
            />
            <ModalInput
              placeholder={t('browse.createRequest.form.project.ethics.placeholder')}
              name="projectEthicsId"
              inputTitle={t('browse.createRequest.form.project.ethics.title')}
              className="mb-0"
              labelLarge={false}
            />
            <ModalInput
              placeholder={t('browse.createRequest.form.project.objective.placeholder')}
              name="projectObjective"
              inputTitle={t('browse.createRequest.form.project.objective.title')}
              className="mb-0"
              labelLarge={false}
            />
            <ModalInput
              placeholder={t('browse.createRequest.form.project.outcome.placeholder')}
              name="projectOutcome"
              inputTitle={t('browse.createRequest.form.project.outcome.title')}
              className="mb-0"
              labelLarge={false}
            />
            <ModalEmailTag
              name="projectMembers"
              inputTitle={t('browse.createRequest.form.project.members.title')}
              selectProps={{ placeholder: t('browse.createRequest.form.project.members.placeholder') }}
              value={members}
              setValue={setMembers}
              labelLarge={false}
            />
          </NumberedFormItem>
        </Form>
      </div>
    </div>
  );
};
