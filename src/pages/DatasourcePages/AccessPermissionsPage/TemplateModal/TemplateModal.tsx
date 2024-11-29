import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './TemplateModal.styles';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BsExclamationSquareFill } from 'react-icons/bs';

export const TemplateModal: React.FC<{
  templateNames: { label: string; value: string }[];
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onSelectTemplate: (templateId: string) => void;
}> = ({ templateNames, isModalOpen, setIsModalOpen, onSelectTemplate }) => {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: any) => {
    setSelectedTemplate(value);
  };

  return (
    <S.Modal
      title={templateNames.length > 0 ? t('databaseSources.accessPermissions.templateModal.instruction') : null}
      centered
      onCancel={() => setIsModalOpen(false)}
      open={isModalOpen}
      size="medium"
      footer={
        templateNames.length > 0 ? (
          <BaseButton type="primary" onClick={() => onSelectTemplate(selectedTemplate)}>
            {t('databaseSources.accessPermissions.templateModal.useTemplate')}
          </BaseButton>
        ) : null
      }
    >
      {templateNames.length > 0 ? (
        <BaseForm style={{ display: 'flex', flexDirection: 'column' }}>
          <BaseSelect
            style={{ width: '70%', marginBottom: '1rem' }}
            placeholder={t('databaseSources.accessPermissions.templateModal.placeholder')}
            options={templateNames}
            onChange={handleChange}
          />
        </BaseForm>
      ) : (
        <S.MessageWrapper>
          <BsExclamationSquareFill style={{ width: '20%', height: '20%' }} />
          <S.Message style={{ color: 'var(--red)', marginTop: '1rem' }}>
            {t('databaseSources.accessPermissions.templateModal.noTemplatesTitle')}
          </S.Message>
          <S.Message style={{ marginBottom: '0.5rem' }}>
            {t('databaseSources.accessPermissions.templateModal.noTemplatesMessage')}
          </S.Message>
        </S.MessageWrapper>
      )}
    </S.Modal>
  );
};
