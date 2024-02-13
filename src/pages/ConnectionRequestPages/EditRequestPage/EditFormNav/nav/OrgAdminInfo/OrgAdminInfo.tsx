import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { RequestDetails } from '@app/interfaces/interfaces';
import { StringInputItem } from '@app/components/request-fields/StringInput/StringInputItem';
import { BaseTooltip } from '@app/components/common/BaseTooltip/BaseTooltip';
import { InfoCircleOutlined } from '@ant-design/icons';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';

export const OrgAdminInfo: React.FC<{
  formValue: RequestDetails;
  setFormValue: (value: RequestDetails) => void;
}> = ({ formValue, setFormValue }) => {
  const initialValues = {
    orgAdminEmail: formValue.orgAdminEmail,
  };

  const [form] = BaseForm.useForm();
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormValueChange = (changedValues: any, allValues: any) => {
    const updatedRequest = {
      ...formValue,
      orgAdminEmail: allValues.orgAdminEmail,
    };
    setFormValue(updatedRequest);
  };

  return (
    <BaseForm
      form={form}
      name="orgAdminInfo"
      initialValues={initialValues}
      style={{ width: '80%' }}
      onValuesChange={handleFormValueChange}
    >
      <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }} style={{ paddingBottom: '2rem' }}>
        <BaseCol span={24}>
          <BaseForm.Item>
            <BaseForm.Title>{t('connectionRequests.details.orgAdminInfo.title')}</BaseForm.Title>
          </BaseForm.Item>
        </BaseCol>

        <BaseCol span={24}>
          <StringInputItem
            name="orgAdminEmail"
            label={t('connectionRequests.details.orgAdminInfo.email')}
            suffix={
              <BaseTooltip title={t('connectionRequests.details.orgAdminInfo.tooltip')}>
                <InfoCircleOutlined rev={undefined} />
              </BaseTooltip>
            }
            required
          />
        </BaseCol>
      </BaseRow>
    </BaseForm>
  );
};
