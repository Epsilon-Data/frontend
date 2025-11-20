import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from 'react-icons/io';

type SearchResultsHeaderProps = {
  count: number;
};

export const SearchResultsHeader = ({ count }: SearchResultsHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between border-b border-b-grey-3 pb-4">
      <div className="flex flex-col items-start">
        <div className="text-base font-medium font-inter">{t('browse.main.searchResults.title')}</div>
        <div className="text-xs font-normal font-inter">{t('browse.main.searchResults.count', { count: count })}</div>
      </div>
      <Select
        className="sort-select w-50"
        prefix="Sort by: "
        defaultValue="date-created"
        suffixIcon={<IoIosArrowDown className="mt-1" />}
        options={[
          { value: 'date-created', label: 'Date created' },
          { value: 'title', label: 'Title' },
          { value: 'last-modified', label: 'Last modified' },
        ]}
      />
    </div>
  );
};
