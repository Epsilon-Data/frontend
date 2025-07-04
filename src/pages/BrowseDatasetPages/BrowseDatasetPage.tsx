import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { useNavigate } from 'react-router-dom';
import { Col, RadioChangeEvent, Row, TabsProps } from 'antd/lib';
import { t } from 'i18next';
import { IoChevronForwardOutline, IoSearch } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import { ProjectList } from '@app/components/ProjectList/ProjectList';
import { getProjectDetails, getAllProjects, ProjectInfo, ProjectSummaryInfo } from '@app/api/projects.api';
import { ModalAccessHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { FaChevronDown, FaChevronUp, FaMinus, FaPlus } from 'react-icons/fa6';
import { Button, Image, Input, Modal, Radio, Select, Tabs, Tag, Typography } from 'antd';
import { RxEnterFullScreen } from 'react-icons/rx';
import { DB_TYPE_LABELS } from '@app/constants/projects';
import ReactFlow, { Background, Panel, ReactFlowProvider, useReactFlow } from 'reactflow';
import { BG_VARIANT, createNodeTypes, REACT_FLOW_OPTIONS } from '@app/constants/reactflow';
import { DefaultNode } from '@app/components/reactflow-components/DefaultNode/DefaultNode';
import clsx from 'clsx';

const nodes = [
  {
    id: '1',
    type: 'subcategory',
    data: { label: 'Subcat 1' },
    position: { x: -150, y: 0 },
  },
  {
    id: '2',
    type: 'subcategory',
    data: { label: 'Subcat 2' },
    position: { x: 150, y: 0 },
  },
  { id: '3', data: { label: 'Category 1' }, type: 'category', position: { x: 0, y: 100 } },
  { id: '4', data: { label: 'Object 1' }, type: 'object', position: { x: 0, y: 200 } },
  {
    id: '5',
    type: 'category',
    data: { label: 'Category 2' },
    position: { x: 0, y: 300 },
  },
];

const edges = [
  { id: '1->3', source: '1', target: '3' },
  { id: '2->3', source: '2', target: '3' },
  { id: '3->4', source: '3', target: '4' },
  { id: '4->5', source: '4', target: '5' },
];

const SEARCH_FIELDS = [
  { value: 'all', label: t('browse.main.search.fields.all') },
  { value: 'name', label: t('browse.main.search.fields.projectTitle') },
  { value: 'keywords', label: t('browse.main.search.fields.keywords') },
  { value: 'organisation', label: t('browse.main.search.fields.organisation') },
];

const ImageWithPreview: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative w-75 h-48 rounded-lg overflow-hidden bg-[#eee]">
      <Image.PreviewGroup>
        <Image
          src={src}
          alt={alt}
          className="w-full h-full object-cover block pointer-events-none"
          preview={{
            mask: false,
            visible,
            onVisibleChange: (value) => {
              console.log('visible', value);
              setVisible(value);
            },
            src: src,
          }}
        />
      </Image.PreviewGroup>

      <button
        onClick={() => setVisible(true)}
        className="absolute bottom-3 right-3 bg-white rounded-lg border-none padding py-2 px-2 cursor-pointer shadow-button"
      >
        <RxEnterFullScreen />
      </button>
    </div>
  );
};

const DetailsRow: React.FC<{ title: string; content: string; titleWidth?: number; contentWidth?: number }> = ({
  title,
  content,
  titleWidth,
  contentWidth,
}) => {
  return (
    <Row className="mb-4">
      <Col span={titleWidth ?? 9} className="flex justify-between font-normal">
        <span>{title}</span>
        <span>:</span>
      </Col>
      <Col span={contentWidth ?? 13} className="ml-6">
        {content}
      </Col>
    </Row>
  );
};

const CustomZoomControls = () => {
  const { zoomIn, zoomOut, getZoom } = useReactFlow();
  const [zoomLevel, setZoomLevel] = useState<number>(Math.round(getZoom() * 100));

  // Update zoom level whenever user zooms manually
  useEffect(() => {
    const interval = setInterval(() => {
      setZoomLevel(Math.round(getZoom() * 100));
    }, 200);
    return () => clearInterval(interval);
  }, [getZoom]);

  return (
    <Panel position="bottom-right">
      <div className="flex items-center bg-white border border-[#ddd] rounded-lg text-base p-1">
        <Button icon={<FaPlus />} size="small" onClick={() => zoomIn()} className="border-none bg-transparent mr-2.5" />
        <span className="w-12 text-center inline-block">{zoomLevel}%</span>
        <Button
          icon={<FaMinus />}
          size="small"
          onClick={() => zoomOut()}
          className="border-none bg-transparent ml-2.5"
        />
      </div>
    </Panel>
  );
};

const BrowseDatasetPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedField, setSelectedField] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');
  const [projects, setProjects] = useState<ProjectSummaryInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectInfo>({} as ProjectInfo);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const tempDbDetails = JSON.parse(project.connection?.tempDbDetails ?? '{}');

  const nodeTypes = useMemo(() => createNodeTypes(DefaultNode), []);

  useEffect(() => {
    if (descriptionRef.current) {
      const isOverflowing = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setShowToggle(isOverflowing);
    }
  }, [project.description]);

  const items: TabsProps['items'] = [
    {
      key: 'about',
      label: t('browse.main.details.about.title'),
      children: (
        <>
          <div
            ref={descriptionRef}
            className={clsx('relative overflow-hidden break-normal', isExpanded ? 'line-clamp-none' : 'line-clamp-6')}
          >
            {project.description}
          </div>
          {showToggle && (
            <Button
              className="border-none shadow-none text-blueDark text-xs font-medium font-inter cursor-pointer mt-2 p-0 inline-flex items-center gap-2"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? t('browse.main.details.about.showLess') : t('browse.main.details.about.showMore')}
              {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
            </Button>
          )}
        </>
      ),
    },
    {
      key: 'details',
      label: t('browse.main.details.projectDetails.title'),
      children: (
        <>
          <DetailsRow title={t('browse.main.details.projectDetails.info.university')} content={project.university} />
          <DetailsRow title={t('browse.main.details.projectDetails.info.faculty')} content={project.faculty} />
          <DetailsRow title={t('browse.main.details.projectDetails.info.ethicsId')} content={project.ethicsId} />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.duration')}
            content={
              project.startDate && project.endDate
                ? `${new Date(project.startDate).getDate()} ${new Date(project.startDate).toLocaleString('en-GB', {
                    month: 'long',
                  })}, ${new Date(project.startDate).getFullYear()} - ${new Date(project.endDate).getDate()} ${new Date(
                    project.endDate,
                  ).toLocaleString('en-GB', {
                    month: 'long',
                  })}, ${new Date(project.endDate).getFullYear()}`
                : t('browse.main.details.projectDetails.info.notAvailable')
            }
          />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.participantsNum')}
            content={project.participantsNum}
          />
          <DetailsRow title={t('browse.main.details.projectDetails.info.lead')} content={project.lead} />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.members')}
            content={
              project.members
                ? project.members
                    .map((member) => {
                      const memberObj = JSON.parse(member);
                      return `${memberObj.email} (${memberObj.role})`;
                    })
                    .join(', ')
                : t('browse.main.details.projectDetails.info.notAvailable')
            }
          />
        </>
      ),
    },
  ];

  const fetch = useCallback(() => {
    getAllProjects().then((res) => {
      setProjects(res);
    });
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleChange = (value: string | string[]) => {
    console.log(`selected ${value}`);
  };

  const onSearch = () => {
    if (searchValue) {
      navigate(`search?q=${searchValue}&field=${selectedField}`);
    } else {
      navigate('search');
    }
  };

  const handleFieldChange = (e: RadioChangeEvent) => {
    setSelectedField(e.target.value);
  };

  const handleProjectClick = (projectId: string) => {
    getProjectDetails(projectId)
      .then((res) => {
        setIsModalOpen(true);
        setProject(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <PageTitle>{t('browse.title')}</PageTitle>
      <Row
        className="bg-gradient-to-b from-[#e2edf8] to-transparent py-20 px-16 flex flex-col"
        justify="center"
        align="middle"
      >
        <Row className="flex flex-col items-center mb-4">
          <div className="text-5xl font-medium font-sans text-blueDark">{t('browse.main.title')}</div>
          <div className="text-base font-normal font-inter text-black mt-2">{t('browse.main.description')}</div>
        </Row>
        <Row className="w-1/2 mb-4">
          <div className="relative w-full">
            <Input
              className="w-full items-center justify-center border border-blueDark bg-[rgba(159,203,249,0.2)] pr-12 py-3"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('browse.main.search.placeholder')}
            />
            <Button
              type="primary"
              onClick={onSearch}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 rounded-full h-9 w-9 flex items-center justify-center p-0"
            >
              <IoSearch />
            </Button>
          </div>
        </Row>
        <Row className="mb-4">
          <Typography.Text className="flex font-normal text-base mr-4 mt-0.5">
            {t('browse.main.search.fields.title')}
          </Typography.Text>
          <Radio.Group
            className="mt-1 font-normal text-xs font-inter text-gray-50"
            defaultValue={'all'}
            onChange={handleFieldChange}
          >
            {SEARCH_FIELDS.map<React.ReactNode>((field) => (
              <Radio key={field.value} value={field.value}>
                {field.label}
              </Radio>
            ))}
          </Radio.Group>
        </Row>
      </Row>
      <div className="py-0 px-4 flex flex-col">
        <div className="flex justify-between border-b border-b-grey-3 pb-4">
          <div className="flex flex-col items-start">
            <div className="text-base font-medium font-inter">{t('browse.main.searchResults.title')}</div>
            <div className="text-xs font-normal font-inter">{t('browse.main.searchResults.count', { count: 0 })}</div>
          </div>
          <Select
            className="sort-select w-50"
            prefix="Sort by: "
            defaultValue="date-created"
            suffixIcon={<IoIosArrowDown className="mt-1" />}
            onChange={handleChange}
            options={[
              { value: 'date-created', label: 'Date created' },
              { value: 'title', label: 'Title' },
              { value: 'last-modified', label: 'Last modified' },
            ]}
          />
        </div>
        <ProjectList projects={projects} mode="all" layout={'grid'} onProjectClick={handleProjectClick} />
      </div>
      <Modal className="-mt-12 " open={isModalOpen} width={'60%'} closable={false} mask footer={null}>
        <ModalAccessHeader setIsModalOpen={setIsModalOpen} />
        <div className="h-[48rem] p-0 overflow-y-auto flex flex-col -mt-8 rounded-3xl">
          <Row className="bg-grey-4 h-[33rem]">
            <Col span={14} className="pt-40 pr-16 pb-40 pl-24">
              <div className="text-2xl font-medium font-sans text-black">{project.name}</div>
              <div className="text-base font-light font-inter text-black">
                <span className="font-normal">By:</span>
                {`${project.university} - ${project.faculty}`}
              </div>
              <Button
                className="mt-8 flex items-center w-60 h-10 text-xs font-medium font-inter"
                type="primary"
                icon={<IoChevronForwardOutline />}
                iconPosition="end"
              >
                {t('browse.main.details.requestAccess')}
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
              <Tabs className="details-tabs" defaultActiveKey="about" items={items} />
            </Col>
            <Col span={6} className="flex flex-col">
              <div className="text-xs font-medium font-inter mb-4">{t('browse.main.details.keywords')}</div>
              {project.dbKeywords?.map((keyword: string, index: number) => (
                <Tag
                  className="w-max mb-2 text-xs font-normal font-inter rounded-2xl py-1 px-3 text-center bg-grey-1 text-white break-words"
                  key={index}
                  bordered={false}
                >
                  {keyword}
                </Tag>
              ))}
            </Col>
          </Row>
          <Row className="mt-8 mx-24 border-t border-t-grey-3 pt-8 flex flex-col mb-12">
            <div className="text-xs font-medium font-inter text-blueDark mb-4">
              {t('browse.main.details.aboutDb.title')}
            </div>
            <div className="font-light text-xs font-inter">
              <DetailsRow
                title={t('browse.main.details.aboutDb.info.dbName')}
                content={tempDbDetails.name}
                titleWidth={6}
                contentWidth={15}
              />
              <DetailsRow
                title={t('browse.main.details.aboutDb.info.dbNature')}
                content={t(DB_TYPE_LABELS[tempDbDetails.type] ?? tempDbDetails.type)}
                titleWidth={6}
                contentWidth={15}
              />
            </div>
            <div className="text-xs font-medium font-inter text-blueDark mb-4">
              {t('browse.main.details.dbPreview')}
            </div>
            <div className="flex gap-6 mb-8">
              <ImageWithPreview src="https://images.unsplash.com/photo-1569521588854-9b461abc92ac?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
              <ImageWithPreview src="https://images.unsplash.com/photo-1553949345-eb786bb3f7ba?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            </div>
            <div className="text-xs font-medium font-inter text-blueDark mb-4">
              {t('browse.main.details.dbPreview')}
            </div>
            {project ? (
              <ReactFlowProvider>
                <div className="h-[25rem] w-full bg-grey-4 rounded-lg">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    edgesUpdatable={false}
                    edgesFocusable={false}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    nodesFocusable={false}
                    draggable
                    zoomOnScroll
                    panOnDrag
                    deleteKeyCode={[]}
                    nodeTypes={nodeTypes}
                    nodeOrigin={REACT_FLOW_OPTIONS.nodeOrigin as [number, number]}
                    fitView={REACT_FLOW_OPTIONS.fitView}
                    fitViewOptions={REACT_FLOW_OPTIONS.fitViewOptions}
                    proOptions={{ hideAttribution: true }}
                  >
                    <Background variant={BG_VARIANT} />
                    <CustomZoomControls />
                  </ReactFlow>
                </div>
              </ReactFlowProvider>
            ) : (
              <div className="text-xs font-medium font-inter mb-4">{t('browse.info.noArchetype')}</div>
            )}
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default BrowseDatasetPage;
