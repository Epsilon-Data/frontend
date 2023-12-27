import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { DateRangeInputItem } from '../request-fields/DateRangeInput/DateRangeInputItem';
import { StringTextAreaItem } from '../request-fields/StringInput/StringTextAreaItem';
import { TagInputItem } from '../request-fields/TagInput/TagInputItem';
import { NumberInputItem } from '../request-fields/NumberInput/NumberInputItem';

export const RequestDataInfo: React.FC<{
  initialKeywords: string[] | undefined;
}> = ({ initialKeywords }) => {
  const { t } = useTranslation();

  return (
    <>
      <BaseCol span={24}>
        <BaseButtonsForm.Item style={{ marginTop: '1rem' }}>
          <BaseButtonsForm.Title>{t('connectionRequests.details.dataInfo.title')}</BaseButtonsForm.Title>
        </BaseButtonsForm.Item>
      </BaseCol>

      <BaseCol span={24}>
        <DateRangeInputItem
          name="dataCollectionDuration"
          label={t('connectionRequests.details.dataInfo.collectionDuration')}
          required
        />
      </BaseCol>

      <BaseCol span={24}>
        <NumberInputItem
          name="dataParticipantsNumber"
          label={t('connectionRequests.details.dataInfo.participantsNumber')}
          required
        />
      </BaseCol>

      <BaseCol span={24}>
        <StringTextAreaItem
          name="dataDescription"
          label={t('connectionRequests.details.dataInfo.description')}
          required
        />
      </BaseCol>

      <BaseCol span={24}>
        <TagInputItem
          name="dataKeywords"
          label={t('connectionRequests.details.dataInfo.keywords')}
          initialTags={initialKeywords || []}
          prompt={t('connectionRequests.details.dataInfo.addKeywords')}
          required
        />
      </BaseCol>
    </>
  );
};
