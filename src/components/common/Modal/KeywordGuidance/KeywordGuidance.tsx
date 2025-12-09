import React, { useState } from 'react';
import { Typography, Tag, Row, Col, Space } from 'antd';
import { PiLightbulbBold } from 'react-icons/pi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

const { Text, Paragraph } = Typography;

const KeywordGuidance = () => {
  const { t } = useTranslation();
  const goodExamples: string[] = t('dashboard.createProject.form.step1.keywordGuidance.examples.good.list', {
    returnObjects: true,
  }) as string[];
  const badExamples: string[] = t('dashboard.createProject.form.step1.keywordGuidance.examples.bad.list', {
    returnObjects: true,
  }) as string[];
  const [showExamples, setShowExamples] = useState(true);

  const toggleExamples = () => {
    setShowExamples((prev) => !prev);
  };

  return (
    <div className="pb-40">
      <Paragraph className="flex items-start font-light text-gray">
        <span className="font-bold text-blueDark text-lg mr-2 leading-none">•</span>
        <span>{t('dashboard.createProject.form.step1.keywordGuidance.tip1')}</span>
      </Paragraph>
      <Paragraph className="flex items-start font-light text-gray">
        <span className="font-bold text-blueDark text-lg mr-2 leading-none">•</span>{' '}
        <span>{t('dashboard.createProject.form.step1.keywordGuidance.tip2')}</span>
      </Paragraph>

      <div className="px-4 py-2 bg-grey-4 rounded-md">
        <div className="flex items-center cursor-pointer user-select-none" onClick={toggleExamples}>
          <PiLightbulbBold className="text-[#1890ff] mr-3" />
          <Text>{t('dashboard.createProject.form.step1.keywordGuidance.examples.title')}</Text>
          <Text underline className="ml-4">
            {showExamples
              ? t('dashboard.createProject.form.step1.keywordGuidance.examples.hide')
              : t('dashboard.createProject.form.step1.keywordGuidance.examples.show')}
          </Text>
          {showExamples ? <FaChevronUp size={10} className="ml-4" /> : <FaChevronDown size={10} className="ml-4" />}
        </div>

        {showExamples && (
          <Row gutter={[16, 8]} className="mt-4">
            <Col span={24}>
              <Text className="mt-4">
                {t('dashboard.createProject.form.step1.keywordGuidance.examples.good.title')}
              </Text>{' '}
              <Space wrap>
                {goodExamples.map((item, idx) => (
                  <Tag key={idx} variant="filled" color="blue">
                    {item}
                  </Tag>
                ))}
              </Space>
            </Col>

            <Col span={24}>
              <Text className="mr-4">{t('dashboard.createProject.form.step1.keywordGuidance.examples.bad.title')}</Text>{' '}
              <Space wrap>
                {badExamples.map((item, idx) => (
                  <Tag key={idx} variant="filled" color="red">
                    {item}
                  </Tag>
                ))}
              </Space>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default KeywordGuidance;
