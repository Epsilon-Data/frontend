import React from 'react';
import { Spin, SpinProps } from 'antd';
import { CSSProperties } from 'react';

interface LoaderWrapperProps extends SpinProps {
  isLoading: boolean;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string | number;
  spinSize?: 'small' | 'default' | 'large';
  className?: string;
  style?: CSSProperties;
}

export const LoaderWrapper: React.FC<LoaderWrapperProps> = ({
  isLoading,
  children,
  fallback,
  minHeight = '200px',
  spinSize = 'large',
  className = '',
  style,
  ...spinProps
}) => {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ minHeight, ...style }}>
        <Spin size={spinSize} {...spinProps} />
      </div>
    );
  }

  if (!children && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
