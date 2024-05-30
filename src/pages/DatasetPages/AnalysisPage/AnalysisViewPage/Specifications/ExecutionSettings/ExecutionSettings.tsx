import React from 'react';
import * as S from './ExecutionSettings.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ExecutionSettings: React.FC = () => {
  const CATEGORY = [
    {
      value: 'category1',
      label: 'Category 1',
    },
    {
      value: 'category2',
      label: 'Category 2',
    },
    {
      value: 'category3',
      label: 'Category 3',
    },
  ];

  return (
    <BaseForm>
      <BaseCol span={24}>
        <BaseForm.Item
          name={'category'}
          label={'Category to generate against'}
          rules={[{ required: true }]}
          style={{ marginBottom: '2rem' }}
        >
          <S.MultiSelect mode="multiple" width={120} placeholder={'Select category/categories'} options={CATEGORY} />
        </BaseForm.Item>
      </BaseCol>
    </BaseForm>
  );
};
