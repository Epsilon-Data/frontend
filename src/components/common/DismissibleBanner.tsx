import { Alert } from 'antd';
import { useState } from 'react';

type DismissibleBannerProps = {
  id: string;
  message: string;
};

export const DismissibleBanner = ({ id, message }: DismissibleBannerProps) => {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(`banner_dismissed_${id}`) === 'true');

  if (dismissed) return null;

  return (
    <Alert
      type="info"
      showIcon
      closable
      banner
      message={message}
      onClose={() => {
        localStorage.setItem(`banner_dismissed_${id}`, 'true');
        setDismissed(true);
      }}
    />
  );
};
