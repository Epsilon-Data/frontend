import React from 'react';
import { BaseButton, BaseButtonProps } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

interface BaseButtonsGroupProps extends BaseButtonProps {
  className?: string;
  onCancel: () => void;
  loading?: boolean;
  buttonText?: string;
}

export const BaseButtonsGroup: React.FC<BaseButtonsGroupProps> = ({
  className,
  onCancel,
  loading,
  buttonText,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <BaseRow className={className} gutter={[10, 10]} wrap={false}>
      <BaseCol span={12} style={{ paddingRight: '1rem' }}>
        <BaseButton block type="primary" loading={loading} htmlType="submit" {...props}>
          {buttonText || t('common.save')}
        </BaseButton>
      </BaseCol>
      <BaseCol span={12} style={{ paddingLeft: '1rem' }}>
        <BaseButton block type="ghost" onClick={onCancel} {...props}>
          {t('common.cancel')}
        </BaseButton>
      </BaseCol>
    </BaseRow>
  );
};
