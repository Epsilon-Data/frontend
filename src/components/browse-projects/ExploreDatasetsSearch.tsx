import { Button, Input, Radio, RadioChangeEvent, Row, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export const ExploreDatasetsSearch = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('all');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const SEARCH_FIELDS = [
    { value: 'all', label: t('browse.main.search.fields.all') },
    { value: 'name', label: t('browse.main.search.fields.projectTitle') },
    { value: 'keywords', label: t('browse.main.search.fields.keywords') },
    { value: 'organisation', label: t('browse.main.search.fields.organisation') },
  ];

  const handleFieldChange = (e: RadioChangeEvent) => {
    setSelectedField(e.target.value);
  };

  const onSearch = () => {
    if (searchValue) {
      navigate(`search?q=${searchValue}&field=${selectedField}`);
    } else {
      navigate('search');
    }
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
  );
};
