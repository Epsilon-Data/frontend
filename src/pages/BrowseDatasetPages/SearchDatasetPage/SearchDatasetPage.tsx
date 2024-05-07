/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './SearchDatasetPage.styles';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { CheckboxProps, RadioChangeEvent, Tag } from 'antd';
import { BaseList } from '@app/components/common/BaseList/BaseList';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchProps } from 'antd/es/input';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { RiFileSearchLine } from 'react-icons/ri';
import { SEARCH_FIELDS } from '@app/constants/browseDatasets';
import { Pagination, ProjectSummaryInfo, getProjects } from '@app/api/browseDatasets.api';
import { useMounted } from '@app/hooks/useMounted';

const { Meta } = Card;

function filterProjectsByValue(projects: ProjectSummaryInfo[], value: string, field: string): ProjectSummaryInfo[] {
  return projects.filter((item) => {
    if (field === 'all') {
      return (
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.organisation.toLowerCase().includes(value.toLowerCase()) ||
        item.keywords?.some((keyword) => keyword.toLowerCase().includes(value.toLowerCase()))
      );
    } else {
      if (field === 'name') {
        return item.name.toLowerCase().includes(value.toLowerCase());
      } else if (field === 'organisation') {
        return item.organisation.toLowerCase().includes(value.toLowerCase());
      } else if (field === 'keywords') {
        return item.keywords?.some((keyword) => keyword.toLowerCase().includes(value.toLowerCase()));
      }
    }
  });
}

function filterKeywords(projects: ProjectSummaryInfo[]): { keyword: string; amount: number }[] {
  const keywordCounts: { keyword: string; amount: number }[] = [];
  projects.forEach((project) => {
    project.keywords?.forEach((keyword) => {
      const existingKeyword = keywordCounts.find((k) => k.keyword === keyword);
      if (existingKeyword) {
        existingKeyword.amount++;
      } else {
        keywordCounts.push({ keyword, amount: 1 });
      }
    });
  });
  return keywordCounts;
}

const SearchDatasetPage: React.FC = () => {
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') ?? '';
  const initialField = searchParams.get('field') ?? 'all';
  const [searchValue, setSearchValue] = useState<string>(searchParams.get('q') ?? '');
  const [selectedField, setSelectedField] = useState<string>(searchParams.get('field') ?? 'all');
  const { t } = useTranslation();
  const [projects, setProjects] = useState<ProjectSummaryInfo[]>([]);
  const [queryList, setQueryList] = useState<ProjectSummaryInfo[]>([]);
  const [listData, setListData] = useState<{ data: ProjectSummaryInfo[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: { current: 1, pageSize: 10 },
    loading: false,
  });
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywordsData, setKeywordsData] = useState<{ keyword: string; amount: number }[]>([]);
  const navigate = useNavigate();
  const { isMounted } = useMounted();
  const indeterminate = selectedKeywords.length > 0 && selectedKeywords.length < keywordsData.length;
  const selectAll = selectedKeywords.length == keywordsData.length && keywordsData.length > 0;

  useEffect(() => {
    getProjects(true).then((res) => {
      if (isMounted.current) {
        setProjects(res);
        const filteredSearchList = initialQuery ? filterProjectsByValue(res, initialQuery, initialField) : res;
        setListData({ data: filteredSearchList, pagination: { current: 1, pageSize: 10 }, loading: false });
        setQueryList(filteredSearchList);
        const keywordCounts = filterKeywords(filteredSearchList);
        setKeywordsData(keywordCounts);
        setSelectedKeywords(keywordCounts.map((item) => item.keyword));
      }
    });
  }, [isMounted, initialQuery, initialField]);

  const handleKeywordChange = (keyword: string, checked: boolean) => {
    const nextSelectedKeywords = checked
      ? [...selectedKeywords, keyword]
      : selectedKeywords.filter((t) => t !== keyword);
    setSelectedKeywords(nextSelectedKeywords);
    const data = queryList.filter((item) => nextSelectedKeywords.some((keyword) => item.keywords?.includes(keyword)));
    setListData({ ...listData, data });
  };

  const onSearch: SearchProps['onSearch'] = (searchValue) => {
    setSearchValue(searchValue);
    const filteredSearchList = filterProjectsByValue(projects, searchValue, selectedField);
    setQueryList(filteredSearchList);
    setListData({
      ...listData,
      data: filteredSearchList,
      pagination: { ...listData.pagination, current: 1 },
    });
    const keywordCounts = filterKeywords(filteredSearchList);
    setKeywordsData(keywordCounts);
    setSelectedKeywords(keywordCounts.map((item) => item.keyword));
  };

  const handlePaginationChange = (page: number) => {
    setListData((listData) => ({ ...listData, pagination: { ...listData.pagination, current: page } }));
  };

  const onSelectAllChange: CheckboxProps['onChange'] = (e) => {
    const selected = e.target.checked ? keywordsData.map((item) => item.keyword) : [];
    setSelectedKeywords(selected);
    if (selected.length == 0) {
      setListData({ ...listData, data: [] });
    } else {
      setListData({ ...listData, data: queryList });
    }
  };

  return (
    <>
      <PageTitle>{t('browse.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card id="browse" title={t('browse.title')} padding="1.25rem 1.25rem 0">
          <S.SearchRow justify="center" align="middle">
            <S.SearchBar
              defaultValue={initialQuery}
              prefix={null}
              placeholder={t('browse.topSearch.placeholder')}
              onSearch={onSearch}
            />
          </S.SearchRow>
          <S.SearchRow justify="center" align="middle">
            <S.Label>{t('browse.topSearch.searchIn')}</S.Label>
            <BaseRadio.Group value={selectedField} onChange={(e: RadioChangeEvent) => setSelectedField(e.target.value)}>
              {SEARCH_FIELDS.map<React.ReactNode>((field) => (
                <BaseRadio key={field.value} value={field.value}>
                  {field.label}
                </BaseRadio>
              ))}
            </BaseRadio.Group>
          </S.SearchRow>
          <BaseRow gutter={[30, 30]}>
            <BaseCol span={6}>
              <S.FilterSidebar
                title={
                  <div style={{ position: 'relative' }}>
                    <RiFileSearchLine style={{ position: 'absolute' }} size={25} />
                    <div style={{ paddingLeft: '2rem' }}>{t('browse.search.sidebarTitle')}</div>
                  </div>
                }
              >
                <S.SidebarRow>
                  <S.SidebarText>
                    {searchValue ? t('browse.search.term') : t('browse.search.allDatasets')}
                  </S.SidebarText>
                  {searchValue && (
                    <Tag color="#ac59ff" style={{ marginLeft: '0.5rem' }}>
                      {searchValue}
                    </Tag>
                  )}
                </S.SidebarRow>
                <S.SidebarRow>
                  <S.SidebarText>{t('browse.search.keywords')}</S.SidebarText>
                </S.SidebarRow>
                <S.SidebarRow>
                  <S.KeywordCheckbox indeterminate={indeterminate} onChange={onSelectAllChange} checked={selectAll}>
                    {t('browse.search.selectAll')}
                  </S.KeywordCheckbox>
                </S.SidebarRow>
                <S.SidebarRow>
                  {keywordsData.map<React.ReactNode>((tag) => (
                    <S.KeywordTag
                      key={tag.keyword}
                      checked={selectedKeywords.includes(tag.keyword)}
                      onChange={(checked) => handleKeywordChange(tag.keyword, checked)}
                    >
                      {tag.keyword + ` (${tag.amount})`}
                    </S.KeywordTag>
                  ))}
                </S.SidebarRow>
              </S.FilterSidebar>
            </BaseCol>
            <BaseCol span={18}>
              <S.ResultsHeader>
                {t('browse.search.results', {
                  num: listData.data.length,
                  start: (listData.pagination.current - 1) * listData.pagination.pageSize + 1,
                  end:
                    listData.pagination.current * listData.pagination.pageSize > listData.data.length
                      ? listData.data.length
                      : listData.pagination.current * listData.pagination.pageSize,
                })}
              </S.ResultsHeader>
              <BaseList
                pagination={{ ...listData.pagination, onChange: handlePaginationChange }}
                loading={listData.loading}
                grid={{ gutter: 16, column: 1 }}
                dataSource={listData.data}
                renderItem={(item) => (
                  <BaseList.Item>
                    <S.CardItem hoverable onClick={() => navigate(`/browse/summary/${item.id}`)}>
                      <Meta
                        style={{ lineHeight: '1.1rem', marginBottom: '0.5rem' }}
                        title={<div style={{ whiteSpace: 'normal' }}>{item.name}</div>}
                        description={item.organisation}
                      />
                      <S.SearchDescription>{item.description}</S.SearchDescription>
                    </S.CardItem>
                  </BaseList.Item>
                )}
              />
            </BaseCol>
          </BaseRow>
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default SearchDatasetPage;
