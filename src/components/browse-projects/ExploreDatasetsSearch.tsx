import { Button, Input, Radio, RadioChangeEvent, Row, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSearch } from 'react-icons/io5';

type SearchField = 'all' | 'name' | 'keywords' | 'organisation';

type Props = {
  onSearch: (value: string, field: SearchField) => void;
  initialValue?: string;
  initialField?: SearchField;
};

export const ExploreDatasetsSearch = ({ onSearch, initialValue = '', initialField = 'all' }: Props) => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState(initialValue);
  const [selectedField, setSelectedField] = useState<SearchField>(initialField);

  const SEARCH_FIELDS = [
    { value: 'all', label: t('browse.main.search.fields.all') },
    { value: 'name', label: t('browse.main.search.fields.projectTitle') },
    { value: 'keywords', label: t('browse.main.search.fields.keywords') },
    { value: 'organisation', label: t('browse.main.search.fields.organisation') },
  ] as const;

  const handleFieldChange = (e: RadioChangeEvent) => {
    setSelectedField(e.target.value as SearchField);
  };

  const onSearchClick = () => {
    onSearch(searchValue.trim(), selectedField);
  };

  return (
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
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (!e.target.value) onSearch('', selectedField);
            }}
            onPressEnter={onSearchClick}
            placeholder={t('browse.main.search.placeholder')}
            allowClear
            className="w-full pr-12 py-3"
          />
          <Button
            type="primary"
            onClick={onSearchClick}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full h-9 w-9 p-0 z-10"
          >
            <IoSearch />
          </Button>
        </div>
      </Row>

      <Row className="mb-4">
        <Typography.Text className="mr-4 mt-0.5">{t('browse.main.search.fields.title')}</Typography.Text>
        <Radio.Group value={selectedField} onChange={handleFieldChange}>
          {SEARCH_FIELDS.map((field) => (
            <Radio key={field.value} value={field.value}>
              {field.label}
            </Radio>
          ))}
        </Radio.Group>
      </Row>
    </Row>
  );
};
