import { DetailsRow } from '@app/components/browse-projects/modal/pages/AboutDatasetPage/components/DetailsRow';
import { MetadataTabs } from '@app/components/metadata-summary/MetadataTabs';
import { DATE_FORMAT } from '@app/constants/database';
import { useMetadata } from '@app/hooks/useMetadata';
import { useProjectContext } from '@app/hooks/useProjectContext';
import { Breadcrumb, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

const MetadataPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const { t } = useTranslation();
  const { info, diagramCode, selectItems, tableInfo, loading, fetchMetadata } = useMetadata(projectId);
  const { project } = useProjectContext();

  const DB_STATUS = {
    CONNECTED: { text: 'Connected', color: 'green' },
    OUTDATED: { text: 'Outdated', color: 'orange' },
  } as const;

  useEffect(() => {
    const controller = new AbortController();
    fetchMetadata();
    return () => controller.abort();
  }, [fetchMetadata]);

  const breadcrumbItems = [
    { title: <Link to="/">{t('project.breadcrumb.home')}</Link> },
    { title: project?.name || '' },
    { title: <Link to={`/project/details?id=${projectId}`}>{t('project.breadcrumb.projectDetails')}</Link> },
  ];

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <Breadcrumb separator=">" className="my-4" items={breadcrumbItems} />
      <Spin spinning={loading}>
        <div className="flex items-start w-full mt-8 pb-4 mb-4 border-b border-grey-3">
          <div className="text-xl font-medium font-sans">{t('project.main.details.title')}</div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <DetailsRow title={t('project.main.details.name')} titleWidth={6} content={project?.name || '-'} />
          <DetailsRow
            title={t('project.main.details.duration')}
            titleWidth={6}
            content={
              project?.startDate && project?.endDate
                ? `${dayjs(project.startDate).format(DATE_FORMAT)} - ${dayjs(project.endDate).format(DATE_FORMAT)}`
                : '-'
            }
          />
          <DetailsRow
            title={t('project.main.details.description')}
            titleWidth={6}
            content={project?.description || '-'}
          />
          <DetailsRow
            title={t('project.main.details.participantsNum')}
            titleWidth={6}
            content={project?.participantsNum?.toString() || '-'}
          />
          <DetailsRow
            title={t('project.main.details.keywords')}
            titleWidth={6}
            content={project?.dbKeywords?.length ? project.dbKeywords.join(', ') : '-'}
          />
          <DetailsRow
            title={t('project.main.details.university')}
            titleWidth={6}
            content={project?.university || '-'}
          />
          <DetailsRow title={t('project.main.details.faculty')} titleWidth={6} content={project?.faculty || '-'} />
          <DetailsRow title={t('project.main.details.ethics')} titleWidth={6} content={project?.ethicsId || '-'} />
          <DetailsRow
            title={t('project.main.details.databaseStatus')}
            titleWidth={6}
            content={
              <Tag variant="solid" color={DB_STATUS.CONNECTED.color}>
                {DB_STATUS.CONNECTED.text}
              </Tag>
            }
          />
        </div>
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
      </Spin>
    </div>
  );
};

export default MetadataPage;
