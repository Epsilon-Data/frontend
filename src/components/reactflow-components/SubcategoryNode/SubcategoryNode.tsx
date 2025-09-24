import { Position, NodeProps, NodeToolbar } from 'reactflow';
import { useState } from 'react';
import * as S from './SubcategoryNode.styles';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { NodeLabelData } from '@app/constants/reactflow/types';

export interface SubcatNodeData extends NodeLabelData {
  availableColumns?: string[];
}

export function SubcategoryNode({ data, selected }: NodeProps<SubcatNodeData>) {
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredColumns, setFilteredColumns] = useState<string[]>(data.availableColumns || []);
  const { t } = useTranslation();

  const handleClick = () => {
    if (showColumnMenu) {
      setShowColumnMenu(false);
    } else {
      if (data.availableColumns && data.availableColumns.length > 0) {
        setShowColumnMenu(true);
      }
    }
  };

  const handleColumnSelect = (columnName: string) => {
    console.log('Selected column:', columnName);
    setShowColumnMenu(false);
  };

  const handleSearchChange = (event: { target: { value: string } }) => {
    setSearchValue(event.target.value);
    const filteredColumns = data.availableColumns?.filter((column) =>
      column.toLowerCase().includes(event.target.value.toLowerCase()),
    );
    setFilteredColumns(filteredColumns || []);
  };

  return (
    <S.SubcategoryNodeWrapper className="subcategory-node" onClick={handleClick} $selected={selected}>
      <NodeToolbar position={Position.Right}>
        <S.ColumnSelectMenu>
          <S.ColumnSearch
            prefix={<SearchOutlined rev={undefined} style={{ marginRight: '0.5rem' }} />}
            placeholder={t('databaseSources.describeDataset.columnSidebar.search')}
            onChange={handleSearchChange}
            value={searchValue}
            allowClear
          />
          {filteredColumns.map((columnName, index) => (
            <S.Column key={index} onClick={() => handleColumnSelect(columnName)}>
              <div className="text">
                <span>{columnName}</span>
              </div>
            </S.Column>
          ))}
        </S.ColumnSelectMenu>
      </NodeToolbar>
      <S.SubcategoryDisplay>{data.label}</S.SubcategoryDisplay>
      <S.SubcategoryHandle type="target" position={Position.Bottom} />
    </S.SubcategoryNodeWrapper>
  );
}
