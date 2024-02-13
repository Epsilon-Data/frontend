import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './ColumnSidebar.styles';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { SearchOutlined } from '@ant-design/icons';

export const ColumnSidebar: React.FC<{ columns: string[]; setColumns: (value: string[]) => void }> = ({
  columns,
  setColumns,
}) => {
  const { t } = useTranslation();
  const [selectedColumns, setSelectedColumns] = useState<Array<CheckboxValueType>>([]);
  const [filteredColumns, setFilteredColumns] = useState<string[]>(columns);

  useEffect(() => {
    setFilteredColumns(columns);
  }, [columns]);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeLabel: string) => {
    let notDragged = [];
    let data = '';
    if (selectedColumns.length == 0) {
      data = JSON.stringify([nodeLabel]);
      notDragged = columns.filter((column) => column !== nodeLabel);
    } else {
      data = JSON.stringify(selectedColumns);
      notDragged = columns.filter((column) => !selectedColumns.includes(column));
    }
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', data);
    setColumns(notDragged);
    setFilteredColumns(notDragged);
    setSelectedColumns([]);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearchChange = (event: any) => {
    const filteredColumns = columns.filter((column) => column.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilteredColumns(filteredColumns);
  };

  const handleCheckboxChange = (checkedValues: Array<CheckboxValueType>) => {
    setSelectedColumns(checkedValues);
  };

  return (
    <S.Sidebar>
      <S.ColumnSearch
        prefix={<SearchOutlined rev={undefined} style={{ marginRight: '0.5rem' }} />}
        placeholder={t('databaseSources.describeDataset.columnSidebar.search')}
        onChange={handleSearchChange}
        allowClear
      />
      <S.ColumnCheckbox.Group style={{ width: '100%' }} onChange={handleCheckboxChange}>
        {filteredColumns.map((columnName, index) => (
          <S.Column
            key={index}
            className="dndnode column"
            onDragStart={(event) => onDragStart(event, columnName)}
            draggable
          >
            <div className="text">
              <S.ColumnCheckbox value={columnName}></S.ColumnCheckbox>
              <span>{columnName}</span>
            </div>
          </S.Column>
        ))}
      </S.ColumnCheckbox.Group>
    </S.Sidebar>
  );
};
