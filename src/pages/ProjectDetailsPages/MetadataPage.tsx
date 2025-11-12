import { DetailsRow } from '@app/components/browse-projects/modal/pages/AboutDatasetPage/components/DetailsRow';
import { MetadataTabs } from '@app/components/metadata-summary/MetadataTabs';
import { DATE_FORMAT } from '@app/constants/database';
import { useMetadata } from '@app/hooks/useMetadata';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const MetadataPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const { t } = useTranslation();
  const { info, diagramCode, selectItems, tableInfo, loading, fetchMetadata } = useMetadata(projectId);

  useEffect(() => {
    const controller = new AbortController();
    fetchMetadata();
    return () => controller.abort();
  }, [fetchMetadata]);

  return (
    <Spin spinning={loading}>
      <div className="py-3 px-4 md:py-5 md:px-9">
        <div className="flex items-start w-full mt-8 pb-4 mb-4 border-b border-grey-3">
          <div className="text-xl font-medium font-sans">{t('project.main.metadata.title')}</div>
        </div>
        <DetailsRow
          titleWidth={6}
          title={t('project.main.metadata.created')}
          content={dayjs(info.created).format(DATE_FORMAT) || '-'}
        />
        <DetailsRow
          titleWidth={6}
          title={t('project.main.metadata.count.schema')}
          content={info.schemaCount?.toString() || '-'}
        />
        <DetailsRow
          titleWidth={6}
          title={t('project.main.metadata.count.table')}
          content={info.totalTableCount?.toString() || '-'}
        />
        <DetailsRow
          titleWidth={6}
          title={t('project.main.metadata.count.column')}
          content={info.totalColCount?.toString() || '-'}
        />
        <MetadataTabs erd={diagramCode} selectItems={selectItems} tableInfo={tableInfo} />
      </div>
    </Spin>
  );
};

export default MetadataPage;
