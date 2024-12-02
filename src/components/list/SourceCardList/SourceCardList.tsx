/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseList } from '@app/components/common/BaseList/BaseList';
import { SourceListItem, getSourceList, Pagination, Tag, updateCrawlStatus } from '@app/api/datasources.api';
import { useTranslation } from 'react-i18next';
import { useMounted } from '@app/hooks/useMounted';
import { useCallback, useState, useEffect } from 'react';
import { Card } from 'antd';
import * as S from './SourceCardList.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Status } from '@app/components/status/Status';
import { defineColorByPriority } from '@app/utils/utils';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseProgress } from '@app/components/common/BaseProgress/BaseProgress';
import { useNavigate } from 'react-router-dom';
import WebSocketService from '@app/services/webSocket.service';

const { Meta } = Card;
const initialPagination: Pagination = {
  current: 1,
  pageSize: 6,
};

export const SourceCardList: React.FC = () => {
  const [statusData, setStatusData] = useState<Record<string, { crawlStatus: Tag; percent: number; msg: string }>>({});
  const [listData, setListData] = useState<{ data: SourceListItem[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const navigate = useNavigate();

  const fetch = useCallback(
    (pagination: Pagination) => {
      setListData((listData) => ({ ...listData, loading: true }));
      getSourceList(pagination).then((res) => {
        if (isMounted.current) {
          setListData({ data: res.data, pagination: res.pagination, loading: false });
          const updatedStatusData = res.data.reduce(
            (acc, item) => {
              acc[item.dbId] = {
                crawlStatus: item.crawlStatus,
                percent: item.statusPercent,
                msg: item.statusMsg,
              };
              return acc;
            },
            {} as Record<string, { crawlStatus: Tag; percent: number; msg: string }>,
          );

          setStatusData(updatedStatusData);
        }
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  useEffect(() => {
    WebSocketService.listenToDatabaseStatuses((data) => {
      const updatedStatusData = listData.data.reduce(
        (acc, item) => {
          const status = data.results.find((status: { id: any }) => status.id === item.dbId);
          acc[item.dbId] = {
            crawlStatus: status ? updateCrawlStatus(status.crawlStatus) : item.crawlStatus,
            percent: status ? status.statusPercent : 0,
            msg: status ? status.statusMsg : null,
          };
          return acc;
        },
        {} as Record<string, { crawlStatus: Tag; percent: number; msg: string }>,
      );

      setStatusData(updatedStatusData);
    });
  }, [listData.data]);

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
              <p>{`Database Name: ${item.databaseName}`}</p>
              <p>{`Connect Date: ${item.connectDate}`}</p>
              <p>Status:</p>
              <BaseRow gutter={[10, 10]}>
                <BaseCol key={item.dbId} style={{ flex: 0.3 }}>
                  <Status
                    color={defineColorByPriority(statusData[item.dbId].crawlStatus.priority)}
                    text={statusData[item.dbId].crawlStatus.value.toUpperCase()}
                  />
                </BaseCol>
              </BaseRow>
            </div>
            {statusData[item.dbId].crawlStatus.value == 'Crawling' && (
              <>
                <BaseProgress
                  percent={statusData[item.dbId].percent}
                  status="active"
                  strokeColor={'var(--collapse-background-color)'}
                />
                <p>{statusData[item.dbId].msg}</p>
              </>
            )}
            <BaseButton
              style={{ marginTop: '1rem', float: 'right' }}
              type="primary"
              onClick={() => navigate('/database-sources/metadata/' + item.projectId)}
              disabled={statusData[item.dbId].crawlStatus.value !== 'Active'}
            >
              {t('databaseSources.manage')}
            </BaseButton>
          </S.CardItem>
        </BaseList.Item>
      )}
    />
  );
};
