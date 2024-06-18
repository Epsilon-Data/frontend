import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './ColumnSidebar.styles';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { SearchOutlined } from '@ant-design/icons';
import { CheckboxProps } from 'antd';

export const ColumnSidebar: React.FC<{
  columns: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  corrTables: any[];
  reset: boolean;
  setReset: (value: boolean) => void;
  filteredColumns: string[];
  setFilteredColumns: (value: string[]) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}> = ({ columns, corrTables, reset, setReset, filteredColumns, setFilteredColumns, searchValue, setSearchValue }) => {
  const { t } = useTranslation();
  const [selectedColumns, setSelectedColumns] = useState<Array<CheckboxValueType>>([]);
  const checkAll = filteredColumns.length === selectedColumns.length && filteredColumns.length > 0;
  const disableCheckAll = filteredColumns.length === 0;
  const indeterminate = selectedColumns.length > 0 && selectedColumns.length < filteredColumns.length;

  useEffect(() => {
    if (reset) {
      setSelectedColumns([]);
      setReset(false);
    }
  }, [reset, setReset]);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeLabel: string) => {
    const data = JSON.stringify(selectedColumns.length === 0 ? [nodeLabel] : selectedColumns);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', data);
    setSelectedColumns([]);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearchChange = (event: any) => {
    setSearchValue(event.target.value);
    const filteredColumns = columns.filter((column) => column.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilteredColumns(filteredColumns);
  };

  const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
    setSelectedColumns(e.target.checked ? filteredColumns : []);
  };

  const handleCheckboxChange: CheckboxProps['onChange'] = (e) => {
    if (e.target.checked) {
      setSelectedColumns([...selectedColumns, e.target.value]);
    } else {
      setSelectedColumns(selectedColumns.filter((column) => column !== e.target.value));
    }
  };

  return (
    <S.Sidebar>
      <S.ColumnSearch
        prefix={<SearchOutlined rev={undefined} style={{ marginRight: '0.5rem' }} />}
        placeholder={t('databaseSources.describeDataset.columnSidebar.search')}
        onChange={handleSearchChange}
        value={searchValue}
        allowClear
      />
      <S.CheckAllCheckbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
        disabled={disableCheckAll}
      >
        {t('databaseSources.describeDataset.columnSidebar.checkAll')}
      </S.CheckAllCheckbox>
      <S.ColumnCheckboxGroup value={selectedColumns}>
        {filteredColumns.map((columnName, index) => (
          <S.Column
            key={index}
            className="dndnode column"
            onDragStart={(event) => onDragStart(event, columnName)}
            draggable
          >
            <div className="text">
              <S.ColumnCheckbox value={columnName} onChange={handleCheckboxChange}></S.ColumnCheckbox>
              <span>{columnName}</span>
              <span>{corrTables[columnName as string]}</span>
            </div>
          </S.Column>
        ))}
      </S.ColumnCheckboxGroup>
    </S.Sidebar>
  );
};
