import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './DatasetInfoPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { CgEnter } from 'react-icons/cg';
import { Flex, Space, Tabs, Tag, Typography } from 'antd';
import { InfoSectionHeader } from '@app/components/display-info/InfoSectionHeader';
import { InfoItem } from '@app/components/display-info/InfoItem';
import { ProjectDetails } from './ProjectDetails/ProjectDetails';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import { PermissionNode } from '@app/components/reactflow-components/PermissionNode/PermissionNode';
import { MapEdge } from '@app/components/reactflow-components/MapEdge/MapEdge';
import 'reactflow/dist/style.css';
import { useMounted } from '@app/hooks/useMounted';
import { ProjectInfo, getProjectDetails } from '@app/api/browseDatasets.api';
import { DATE_FORMAT, INITIAL_DETAIL_VALUES } from '@app/constants/browseDatasets';
import { format } from 'date-fns';
import { useAppSelector } from '@app/hooks/reduxHooks';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tableau: any;
  }
}

const { tableau } = window;

const DatasetSummaryPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const navigate = useNavigate();
  const [visList, setVisList] = useState<{ title: string; url: string }[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectInfo>(INITIAL_DETAIL_VALUES);
  const user = useAppSelector((state) => state.user.user);

  const nodeTypes = useMemo(
    () => ({ object: PermissionNode, category: PermissionNode, subcategory: PermissionNode }),
    [],
  );
  const edgeTypes = useMemo(() => ({ default: MapEdge }), []);

  const tabItems = [
    { label: t('browse.info.details.title'), children: <ProjectDetails info={projectDetails} />, key: 'details' },
    { label: t('browse.info.description'), children: projectDetails?.description, key: 'description' },
  ];

  useEffect(() => {
    getProjectDetails(user?.id, id).then((res) => {
      if (isMounted.current) {
        setProjectDetails(res);
        setVisList(res.visualisations);
      }
    });
  }, [isMounted, id, user?.id]);

  useEffect(() => {
    const urls = visList.map((item) => item.url);
    const options = {
      hideTabs: true,
    };

    for (let i = 0; i < urls.length; i++) {
      const container = document.getElementById(`vis-${i}`);
      const vizs = new tableau.VizManager.getVizs();
      if (vizs.length > 0) {
        for (let j = 0; j < vizs.length; j++) {
          vizs[j].dispose();
        }
      }
      new tableau.Viz(container, urls[i], options);
    }
  });

  return (
    <>
      <PageTitle>{projectDetails.name}</PageTitle>
      <S.CardWrapper>
        <S.Card id="dataset-summary" title={projectDetails.name} padding="1.25rem 1.25rem 0">
          <BaseRow style={{ width: '100%' }}>
            <BaseCol span={6}>
              <S.OrgLink>{projectDetails.university}</S.OrgLink>
              <S.Text style={{ marginTop: '0.1rem', color: 'var(--text-light-color)' }}>
                {`Last Updated: ${projectDetails.lastUpdated}`}
              </S.Text>
            </BaseCol>
            <BaseCol span={5} offset={13}>
              {!projectDetails.isOwnProject && (
                <S.RequestButton
                  type="primary"
                  key="request"
                  icon={<CgEnter />}
                  onClick={() => navigate(`/browse/access/${id}/dataset`)}
                >
                  {t('browse.info.requestAccess')}
                </S.RequestButton>
              )}
            </BaseCol>
          </BaseRow>
          <BaseRow style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }}>
            <S.InfoHeader>
              <S.Title>{t('browse.info.relatedProject')}</S.Title>
            </S.InfoHeader>
            <Tabs
              style={{ marginTop: '1rem', height: '300px', width: '75%' }}
              defaultActiveKey="1"
              tabPosition="left"
              items={tabItems}
            />
          </BaseRow>
          <S.HorizontalDivider />
          <BaseRow style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }}>
            <S.InfoHeader>
              <S.Title>{t('browse.info.aboutDataset')}</S.Title>
            </S.InfoHeader>
            <InfoSectionHeader text={t('browse.info.description')} />
            <S.Text>{projectDetails.dataDescription}</S.Text>
            {projectDetails.collectionDuration.length > 0 && (
              <InfoItem
                label={t('browse.info.collectionDuration')}
                text={`${format(projectDetails.collectionDuration[0], DATE_FORMAT)} - ${format(
                  projectDetails.collectionDuration[1],
                  DATE_FORMAT,
                )}`}
              />
            )}
            <InfoItem label={t('browse.info.participantsNum')} text={projectDetails.dataParticipantsNum.toString()} />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography.Text strong>{t('browse.info.tags') + ': '}</Typography.Text>
              <Flex gap="4px 3px" wrap="wrap" style={{ marginLeft: '0.5rem' }}>
                {projectDetails.dataKeywords.map((tag) => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </Flex>
            </div>

            {visList.length > 0 && (
              <>
                <InfoSectionHeader text={t('browse.info.visualisations')} />
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                  {visList.map((vis, index) => (
                    <div key={`vis-${index}`}>
                      <S.Text>{vis.title}</S.Text>
                      <div id={`vis-${index}`} style={{ height: '20%' }}></div>
                    </div>
                  ))}
                </Space>
              </>
            )}
          </BaseRow>
          <S.HorizontalDivider />
          <BaseRow style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }}>
            <S.InfoHeader>
              <S.Title>{t('browse.info.datasetArchetype')}</S.Title>
            </S.InfoHeader>
            {projectDetails.archetype ? (
              <ReactFlowProvider>
                <S.MapWrapper>
                  <ReactFlow
                    nodes={projectDetails.archetype.nodes}
                    edges={projectDetails.archetype.edges}
                    edgesUpdatable={false}
                    edgesFocusable={false}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    nodesFocusable={false}
                    draggable={false}
                    zoomOnScroll={false}
                    panOnDrag={false}
                    zoomOnDoubleClick={false}
                    deleteKeyCode={[]}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    nodeOrigin={[0.5, 0.5]}
                    fitView
                    fitViewOptions={{ maxZoom: 1.2 }}
                  ></ReactFlow>
                </S.MapWrapper>
              </ReactFlowProvider>
            ) : (
              <S.Text style={{ marginTop: '1rem' }}>{t('browse.info.noArchetype')}</S.Text>
            )}
          </BaseRow>
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default DatasetSummaryPage;
