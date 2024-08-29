import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './TableInfoPage.styles';
import { ColumnTableRow, DatabaseTableInfo, getDbTableInfo } from '@app/api/databaseSources.api';
import { useParams } from 'react-router-dom';
import { useMounted } from '@app/hooks/useMounted';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { FaKey } from 'react-icons/fa';

const TableInfoPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const [selectItems, setSelectItems] = useState<{ value: string; label: string }[]>([]);
  const [hideInfo, setHideInfo] = useState(true);
  const [tableInfo, setTableInfo] = useState<DatabaseTableInfo>({} as DatabaseTableInfo);
  const [allTableInfo, setAllTableInfo] = useState<DatabaseTableInfo[]>([]);

  const fetch = useCallback(
    (id: string | undefined) => {
      getDbTableInfo(id).then((res) => {
        if (isMounted.current) {
          const selectItems = res ? res.map((tableInfo) => ({ value: tableInfo.name, label: tableInfo.name })) : [];
          setSelectItems(selectItems);
          setAllTableInfo(res);
        }
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectChange = (value: any) => {
    setTableInfo(allTableInfo.find((i) => i.name === value) || ({} as DatabaseTableInfo));
    setHideInfo(false);
  };

  const columns: ColumnsType<ColumnTableRow> = [
    {
      title: t('databaseSources.metadata.tableInfo.column'),
      dataIndex: 'name',
      render: (text: string, record: ColumnTableRow) => {
        return (
          <span>
            {text}{' '}
            {record.primary && (
              <FaKey style={{ color: 'var(--secondary-color)', position: 'relative', left: '0.3rem', top: '0.1rem' }} />
            )}
          </span>
        );
      },
      sorter: (a, b) => (a.primary === b.primary ? 0 : a.primary ? -1 : 1),
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: t('databaseSources.metadata.tableInfo.dataType'),
      dataIndex: 'type',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('databaseSources.metadata.tableInfo.isNullable'),
      dataIndex: 'nullable',
      render: (nullable: boolean) => <span>{nullable ? 'Yes' : 'No'}</span>,
    },
  ];

  return (
    <>
      <PageTitle>{t('databaseSources.metadata.tableInfo.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card id="metadata" title={t('databaseSources.metadata.tableInfo.title')} padding="1.25rem 1.25rem 0">
          <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
            <BaseCol span={24}>
              <BaseSelect
                width="100%"
                placeholder={t('databaseSources.metadata.tableInfo.selectPrompt')}
                options={selectItems}
                onChange={handleSelectChange}
              />
            </BaseCol>
            <BaseCol span={24} hidden={hideInfo} style={{ paddingLeft: '2rem', paddingTop: '3rem' }}>
              <S.InfoArea>
                <S.Content>{tableInfo.name}</S.Content>
                <S.Header>{t('databaseSources.metadata.tableInfo.colCount')}</S.Header>
                <S.Content>{tableInfo.colCount}</S.Content>
                <S.Header>{t('databaseSources.metadata.tableInfo.schema')}</S.Header>
                <S.Content>{tableInfo.schema}</S.Content>
              </S.InfoArea>
              <BaseTable
                columns={columns}
                dataSource={tableInfo.columns}
                pagination={false}
                style={{ width: '80%' }}
                rowKey={(row) => row.name}
              />
            </BaseCol>
          </BaseRow>
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default TableInfoPage;
