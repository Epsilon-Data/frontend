import { Empty } from 'antd';
import React from 'react';

type EmptyStateProps = {
  description: string;
  children?: React.ReactNode;
};

export const EmptyState = ({ description, children }: EmptyStateProps) => (
  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description}>
    {children}
  </Empty>
);
