import React, { useState } from 'react';
import * as S from './Regression.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useTranslation } from 'react-i18next';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Regression: React.FC<{ columns: string[] }> = ({ columns }) => {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(true);

  const options = columns.map((item) => ({
    value: item,
    label: item,
  }));

  const handleOnClick = () => {
    setHidden(false);
  };

  return (
    <>
      {' '}
      <BaseForm>
        <BaseCol span={24}>
          <BaseForm.Item
            name={'dependentVar'}
            label={t('dataset.standard.descriptive.dependentVar')}
            rules={[{ required: false }]}
            style={{ marginBottom: '2rem', width: '80%' }}
          >
            <BaseSelect
              width={120}
              placeholder={t('dataset.standard.descriptive.prompt', {
                variable: t('dataset.standard.descriptive.dependentVar').toLowerCase(),
              })}
              options={options}
            />
          </BaseForm.Item>
          <BaseForm.Item
            name={'independentVar'}
            label={t('dataset.standard.descriptive.independentVar')}
            rules={[{ required: false }]}
            style={{ marginBottom: '2rem', width: '80%' }}
          >
            <S.MultiSelect
              mode="multiple"
              width={120}
              placeholder={t('dataset.standard.descriptive.prompt', {
                variable: t('dataset.standard.descriptive.independentVar').toLowerCase(),
              })}
              options={options}
            />
          </BaseForm.Item>
        </BaseCol>
      </BaseForm>
      <BaseButton type="primary" onClick={handleOnClick}>
        {t('dataset.standard.descriptive.generate')}
      </BaseButton>
      {!hidden && <S.SectionHeader>{t('dataset.standard.descriptive.output')}</S.SectionHeader>}
    </>
  );
};
