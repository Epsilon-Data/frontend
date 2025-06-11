/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './DatabaseMappingPage.styles';
import { LAYOUT } from '@app/styles/themes/constants';
import { Radio, Space } from 'antd';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiMiniListBullet } from 'react-icons/hi2';
import { FaPlus } from 'react-icons/fa6';
import { IoIosArrowDown } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';

const MetadataPage: React.FC = () => {
  //const { id } = useParams();
  const { t } = useTranslation();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const handleChange = (value: string | string[]) => {
    console.log(`selected ${value}`);
  };

  return (
    <div style={{ padding: LAYOUT.desktop.paddingVertical + ' ' + LAYOUT.desktop.paddingHorizontal }}>
      <PageTitle>{t('project.title')}</PageTitle>
      <S.HeaderWrapper>
        <S.Title>{t('project.main.dbMapping.title')}</S.Title>
        <S.ToolsWrapper>
          <Space.Compact style={{ border: '1px solid var(--grey2)', borderRadius: '0.5rem' }}>
            <S.SearchBar
              prefix={<IoSearch style={{ marginRight: '0.5rem', color: 'var(--grey1)' }} />}
              placeholder="Search templates..."
            />
          </Space.Compact>
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
          <Space>
            <S.LayoutSelector value={layout} onChange={(e) => setLayout(e.target.value)}>
              <Radio.Button value="grid">
                <HiOutlineViewGrid />
              </Radio.Button>
              <Radio.Button value="list">
                <HiMiniListBullet />
              </Radio.Button>
            </S.LayoutSelector>
          </Space>
          <S.AddProjectButton type="primary" icon={<FaPlus />}>
            {t('project.main.dbMapping.newTemplate')}
          </S.AddProjectButton>
        </S.ToolsWrapper>
      </S.HeaderWrapper>
    </div>
  );
};

export default MetadataPage;
