/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import * as S from './Descriptive.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useTranslation } from 'react-i18next';
import { CALC_OPTIONS, VAR_OPTIONS } from '@app/constants/datasets';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { RadioChangeEvent } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { notificationController } from '@app/controllers/notificationController';
import { DescriptiveAnalysis } from '@app/interfaces/interfaces';
import { useParams } from 'react-router-dom';
import { getDescriptive } from '@app/api/datasets.api';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';

export const Descriptive: React.FC<{ lookup: any[] }> = ({ lookup }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [selectedVars, setSelectedVars] = useState<string[]>([]);
  const [hidden, setHidden] = useState(true);
  const [varTypes, setVarTypes] = useState<{ name: string; type: string }[]>([]);
  const [calculations, setCalculations] = useState<string[]>([]);
  const [output, setOutput] = useState<string>('');
  const [columnsLoading, setColumnsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [columns, setColumns] = useState<{ value: string; label: string }[]>([]);

  const tableNames = new Set<string>();

  for (const column_name in lookup) {
    tableNames.add(lookup[column_name]);
  }

  const tableOptions = Array.from(tableNames).map((item) => ({
    value: item,
    label: item,
  }));

  const handleVarSelectChange = (value: any) => {
    setSelectedVars(value);
    const filteredVarTypes = varTypes.filter((varType) => selectedVars.includes(varType.name));
    setVarTypes(filteredVarTypes);
  };

  const handleTableSelectChange = (value: any) => {
    setColumnsLoading(true);
    const resCols = Object.keys(lookup).filter((col) => lookup[col as any] === value);
    setColumns(
      resCols.map((item) => ({
        value: item,
        label: item,
      })),
    );
    setColumnsLoading(false);
    setIsDisabled(false);
  };

  const handleOnClick = () => {
    setHidden(true);
    if (selectedVars.length === 0) {
      notificationController.error({ message: t('dataset.standard.descriptive.selectVarNotify') });
    } else if (varTypes.length !== selectedVars.length) {
      notificationController.error({ message: t('dataset.standard.descriptive.selectVarTypeNotify') });
    } else if (calculations.length === 0) {
      notificationController.error({ message: t('dataset.standard.descriptive.selectCalcNotify') });
    } else {
      const analysis: DescriptiveAnalysis = {
        id: id ?? '',
        variables: varTypes,
        calculate: calculations,
      };
      getDescriptive(analysis)
        .then((res) => {
          console.log(res);
          setOutput(res);
          setHidden(false);
        })
        .catch(() => {
          notificationController.error({ message: t('dataset.standard.descriptive.failNotify') });
        });
    }
  };

  const handleTypeChange = (e: RadioChangeEvent) => {
    const column = e.target.name;
    const columnType = e.target.value;

    if (column) {
      setVarTypes((prev) => {
        const index = prev.findIndex((varType) => varType.name === column);
        if (index !== -1) {
          const updatedVarTypes = [...prev];
          updatedVarTypes[index] = { ...updatedVarTypes[index], type: columnType };
          return updatedVarTypes;
        } else {
          return [...prev, { name: column, type: columnType }];
        }
      });
    }
  };

  const handleCalculateChange = (list: CheckboxValueType[]) => {
    setCalculations(list as string[]);
  };

  return (
    <>
      <BaseForm>
        <BaseCol span={24}>
          <BaseForm.Item
            name={'table'}
            label={t('dataset.standard.descriptive.table')}
            rules={[{ required: false }]}
            style={{ marginBottom: '2rem', width: '80%' }}
          >
            <BaseSelect
              width={120}
              placeholder={t('dataset.standard.descriptive.tablePrompt')}
              onChange={handleTableSelectChange}
              loading={columnsLoading}
              options={tableOptions}
            />
          </BaseForm.Item>
          <BaseForm.Item
            name={'var'}
            label={t('dataset.standard.descriptive.var')}
            rules={[{ required: false }]}
            style={{ marginBottom: '2rem', width: '80%' }}
          >
            <S.MultiSelect
              mode="multiple"
              width={120}
              placeholder={t('dataset.standard.descriptive.varPrompt', {
                variable: t('dataset.standard.descriptive.var').toLowerCase(),
              })}
              options={columns}
              disabled={isDisabled}
              onChange={handleVarSelectChange}
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
                        <S.RadioGroup name={item} onChange={handleTypeChange} options={VAR_OPTIONS} />
                      </BaseForm.Item>
                    </BaseCol>
                  );
                })}
              </BaseRow>
            </>
          )}
          <BaseForm.Item
            name={'calculate'}
            label={t('dataset.standard.descriptive.calculate.title')}
            rules={[{ required: false }]}
            style={{ marginBottom: '2rem', width: '80%', display: 'flex', flexWrap: 'wrap' }}
          >
            <S.GroupCheckbox style={{ width: '100%' }} options={CALC_OPTIONS} onChange={handleCalculateChange} />
          </BaseForm.Item>
        </BaseCol>
      </BaseForm>
      <BaseButton type="primary" onClick={handleOnClick}>
        {t('dataset.standard.descriptive.generate')}
      </BaseButton>
      {!hidden && (
        <S.Output>
          <S.SectionHeader>{t('dataset.standard.descriptive.output')}</S.SectionHeader>
          <Markdown remarkPlugins={[remarkGfm]}>{output}</Markdown>
        </S.Output>
      )}
    </>
  );
};
