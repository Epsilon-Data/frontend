import { Typography } from 'antd';
import React from 'react';

const { Paragraph, Text } = Typography;
export const InfoItem: React.FC<{ label: string; text: string | undefined }> = ({ label, text }) => {
  return (
    <Paragraph style={{ marginBottom: '0.2rem' }}>
      <Text strong>{label}: </Text>
      {text}
    </Paragraph>
  );
};
