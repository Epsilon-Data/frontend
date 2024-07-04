/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import * as S from './Descriptive.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useTranslation } from 'react-i18next';
import { CALC_OPTIONS, VAR_OPTIONS } from '@app/constants/datasets';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { Space, Table } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { notificationController } from '@app/controllers/notificationController';
import { DescriptiveAnalysis } from '@app/interfaces/interfaces';
import { useParams } from 'react-router-dom';
import { getDescriptive } from '@app/api/datasets.api';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Descriptive: React.FC<{ lookup: any[] }> = ({ lookup }) => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [selectedVars, setSelectedVars] = useState<string[]>([]);
  const [hidden, setHidden] = useState(true);
  const [varTypes, setVarTypes] = useState<{ name: string; type: string; table: string }[]>([]);
  const [calculations, setCalculations] = useState<string[]>([]);
  const [output, setOutput] = useState<string>('');

  const handleVarSelectChange = (value: any) => {
    setSelectedVars(value);
  };

  const compileTableVar = (value: any) => {
    return value.map((item: string, index: number) => ({
      key: index + 1,
      name: item,
      description: 'Testing for the description value',
    }));
  };

  const findVarType = (name: string) => {
    const filteredVarTypes = varTypes.filter((varType) => selectedVars.includes(varType.name));
    for (let i = 0; i < filteredVarTypes.length; i++) {
      if (filteredVarTypes[i].name == name) return filteredVarTypes[i].type;
    }
    return '';
  };

  const options = Object.keys(lookup).map((item) => ({
    value: item,
    label: item,
    table: lookup[item as any],
  }));

  const handleOnClick = () => {
    setHidden(true);
    const filteredVarTypes = varTypes.filter((varType) => selectedVars.includes(varType.name));
    const containsOrd = filteredVarTypes.some((varType) => varType.type === 'ord');

    if (selectedVars.length === 0) {
      notificationController.error({ message: t('dataset.standard.descriptive.selectVarNotify') });
    } else if (filteredVarTypes.length !== selectedVars.length) {
      notificationController.error({ message: t('dataset.standard.descriptive.selectVarTypeNotify') });
    } else if (calculations.length === 0 && containsOrd) {
      notificationController.error({ message: t('dataset.standard.descriptive.selectCalcNotify') });
    } else {
      const filteredVarTypes = varTypes.filter((varType) => selectedVars.includes(varType.name));
      if (filteredVarTypes.length !== selectedVars.length) {
        notificationController.error({ message: t('dataset.standard.descriptive.selectVarTypeNotify') });
      } else {
        const analysis: DescriptiveAnalysis = {
          id: id ?? '',
          variables: filteredVarTypes,
          calculate: calculations,
        };
        getDescriptive(analysis)
          .then((res) => {
            setOutput(res);
            setHidden(false);
          })
          .catch(() => {
            notificationController.error({ message: t('dataset.standard.descriptive.failNotify') });
          });
      }
    }
  };

  const handleTypeChange = (columnName: string, columnT: string) => {
    const column = columnName;
    const columnType = columnT;
    const table = lookup[column as any];

    if (column) {
      setVarTypes((prev) => {
        const index = prev.findIndex((varType) => varType.name === column);
        if (index !== -1) {
          const updatedVarTypes = [...prev];
          updatedVarTypes[index] = { ...updatedVarTypes[index], type: columnType };
          return updatedVarTypes;
        } else {
          return [...prev, { name: column, type: columnType, table: table }];
        }
      });
    }
  };

  const handleCalculateChange = (list: CheckboxValueType[]) => {
    setCalculations(list as string[]);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: any) => <span>{text}</span>,
    },

    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'Type',
      key: 'type',
      dataIndex: 'type',
      render: (type: any, record: any) => (
        <>
          {VAR_OPTIONS.map((item: any) => (
            <S.Tag
              key={item.label}
              className={findVarType(record['name']) == item.label.slice(0, 3).toLowerCase() ? 'selected' : ''}
              onClick={() => {
                handleTypeChange(record['name'], item.label.slice(0, 3).toLowerCase());
              }}
            >
              {item.label}
            </S.Tag>
          ))}

          {/* {type.map((tag: any) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })} */}
        </>
      ),
    },
  ];

  // const data: any = [
  //   {
  //     key: '1',
  //     name: 'Variable Name 1',
  //     description: 'This the description for variable name 1 ',
  //   },
  //   {
  //     key: '2',
  //     name: 'Variable Name 2',
  //     description: 'This the description for variable name 1 ',
  //   },
  //   {
  //     key: '3',
  //     name: 'Variable Name 3',
  //     description: 'This the description for variable name 1 ',
  //   },
  // ];

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
              placeholder={t('dataset.standard.descriptive.varPrompt', {
                variable: t('dataset.standard.descriptive.var').toLowerCase(),
              })}
              options={options}
              optionRender={(option) => (
                <Space>
                  <span>{option.data.label}</span>
                  <span style={{ fontSize: '0.7rem', color: 'gray' }}>{option.data.table}</span>
                </Space>
              )}
              onChange={handleVarSelectChange}
            />
          </BaseForm.Item>
          {selectedVars.length > 0 && (
            <>
              <Table columns={columns} dataSource={compileTableVar(selectedVars)} />;
              {/* <S.InputHeader>{t('dataset.standard.descriptive.varType')}</S.InputHeader>
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
              </BaseRow> */}
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
