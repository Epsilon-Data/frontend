import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './BrowseDatasetPage.styles';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { BaseList } from '@app/components/common/BaseList/BaseList';
import { Card } from 'antd';
import defaultCover from '@app/assets/images/default-cover.png';
import { useNavigate } from 'react-router-dom';
import { SearchProps } from 'antd/es/input';
import { RadioChangeEvent } from 'antd/lib';
import { SEARCH_FIELDS } from '@app/constants/browseDatasets';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { ProjectSummaryInfo, getProjects } from '@app/api/browseDatasets.api';
import { useMounted } from '@app/hooks/useMounted';

const { Meta } = Card;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const BrowseDatasetPage: React.FC = () => {
  const { t } = useTranslation();
  const [exploreData, setExploreData] = useState<ProjectSummaryInfo[]>([]);
  const [recentData, setRecentData] = useState<ProjectSummaryInfo[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const navigate = useNavigate();
  const { isMounted } = useMounted();

  useEffect(() => {
    getProjects(false).then((res) => {
      if (isMounted.current) {
        setExploreData(shuffleArray(res).slice(0, 4));
        const recentRes = res
          .sort((a, b) => {
            if (a.createdDate > b.createdDate) return -1;
            if (a.createdDate < b.createdDate) return 1;
            return 0;
          })
          .slice(0, 4);
        setRecentData(recentRes);
      }
    });
  }, [isMounted]);

  // const handleChange = (tag: string, checked: boolean) => {
  //   if (checked) {
  //     setSelectedCategory(tag);
  //   }
  // };

  const onSearch: SearchProps['onSearch'] = (value) => {
    if (value) {
      navigate(`search?q=${value}&field=${selectedField}`);
    } else {
      navigate('search');
    }
  };

  const handleFieldChange = (e: RadioChangeEvent) => {
    setSelectedField(e.target.value);
  };

  return (
    <>
      <PageTitle>{t('browse.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card id="browse" title={t('browse.title')} padding="1.25rem 1.25rem 0">
          <BaseRow>
            <S.SearchCard>
              <S.SearchRow justify="center" align="middle">
                <S.SearchBar prefix={null} placeholder={t('browse.topSearch.placeholder')} onSearch={onSearch} />
              </S.SearchRow>
              <S.SearchRow justify="center" align="middle">
                <S.Label>{t('browse.topSearch.searchIn')}</S.Label>
                <BaseRadio.Group defaultValue={'all'} onChange={handleFieldChange}>
                  {SEARCH_FIELDS.map<React.ReactNode>((field) => (
                    <BaseRadio key={field.value} value={field.value}>
                      {field.label}
                    </BaseRadio>
                  ))}
                </BaseRadio.Group>
              </S.SearchRow>
              {/* <S.SearchRow justify="center" align="middle">
                <S.Label>{t('browse.topSearch.category')}</S.Label>
                {categories.map<React.ReactNode>((tag) => (
                  <Tag.CheckableTag
                    key={tag.value}
                    checked={selectedCategory == tag.value}
                    onChange={(checked) => handleChange(tag.value, checked)}
                    style={{ border: '1px solid #d9d9d9', padding: '0.5rem' }}
                  >
                    {tag.label}
                  </Tag.CheckableTag>
                ))}
              </S.SearchRow> */}
            </S.SearchCard>
          </BaseRow>
          <BaseRow style={{ marginTop: '2rem' }}>
            <BaseCol span={2}>
              <S.SectionHeader>{t('browse.explore')}</S.SectionHeader>
            </BaseCol>
            <BaseCol span={2} style={{ marginTop: '0.1rem' }}>
              <S.AllLink onClick={() => navigate('search')}>{t('browse.seeAll')}</S.AllLink>
            </BaseCol>
          </BaseRow>

          <BaseList
            grid={{ gutter: 16, column: 4 }}
            dataSource={exploreData}
            renderItem={(item) => (
              <BaseList.Item>
                <S.CardItem
                  hoverable
                  cover={<img src={item.cover ?? defaultCover} style={{ height: '15rem' }} alt="project-cover" />}
                  onClick={() => navigate(`summary/${item.id}`)}
                >
                  <Meta
                    style={{ lineHeight: '1.1rem' }}
                    title={<div style={{ whiteSpace: 'normal' }}>{item.name}</div>}
                    description={item.organisation}
                  />
                </S.CardItem>
              </BaseList.Item>
            )}
          />
          <S.SectionHeader>{t('browse.recentlyAdded')}</S.SectionHeader>
          <BaseList
            grid={{ gutter: 16, column: 4 }}
            dataSource={recentData}
            renderItem={(item) => (
              <BaseList.Item>
                <S.CardItem
                  hoverable
                  cover={<img src={item.cover ?? defaultCover} style={{ height: '15rem' }} alt="project-cover" />}
                  onClick={() => navigate(`summary/${item.id}`)}
                >
                  <Meta
                    style={{ lineHeight: '1.1rem' }}
                    title={<div style={{ whiteSpace: 'normal' }}>{item.name}</div>}
                    description={item.organisation}
                  />
                </S.CardItem>
              </BaseList.Item>
            )}
          />
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default BrowseDatasetPage;
