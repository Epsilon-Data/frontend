import React, { useState } from 'react';
import * as S from './Hypothesis.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useTranslation } from 'react-i18next';
import { RadioInputItem } from '@app/components/request-fields/RadioInput/RadioInputItem';
import { ALT_HYPOTHESIS, PARAMETRIC, VAR_OPTIONS } from '@app/constants/datasets';
import { StringInputItem } from '@app/components/request-fields/StringInput/StringInputItem';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Hypothesis: React.FC<{ columns: string[] }> = ({ columns }) => {
  const { t } = useTranslation();
  const [selectedVars, setSelectedVars] = useState<string[]>([]);
  const [hidden, setHidden] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: any) => {
    setSelectedVars(value);
  };

  const handleOnClick = () => {
    setHidden(false);
  };

  const options = columns.map((item) => ({
    value: item,
    label: item,
  }));

  return (
    <>
      <BaseForm>
        <BaseCol span={24}>
          <BaseForm.Item
            name={'var'}
            label={t('dataset.standard.descriptive.var')}
            rules={[{ required: false }]}
            style={{ marginBottom: '2rem', width: '80%' }}
          >
            <S.MultiSelect
              mode="multiple"
              width={120}
              placeholder={t('dataset.standard.descriptive.prompt', {
                variable: t('dataset.standard.descriptive.var').toLowerCase(),
              })}
              options={options}
              onChange={handleChange}
            />
          </BaseForm.Item>
          {selectedVars.length > 0 && (
            <>
              <S.InputHeader>{t('dataset.standard.descriptive.varType')}</S.InputHeader>
              <BaseRow style={{ marginBottom: '2rem', width: '80%' }}>
                {selectedVars.map((item, index) => {
                  return (
                    <BaseCol key={index} span={6}>
                      <BaseForm.Item name={item} label={item} rules={[{ required: false }]}>
                        <S.RadioGroup options={VAR_OPTIONS} />
                      </BaseForm.Item>
                    </BaseCol>
                  );
                })}
              </BaseRow>
            </>
          )}
          <RadioInputItem name={'parametric'} inputs={PARAMETRIC} />
          <RadioInputItem name={'altHypo'} label={t('dataset.standard.hypothesis.altHypo')} inputs={ALT_HYPOTHESIS} />
          <StringInputItem
            name={'sigLvl'}
            label={t('dataset.standard.hypothesis.sigLvl')}
            style={{ marginBottom: '2rem', width: '20%' }}
          />
          <StringInputItem
            name={'testValue'}
            label={t('dataset.standard.hypothesis.testValue')}
            style={{ marginBottom: '2rem', width: '20%' }}
          />
        </BaseCol>
      </BaseForm>
      <BaseButton type="primary" onClick={handleOnClick}>
        {t('dataset.standard.descriptive.generate')}
      </BaseButton>
      {!hidden && <S.SectionHeader>{t('dataset.standard.descriptive.output')}</S.SectionHeader>}
    </>
  );
};
