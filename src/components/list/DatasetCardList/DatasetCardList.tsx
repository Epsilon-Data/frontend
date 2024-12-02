import { BaseList } from '@app/components/common/BaseList/BaseList';
import { DatasetListItem, getDatasetList, Pagination } from '@app/api/datasets.api';
import { useTranslation } from 'react-i18next';
import { useCallback, useState, useEffect } from 'react';
import { Card } from 'antd';
import * as S from './DatasetCardList.styles';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useNavigate } from 'react-router-dom';
import { useMounted } from '@app/hooks/useMounted';

const { Meta } = Card;
const initialPagination: Pagination = {
  current: 1,
  pageSize: 6,
};

export const DatasetCardList: React.FC = () => {
  const [listData, setListData] = useState<{ data: DatasetListItem[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMounted } = useMounted();

  const fetch = useCallback(
    (pagination: Pagination) => {
      setListData((listData) => ({ ...listData, loading: true }));
      getDatasetList(pagination).then((res) => {
        if (isMounted.current) {
          setListData({ data: res.data, pagination: res.pagination, loading: false });
        }
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handlePaginationChange = (page: number) => {
    setListData((listData) => ({ ...listData, pagination: { ...listData.pagination, current: page } }));
  };

  return (
    <BaseList
      grid={{ gutter: 16, column: 2 }}
      pagination={{ ...listData.pagination, onChange: handlePaginationChange }}
      loading={listData.loading}
      dataSource={listData.data}
      renderItem={(item) => (
        <BaseList.Item>
          <S.CardItem>
            <Meta
              style={{ lineHeight: '1.1rem' }}
              title={item.projectName}
              description={`Project ID: ${item.projectCustomId}`}
            />
            <div style={{ marginTop: '1.5rem', lineHeight: '0.5rem' }}>
              <p>{`Connect Date: ${item.connectDate}`}</p>
            </div>
            <BaseButton
              style={{ marginTop: '1rem', float: 'right' }}
              type="primary"
              onClick={() => navigate('/datasets/analysis/' + item.id)}
            >
              {t('dataset.analyseData')}
            </BaseButton>
          </S.CardItem>
        </BaseList.Item>
      )}
    />
  );
};
