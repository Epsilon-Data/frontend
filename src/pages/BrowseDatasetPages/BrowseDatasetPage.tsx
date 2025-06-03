import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './BrowseDatasetPage.styles';
import { useNavigate } from 'react-router-dom';
import { Col, RadioChangeEvent, Row, TabsProps } from 'antd/lib';
import { t } from 'i18next';
import { IoChevronForwardOutline, IoSearch } from 'react-icons/io5';
import { IoIosArrowDown } from 'react-icons/io';
import { ProjectList } from '@app/components/ProjectList/ProjectList';
import { getProjectDetails, getProjects, ProjectInfo, ProjectSummaryInfo } from '@app/api/projects.api';
import { ModalAccessHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { Modal } from 'antd';
import { RxEnterFullScreen } from 'react-icons/rx';

const SEARCH_FIELDS = [
  { value: 'all', label: t('browse.main.search.fields.all') },
  { value: 'name', label: t('browse.main.search.fields.projectTitle') },
  { value: 'keywords', label: t('browse.main.search.fields.keywords') },
  { value: 'organisation', label: t('browse.main.search.fields.organisation') },
];

const ImageWithPreview: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '300px',
          height: '200px',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#eee',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'white',
            borderRadius: '8px',
            border: 'none',
            padding: '0.5rem 0.5rem 0.3rem',
            boxShadow: '0 0 6px rgba(0,0,0,0.2)',
            cursor: 'pointer',
          }}
        >
          <RxEnterFullScreen />
        </button>
      </div>

      <Modal open={open} footer={null} onCancel={() => setOpen(false)} centered>
        <img src={src} alt={alt} style={{ width: '100%' }} />
      </Modal>
    </>
  );
};

const DetailsRow: React.FC<{ title: string; content: string; titleWidth?: number; contentWidth?: number }> = ({
  title,
  content,
  titleWidth,
  contentWidth,
}) => {
  return (
    <Row style={{ marginBottom: '1rem' }}>
      <Col
        span={titleWidth ?? 9}
        style={{ display: 'flex', justifyContent: 'space-between', fontWeight: FONT_WEIGHT.regular }}
      >
        <span>{title}</span>
        <span>:</span>
      </Col>
      <Col span={contentWidth ?? 13} style={{ marginLeft: '1.5rem' }}>
        {content}
      </Col>
    </Row>
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
          <S.AboutText ref={descriptionRef} expanded={isExpanded}>
            {project.description}
          </S.AboutText>
          {showToggle && (
            <S.ShowButton onClick={() => setIsExpanded((prev) => !prev)}>
              {isExpanded ? t('browse.main.details.about.showLess') : t('browse.main.details.about.showMore')}
              {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
            </S.ShowButton>
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
            content={project.dbParticipantsNum}
          />
          <DetailsRow title={t('browse.main.details.projectDetails.info.lead')} content={project.lead} />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.members')}
            content={t('browse.main.details.projectDetails.info.notAvailable')}
          />
        </>
      ),
    },
  ];

  const fetch = useCallback(() => {
    getProjects().then((res) => {
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
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <PageTitle>{t('browse.title')}</PageTitle>
      <S.SearchHeader justify="center" align="middle">
        <S.SearchRow style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <S.BrowseTitle>{t('browse.main.title')}</S.BrowseTitle>
          <S.BrowseDescription>{t('browse.main.description')}</S.BrowseDescription>
        </S.SearchRow>
        <S.SearchRow style={{ width: '55%' }}>
          <S.SearchWrapper>
            <S.SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t('browse.main.search.placeholder')}
            />
            <S.SearchButton type="primary" onClick={onSearch}>
              <IoSearch />
            </S.SearchButton>
          </S.SearchWrapper>
        </S.SearchRow>
        <S.SearchRow>
          <S.SearchLabel>{t('browse.main.search.fields.title')}</S.SearchLabel>
          <S.SearchRadio.Group defaultValue={'all'} onChange={handleFieldChange}>
            {SEARCH_FIELDS.map<React.ReactNode>((field) => (
              <S.SearchRadio key={field.value} value={field.value}>
                {field.label}
              </S.SearchRadio>
            ))}
          </S.SearchRadio.Group>
        </S.SearchRow>
      </S.SearchHeader>
      <S.SearchContent>
        <S.ResultsHeader>
          <div style={{ display: 'column', alignItems: 'left' }}>
            <S.SectionTitle>{t('browse.main.searchResults.title')}</S.SectionTitle>
            <S.SectionDescription>{t('browse.main.searchResults.count', { count: 0 })}</S.SectionDescription>
          </div>
          <S.SortingSelect
            className="sort-select"
            prefix="Sort by: "
            defaultValue="date-created"
            suffixIcon={<IoIosArrowDown style={{ marginTop: '0.2rem' }} />}
            style={{ width: 200 }}
            onChange={handleChange}
            options={[
              { value: 'date-created', label: 'Date created' },
              { value: 'title', label: 'Title' },
              { value: 'last-modified', label: 'Last modified' },
            ]}
          />
        </S.ResultsHeader>
        <ProjectList projects={projects} mode="all" layout={'grid'} onProjectClick={handleProjectClick} />
      </S.SearchContent>
      <S.DetailsModal open={isModalOpen} width={'60%'} closable={false} mask footer={null}>
        <ModalAccessHeader setIsModalOpen={setIsModalOpen} />
        <S.AccessContent>
          <S.DetailsHeader>
            <Col span={14} style={{ padding: '10rem 4rem 10rem 6rem' }}>
              <S.DetailsTitle>{project.name}</S.DetailsTitle>
              <S.DetailsSubtitle>
                {' '}
                <span style={{ fontWeight: FONT_WEIGHT.regular }}>By:</span>{' '}
                {`${project.university} - ${project.faculty}`}
              </S.DetailsSubtitle>
              <S.RequestButton type="primary" icon={<IoChevronForwardOutline />} iconPosition="end">
                {t('browse.main.details.requestAccess')}
              </S.RequestButton>
            </Col>
            <Col span={10}>
              <S.Cover>
                <S.CoverText>{project.name?.charAt(0).toUpperCase()}</S.CoverText>
              </S.Cover>
            </Col>
          </S.DetailsHeader>
          <S.DetailsSection style={{ gap: '3rem' }}>
            <Col span={16}>
              <S.DetailsTabs defaultActiveKey="about" items={items} />
            </Col>
            <Col span={6} style={{ display: 'flex', flexDirection: 'column' }}>
              <S.TextHeader>{t('browse.main.details.keywords')}</S.TextHeader>
              {project.dbKeywords?.map((keyword: string, index: number) => (
                <S.KeywordTag key={index} bordered={false}>
                  {keyword}
                </S.KeywordTag>
              ))}
            </Col>
          </S.DetailsSection>
          <S.DetailsSection
            style={{
              borderTop: '1px solid var(--grey3)',
              paddingTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <S.TextHeader style={{ color: 'var(--blue-dark)' }}>{t('browse.main.details.aboutDb.title')}</S.TextHeader>
            <div
              style={{
                fontSize: FONT_SIZE.xs,
                fontWeight: FONT_WEIGHT.light,
                fontFamily: FONT_FAMILY.secondary,
              }}
            >
              <DetailsRow
                title={t('browse.main.details.aboutDb.info.dbName')}
                content={project.university}
                titleWidth={6}
                contentWidth={15}
              />
              <DetailsRow
                title={t('browse.main.details.aboutDb.info.dbNature')}
                content={project.university}
                titleWidth={6}
                contentWidth={15}
              />
            </div>
            <S.TextHeader style={{ color: 'var(--blue-dark)' }}>{t('browse.main.details.dbPreview')}</S.TextHeader>
            {/* <Image.PreviewGroup
              preview={{
                visible: isPreviewVisible,
                onVisibleChange: (visible) => setPreviewVisible(visible),
              }}
            >
              <div>
                {' '}
                <Image
                  width={300}
                  height={200}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                  src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                />
                <Image
                  width={300}
                  height={200}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                  src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                />
              </div>
            </Image.PreviewGroup> */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <ImageWithPreview src="https://images.unsplash.com/photo-1569521588854-9b461abc92ac?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
              <ImageWithPreview src="https://images.unsplash.com/photo-1553949345-eb786bb3f7ba?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            </div>
            <S.TextHeader style={{ color: 'var(--blue-dark)' }}>{t('browse.main.details.dbPreview')}</S.TextHeader>
          </S.DetailsSection>
        </S.AccessContent>
      </S.DetailsModal>
    </>
  );
};

export default BrowseDatasetPage;
