import React, { useState } from 'react';
import { Typography, Tag, Row, Col, Space } from 'antd';
import { PiLightbulbBold } from 'react-icons/pi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

const { Text, Paragraph } = Typography;

const KeywordGuidance = () => {
  const [showExamples, setShowExamples] = useState(true);

  const toggleExamples = () => {
    setShowExamples((prev) => !prev);
  };

  return (
    <div style={{ paddingBottom: '10rem' }}>
      <Paragraph style={{ fontWeight: FONT_WEIGHT.light }}>
        <Text
          style={{ fontWeight: 'bold', color: 'var(--secondary-color)', fontSize: FONT_SIZE.lg, marginRight: '0.5rem' }}
        >
          •
        </Text>{' '}
        Don’t include your or participant’s personal details
      </Paragraph>
      <Paragraph style={{ fontWeight: FONT_WEIGHT.light }}>
        <Text
          style={{ fontWeight: 'bold', color: 'var(--secondary-color)', fontSize: FONT_SIZE.lg, marginRight: '0.5rem' }}
        >
          •
        </Text>{' '}
        Use descriptive words, like “population demographics” or “health data” to convey the main themes of your dataset
      </Paragraph>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '1rem',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={toggleExamples}
      >
        <PiLightbulbBold style={{ color: '#1890ff', marginRight: 8 }} />
        <Text strong>See good and bad key words</Text>
        <Text underline style={{ marginLeft: 8 }}>
          {showExamples ? 'Hide examples' : 'Show examples'}
        </Text>
        {showExamples ? (
          <FaChevronUp size={10} style={{ marginLeft: 8 }} />
        ) : (
          <FaChevronDown size={10} style={{ marginLeft: 8 }} />
        )}
      </div>

      {showExamples && (
        <Row gutter={[16, 8]} style={{ marginTop: '1rem' }}>
          <Col span={24}>
            <Text strong style={{ marginRight: '1rem' }}>
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
            <Text strong style={{ marginRight: '1rem' }}>
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
