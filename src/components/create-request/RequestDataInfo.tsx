import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ConnectionRequest } from '@app/interfaces/interfaces';
import { DateRangeInputItem } from './DateRangeInput/DateRangeInputItem';
import { StringTextAreaItem } from './StringInput/StringTextAreaItem';
import { TagInputItem } from './TagInput/TagInputItem';

export const RequestDataInfo: React.FC<{
  formValue: ConnectionRequest;
}> = ({ formValue }) => {
  const { t } = useTranslation();

  return (
    <>
      <BaseCol span={24}>
        <BaseButtonsForm.Item>
          <BaseButtonsForm.Title>{t('connectionRequests.create.dataInfo.title')}</BaseButtonsForm.Title>
        </BaseButtonsForm.Item>
      </BaseCol>

      <BaseCol span={24}>
        <DateRangeInputItem
          name="dataInfo.collectionDuration"
          label={t('connectionRequests.create.dataInfo.collectionDuration')}
        />
      </BaseCol>

      <BaseCol span={24}>
        <StringTextAreaItem name="dataInfo.description" label={t('connectionRequests.create.dataInfo.description')} />
      </BaseCol>

      <BaseCol span={24}>
        <TagInputItem
          name="dataInfo.keywords"
          label={t('connectionRequests.create.dataInfo.keywords')}
          initialTags={formValue.dataInfo.keywords}
          prompt={t('connectionRequests.create.dataInfo.addKeywords')}
        />
      </BaseCol>
    </>
  );
};
