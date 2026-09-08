import { ProjectInfo } from '@app/api/projects.api';
import { Button, Col, Row, Tag, message } from 'antd';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { Edge, Node, useEdgesState, useNodesState } from '@xyflow/react';
import { ArchetypeFlow } from '@app/components/reactflow-components/ArchetypeFlow/ArchetypeFlow';
import { AboutTabs } from './components/AboutTabs';
import { ArchetypeInfo } from '@app/api/archetypes.api';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { getRequestByProject, RequestSummaryInfo } from '@app/api/analysisRequests.api';
import { ImageWithPreview } from './components/ImageWithPreview';

type AboutDatasetPageProps = {
  project: ProjectInfo;
  archetype: ArchetypeInfo;
  setModalStep: React.Dispatch<React.SetStateAction<number>>;
};

type ButtonMode = 'OWNER' | 'APPLIED' | 'DEFAULT' | 'JOIN';

export const AboutDatasetPage = ({ project, archetype, setModalStep }: AboutDatasetPageProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(archetype.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(archetype.edges || []);
  const user = useAppSelector((state) => state.user.user);
  const [request, setRequest] = useState<RequestSummaryInfo | null>(null);

  useEffect(() => {
    setNodes(archetype.nodes || []);
  }, [archetype.nodes, setNodes]);

  useEffect(() => {
    setEdges(archetype.edges || []);
  }, [archetype.edges, setEdges]);

  useEffect(() => {
    const checkRequest = async () => {
      if (!project?.projectId) return;

      try {
        const result = await getRequestByProject(project.projectId);
        if (result?.requestId) setRequest(result);
      } catch {
        message.error(t('browse.main.details.proceed.requestCheckError'));
      }
    };

    void checkRequest();
  }, [project.projectId, t]);

  const buttonConfig: Record<ButtonMode, { label: string; onClick: () => void }> = {
    OWNER: {
      label: t('browse.main.details.proceed.manageProject'),
      onClick: () => navigate(`/project/db-mapping?id=${project.projectId}`),
    },
    APPLIED: {
      label: t('browse.main.details.proceed.manageRequest'),
      onClick: () => {
        navigate(`/track-requests?id=${request?.requestId}`);
      },
    },
    DEFAULT: {
      label: t('browse.main.details.proceed.requestAccess'),
      onClick: () => setModalStep((prev) => prev + 1),
    },
    JOIN: {
      label: t('browse.main.details.proceed.join'),
      onClick: () => setModalStep((prev) => prev + 1),
    },
  };

  const renderButtonMode = () => {
    const isOwner = project.ownerId === user?.sub;
    const isMember = project.members?.find((member) => member.email === user?.email);
    if (isOwner || isMember) return buttonConfig.OWNER;
    if (request !== null) return buttonConfig.APPLIED;
    if (project.isPublic) return buttonConfig.JOIN;
    return buttonConfig.DEFAULT;
  };

  return (
    <div className="h-[48rem] p-0 overflow-y-auto flex flex-col -mt-8 rounded-3xl">
      <Row className="bg-grey-4 h-[33rem]">
        <Col span={14} className="pt-40 pr-16 pb-40 pl-24">
          <div className="text-2xl font-medium font-sans text-black">{project.name}</div>
          <div className="text-base font-light font-inter text-black">
            <span className="font-normal">By: </span>
            {`${project.university} - ${project.faculty}`}
          </div>
          <Button
            className="mt-8 flex items-center w-60 h-10 text-xs font-medium font-inter"
            type="primary"
            icon={<IoChevronForwardOutline />}
            iconPlacement="end"
            onClick={renderButtonMode().onClick}
          >
            {renderButtonMode().label}
          </Button>
        </Col>
        <Col span={10}>
          <div className="h-full flex items-center justify-center bg-coverBg text-5xl font-bold text-coverText overflow-hidden">
            <div className="leading-4 p-8 text-center">{project.name?.charAt(0).toUpperCase()}</div>
          </div>
        </Col>
      </Row>
      <Row className="mt-8 mx-24 gap-12">
        <Col span={16}>
          <AboutTabs project={project} />
        </Col>
        <Col span={6} className="flex flex-col">
          <div className="text-xs font-medium font-inter mb-4">{t('browse.main.details.keywords')}</div>
          {project.dbKeywords?.map((keyword: string, index: number) => (
            <Tag
              className="w-max mb-2 text-xs font-normal font-inter rounded-2xl py-1 px-3 text-center bg-grey-1 text-white break-words"
              key={index}
              variant="filled"
            >
              {keyword}
            </Tag>
          ))}
        </Col>
      </Row>
      <Row className="mt-8 mx-24 border-t border-t-grey-3 pt-8 flex flex-col mb-12">
        <div className="text-xs font-medium font-inter text-blueDark mb-4">
          {t('browse.main.details.dbPreview.title')}
        </div>
        {project.status == 'MAPPED' ? (
          <div className="h-[25rem] w-full bg-grey-4 rounded-lg">
            <ArchetypeFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              setNodes={setNodes}
              setEdges={setEdges}
              mode="readonly"
            />
          </div>
        ) : (
          <div className="text-xs font-medium font-inter mb-4">{t('browse.main.details.dbPreview.noArchetype')}</div>
        )}
        {project.datasetImages?.length ? (
          <div className="mt-8">
            <div className="text-xs font-medium font-inter text-blueDark mb-4">
              {t('browse.main.details.datasetImages.title')}
            </div>
            <div className="flex gap-6 flex-wrap">
              {project.datasetImages
                .slice()
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((image) => (
                  <ImageWithPreview key={image.imageId} src={image.url} alt={image.caption ?? project.name} />
                ))}
            </div>
          </div>
        ) : null}
      </Row>
    </div>
  );
};
