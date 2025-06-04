import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './DatasetInfoPage.styles';
import { useParams } from 'react-router-dom';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Tabs, Typography } from 'antd';
import { InfoSectionHeader } from '@app/components/display-info/InfoSectionHeader';
import { InfoItem } from '@app/components/display-info/InfoItem';
import { ProjectDetails } from './ProjectDetails/ProjectDetails';
import 'reactflow/dist/style.css';
import { useMounted } from '@app/hooks/useMounted';
import { ProjectInfo, getProjectDetails } from '@app/api/projects.api';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tableau: any;
  }
}

const DatasetSummaryPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  // const [visList, setVisList] = useState<{ title: string; url: string }[]>([]);
  const [projectDetails, setProjectDetails] = useState<ProjectInfo>({} as ProjectInfo);

  // const nodeTypes = useMemo(() => createNodeTypes(DefaultNode), []);
  // const edgeTypes = useMemo(() => EDGE_TYPES, []);

  const tabItems = [
    { label: t('browse.info.details.title'), children: <ProjectDetails info={projectDetails} />, key: 'details' },
    { label: t('browse.info.description'), children: projectDetails?.description, key: 'description' },
  ];

  useEffect(() => {
    getProjectDetails(id).then((res) => {
      if (isMounted.current) {
        setProjectDetails(res);
      }
    });
  }, [isMounted, id]);

  useEffect(() => {
    // const urls = visList.map((item) => item.url);
    // const options = {
    //   hideTabs: true,
    // };
    // for (let i = 0; i < urls.length; i++) {
    //   const container = document.getElementById(`vis-${i}`);
    //   const vizs = new tableau.VizManager.getVizs();
    //   if (vizs.length > 0) {
    //     for (let j = 0; j < vizs.length; j++) {
    //       vizs[j].dispose();
    //     }
    //   }
    //   new tableau.Viz(container, urls[i], options);
    // }
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
                {`Last Updated: ${projectDetails.endDate}`}
              </S.Text>
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
            <S.Text>{projectDetails.description}</S.Text>
            <InfoItem label={t('browse.info.participantsNum')} text={projectDetails.dbParticipantsNum.toString()} />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography.Text strong>{t('browse.info.tags') + ': '}</Typography.Text>
            </div>
          </BaseRow>
          <S.HorizontalDivider />
          <BaseRow style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column' }}>
            <S.InfoHeader>
              <S.Title>{t('browse.info.datasetArchetype')}</S.Title>
            </S.InfoHeader>
            {/* {projectDetails.archetype ? (
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
                    nodeOrigin={REACT_FLOW_OPTIONS.nodeOrigin as [number, number]}
                    fitView={REACT_FLOW_OPTIONS.fitView}
                    fitViewOptions={REACT_FLOW_OPTIONS.fitViewOptions}
                  ></ReactFlow>
                </S.MapWrapper>
              </ReactFlowProvider>
            ) : (
              <S.Text style={{ marginTop: '1rem' }}>{t('browse.info.noArchetype')}</S.Text>
            )} */}
          </BaseRow>
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default DatasetSummaryPage;
