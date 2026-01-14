import { useProjectModalContext } from '@app/hooks/useProjectModalContext';
import { Layout, SortKey } from '@app/pages/DashboardPages/DashboardPage';
import { Button, Input, Segmented, Select, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa6';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiMiniListBullet } from 'react-icons/hi2';
import { IoIosArrowDown } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';

type DashboardHeaderProps = {
  user: {
    given_name: string;
    family_name: string;
  } | null;
  handleLayoutChange: React.Dispatch<React.SetStateAction<Layout>>;
  layout: Layout;
  searchValue: string;
  handleSearchChange: (value: string) => void;
  sortKey: SortKey;
  handleSortChange: (value: SortKey) => void;
};

export const DashboardHeader = ({
  user,
  handleLayoutChange,
  layout,
  searchValue,
  handleSearchChange,
  sortKey,
  handleSortChange,
}: DashboardHeaderProps) => {
  const { showModal } = useProjectModalContext();
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between w-full mt-8 pb-4 border-b border-grey-3">
      <div className="text-xl font-medium font-sans">{user?.given_name + "'s workspace"}</div>
      <div className="flex items-center gap-4 flex-wrap justify-end">
        <Space.Compact className="rounded-lg">
          <Input
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            rootClassName="dash-input"
            className="px-2 py-1 text-xs font-inter h-9"
            prefix={<IoSearch className="text-grey-1 mr-2" />}
            placeholder="Search projects..."
          />
        </Space.Compact>
        <Select
          value={sortKey}
          rootClassName="dash-select"
          className="sort-select text-xs font-medium font-sans w-48 h-9"
          prefix="Sort by: "
          defaultValue="date-created"
          suffixIcon={<IoIosArrowDown className="mt-1" />}
          onChange={(v) => handleSortChange(v as SortKey)}
          options={[
            { value: 'date-created', label: 'Date created' },
            { value: 'title', label: 'Title' },
            { value: 'last-modified', label: 'Last modified' },
          ]}
        />
        <Segmented
          rootClassName="dash-segmented"
          value={layout}
          onChange={(value) => handleLayoutChange(value as 'grid' | 'list')}
          className="flex bg-grey-3 h-9 items-center justify-center p-1"
          options={[
            { value: 'grid', icon: <HiOutlineViewGrid /> },
            { value: 'list', icon: <HiMiniListBullet /> },
          ]}
        />
        <Button
          className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
          type="primary"
          icon={<FaPlus />}
          onClick={showModal}
        >
          {t('dashboard.main.newProject')}
        </Button>
      </div>
    </div>
  );
};
