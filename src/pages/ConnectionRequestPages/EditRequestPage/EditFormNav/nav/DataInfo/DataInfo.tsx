import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { DateRangeInputItem } from '@app/components/request-fields/DateRangeInput/DateRangeInputItem';
import { StringTextAreaItem } from '@app/components/request-fields/StringInput/StringTextAreaItem';
import { TagInputItem } from '@app/components/request-fields/TagInput/TagInputItem';
import { NumberInputItem } from '@app/components/request-fields/NumberInput/NumberInputItem';
import dayjs from 'dayjs';
import { RequestDetails } from '@app/interfaces/interfaces';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { AppDate } from '@app/constants/Dates';

export const DataInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const initialValues = {
    collectionDuration: formValue.dataInfo.collectionDuration.map((date: Date) => dayjs(date)),
    participantsNumber: formValue.dataInfo.participantsNumber,
    description: formValue.dataInfo.description,
    keywords: formValue.dataInfo.keywords,
  };
  const [form] = BaseForm.useForm();
  const [keywords, setKeywords] = useState(initialValues.keywords);
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    const updatedRequest = {
      ...formValue,
      dataInfo: {
        collectionDuration: allValues.collectionDuration.map((appDate: AppDate) => dayjs(appDate).toDate()),
        participantsNumber: allValues.participantsNumber,
        description: allValues.description,
        keywords: keywords,
      },
    };
    setFormValue(updatedRequest);
  };

  return (
    <BaseForm
      form={form}
      name="databaseInfo"
      initialValues={initialValues}
      style={{ width: '80%' }}
      onValuesChange={handleFormValueChange}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseButtonsForm.Item style={{ marginTop: '1rem' }}>
            <BaseButtonsForm.Title>{t('connectionRequests.details.dataInfo.title')}</BaseButtonsForm.Title>
          </BaseButtonsForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <DateRangeInputItem
            name="collectionDuration"
            label={t('connectionRequests.details.dataInfo.collectionDuration')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <NumberInputItem
            name="participantsNumber"
            label={t('connectionRequests.details.dataInfo.participantsNumber')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <StringTextAreaItem
            name="description"
            label={t('connectionRequests.details.dataInfo.description')}
            required
          />
        </BaseCol>

        <BaseCol span={24}>
          <TagInputItem
            name="keywords"
            label={t('connectionRequests.details.dataInfo.keywords')}
            tags={keywords || []}
            prompt={t('connectionRequests.details.dataInfo.addKeywords')}
            onTagsChange={setKeywords}
            required
          />
        </BaseCol>
      </BaseRow>
    </BaseForm>
  );
};
