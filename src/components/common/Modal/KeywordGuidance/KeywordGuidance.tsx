import React, { useState } from 'react';
import { Typography, Tag, Row, Col, Space } from 'antd';
import { PiLightbulbBold } from 'react-icons/pi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

const { Text, Paragraph } = Typography;

const KeywordGuidance = () => {
  const [showExamples, setShowExamples] = useState(true);

  const toggleExamples = () => {
    setShowExamples((prev) => !prev);
  };

  return (
    <div className="pb-40">
      <Paragraph className="font-light text-gray">
        <Text className="font-bold text-blueDark text-lg mr-2">•</Text> Don’t include your or participant’s personal
        details
      </Paragraph>
      <Paragraph className="font-light">
        <Text className="font-bold text-blueDark text-lg mr-2">•</Text> Use descriptive words, like “population
        demographics” or “health data” to convey the main themes of your dataset
      </Paragraph>

      <div className="flex items-center mt-4 cursor-pointer user-select-none" onClick={toggleExamples}>
        <PiLightbulbBold className="text-[#1890ff] mr-8" />
        <Text strong>See good and bad key words</Text>
        <Text underline className="ml-4">
          {showExamples ? 'Hide examples' : 'Show examples'}
        </Text>
        {showExamples ? <FaChevronUp size={10} className="ml-4" /> : <FaChevronDown size={10} className="ml-4" />}
      </div>

      {showExamples && (
        <Row gutter={[16, 8]} className="mt-4">
          <Col span={24}>
            <Text strong className="mt-4">
              Good examples:
            </Text>{' '}
            <Space wrap>
              <Tag bordered={false} color="green">
                Population Demographics
              </Tag>
              <Tag bordered={false} color="green">
                Health Records
              </Tag>
              <Tag bordered={false} color="green">
                Education Statistics
              </Tag>
            </Space>
          </Col>

          <Col span={24}>
            <Text strong className="mr-4">
              Bad examples:
            </Text>{' '}
            <Space wrap>
              <Tag bordered={false} color="red">
                Data Info
              </Tag>
              <Tag bordered={false} color="red">
                Various kinds of important data about different things
              </Tag>
              <Tag bordered={false} color="red">
                Stats Sheet
              </Tag>
            </Space>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default KeywordGuidance;
