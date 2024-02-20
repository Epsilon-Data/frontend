import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './RevisionModal.styles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { StringTextAreaItem } from '../StringInput/StringTextAreaItem';
import { notificationController } from '@app/controllers/notificationController';
import { reviseRequest } from '@app/api/connectionRequests.api';

export const RevisionModal: React.FC<{
  requestId: string | undefined;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}> = ({ requestId, isModalOpen, setIsModalOpen }) => {
  const { t } = useTranslation();
  const [revisionDefined, setRevisionDefined] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [form] = BaseForm.useForm();

  const handleSubmit = () => {
    setSubmitLoading(true);
    const revisionInfo = form.getFieldValue('info');
    reviseRequest({ requestId: requestId, revisionInfo: revisionInfo })
      .then(() => {
        notificationController.success({
          message: t('connectionRequests.revision.successNotify'),
        });
      })
      .catch(() => {
        notificationController.error({
          message: t('connectionRequests.revision.failNotify'),
        });
      });
    setSubmitLoading(false);
    setIsModalOpen(false);
  };

  return (
    <S.Modal
      centered
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      size="medium"
      footer={
        <BaseButton type="primary" onClick={handleSubmit} disabled={!revisionDefined} loading={submitLoading}>
          {t('common.submit')}
        </BaseButton>
      }
    >
      <BaseForm form={form}>
        <div style={{ marginBottom: '1rem' }}>
          <S.Instructions>{t('connectionRequests.revision.instruction')}</S.Instructions>
        </div>
        <StringTextAreaItem
          name="info"
          placeholder={t('connectionRequests.revision.placeholder')}
          onChange={(e) => setRevisionDefined(e.target.value.length > 0)}
        />
      </BaseForm>
    </S.Modal>
  );
};
