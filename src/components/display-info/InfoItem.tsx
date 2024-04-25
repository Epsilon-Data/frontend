import { Typography } from 'antd';
import React from 'react';

const { Paragraph, Text } = Typography;

export const InfoItem: React.FC<{
  label?: string;
  text: string | undefined;
  paragraphProps?: React.ComponentProps<typeof Paragraph>;
}> = ({ label, text, paragraphProps }) => {
  return (
    <Paragraph {...paragraphProps} style={{ marginBottom: '0.2rem', ...(paragraphProps?.style || {}) }}>
      {label && (
        <Text strong style={{ ...(paragraphProps?.style || {}) }}>
          {label}:{' '}
        </Text>
      )}
      {text}
    </Paragraph>
  );
};
