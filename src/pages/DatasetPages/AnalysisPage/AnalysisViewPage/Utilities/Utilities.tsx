import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Utilities.styles';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { Pagination, ScriptInfo } from '@app/api/datasets.api';
import { ColumnsType } from 'antd/lib/table';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Utilities: React.FC<{ info: any; isLoading: boolean }> = ({ info, isLoading }) => {
  const [tableData, setTableData] = useState<{ data: ScriptInfo[]; loading: boolean }>({
    data: info.scripts,
    loading: isLoading,
  });
  const { t } = useTranslation();
  const [packageName, setPackageName] = useState('');

  const handleTableChange = (pagination: Pagination) => {
    setTableData((tableData) => ({ ...tableData, pagination: pagination }));
  };

  const columns: ColumnsType<ScriptInfo> = [
    {
      title: t('dataset.analysis.view.scriptName'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('dataset.analysis.view.executionSettings'),
      dataIndex: 'executionSettings',
      key: 'executionSettings',
      render: (text: string) => <span>{text}</span>,
    },
  ];

  return (
    <S.InfoArea>
      <S.InfoCard title={t('dataset.analysis.view.reviewAndGenerate')}>
        <BaseTable
          columns={columns}
          pagination={false}
          dataSource={tableData.data}
          loading={tableData.loading}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
        <BaseRow style={{ marginTop: '2rem' }}>
          <BaseCol style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} span={5}>
            <S.InputHeader>{t('dataset.analysis.view.packageName')}</S.InputHeader>
          </BaseCol>
          <BaseCol span={19}>
            <BaseInput value={packageName} onChange={(e) => setPackageName(e.target.value)}></BaseInput>
          </BaseCol>
        </BaseRow>
        <BaseRow style={{ margin: '1.5rem 0 1rem' }}>
          <BaseButton type="primary">{t('dataset.analysis.view.generate')}</BaseButton>
        </BaseRow>
      </S.InfoCard>
    </S.InfoArea>
  );
};
