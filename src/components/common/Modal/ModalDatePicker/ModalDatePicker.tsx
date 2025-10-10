import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../InputLabel/InputLabel';
import { DatePicker } from 'antd';

dayjs.extend(customParseFormat);

export const ModalDatePicker: React.FC<{
  rangeName: string;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  labelLarge?: boolean;
}> = ({ rangeName, className, inputTitle, inputDescription, labelLarge = true }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col mb-12">
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} large={labelLarge} />
      <div className="flex gap-2">
        <div className="flex-1">
          <p className="text-xs mb-1">Start</p>
        </div>
        <div className="flex-1">
          <p className="text-xs mb-1">End</p>
        </div>
      </div>
      <FormItem
        name={rangeName}
        className={className}
        rules={[{ required: true, message: t('fieldMessages.datePicker.required') }]}
        validateTrigger={['onChange', 'onBlur']}
      >
        <DatePicker.RangePicker placement="bottomLeft" className="w-full border border-grey-3 bg-grey-4" />
      </FormItem>
    </div>
  );
};
