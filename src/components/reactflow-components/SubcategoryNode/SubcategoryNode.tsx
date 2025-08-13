import { Position, NodeProps } from 'reactflow';
import { useState } from 'react';
import * as S from './SubcategoryNode.styles';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export type NodeData = {
  label: string;
  availableColumns?: string[];
  onColumnSelect?: (columnName: string) => void;
};

export function SubcategoryNode({ data }: NodeProps<NodeData>) {
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
    if (data.onColumnSelect) {
      data.onColumnSelect(columnName);
    }
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
    <S.SubcategoryNodeWrapper className="subcategory-node" onClick={handleClick}>
      <S.SubcategoryDisplay>{data.label}</S.SubcategoryDisplay>

      <S.SubcategoryHandle type="target" position={Position.Top} />
      <S.SubcategoryHandle type="source" position={Position.Bottom} />

      {showColumnMenu && data.availableColumns && (
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
      )}
    </S.SubcategoryNodeWrapper>
  );
}
