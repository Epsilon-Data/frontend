import { DATE_FORMAT } from '@app/constants/archetype';
import { DB_TYPE_LABELS } from '@app/constants/projects';
import { useArchetypes } from '@app/hooks/useArchetypes';
import { useProjectContext } from '@app/hooks/useProjectContext';
import { Col, Row, Skeleton, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DisplayTabs } from './DisplayTabs';

type ArchetypeDetailsProps = {
  projectId: string;
  archetypeId: string;
};

export const ArchetypeDetails = ({ projectId, archetypeId }: ArchetypeDetailsProps) => {
  const { t } = useTranslation();
  const { archetype, fetchArchetype, manageLoading } = useArchetypes(projectId);

  const { project, projectLoading } = useProjectContext();

  useEffect(() => {
    const controller = new AbortController();
    fetchArchetype(archetypeId);
    return () => controller.abort();
  }, [archetypeId, fetchArchetype]);

  if (!project) {
    return <div className="mt-8">{'no project selected'}</div>;
  }

  const spinning = projectLoading || manageLoading;

  return (
    <Spin spinning={spinning}>
      <Row className="text-lg mt-8 mb-6">{t('project.main.dbMapping.table.manage.summary.title')}</Row>
      <Row gutter={[32, 16]}>
        <Col>
          <div>{t('project.main.dbMapping.table.manage.summary.dbName')}</div>
          <div className="font-light">{project.connection.tempDbDetails?.name ?? '-'}</div>
        </Col>
        <Col>
          <div>{t('project.main.dbMapping.table.manage.summary.dbType')}</div>
          <div className="font-light">
            {project.connection.tempDbDetails?.type ? t(DB_TYPE_LABELS[project.connection.tempDbDetails?.type]) : '-'}
          </div>
        </Col>
        <Col>
          <div>{t('project.main.dbMapping.table.lastModified')}</div>
          <div className="font-light">{dayjs(archetype.lastModified).format(DATE_FORMAT)}</div>
        </Col>
      </Row>
      <Row className="mt-24">
        <Col span={24}>
          {!manageLoading ? <DisplayTabs archetype={archetype} /> : <Skeleton active paragraph={{ rows: 6 }} />}
        </Col>
      </Row>
    </Spin>
  );
};
