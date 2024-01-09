import { Typography } from 'antd';
import React from 'react';

const { Title } = Typography;
export const InfoSectionHeader: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Title level={5} style={{ marginTop: '1.3rem', marginBottom: '0.3rem' }}>
      {text}
    </Title>
  );
};
