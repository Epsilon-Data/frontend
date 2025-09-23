import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../InputLabel/InputLabel';

dayjs.extend(customParseFormat);

export const ModalDatePicker: React.FC<{
  startName: string;
  endName: string;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
}> = ({ startName, endName, className, inputTitle, inputDescription }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col mb-12">
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />
      <div className="flex gap-2">
        <div className="flex-1">
          <p className="text-xs mb-1">Start</p>
          <FormItem
            name={startName}
            className={className}
            dependencies={[endName]} // re-validate when end changes
            rules={[
              { required: true, message: t('fieldMessages.datePicker.required') },
              ({ getFieldValue }) => ({
                validator(_, start) {
                  const end = getFieldValue(endName);
                  // allow equal dates; only block if start > end
                  if (start && end && start.isAfter(end, 'day')) {
                    return Promise.reject(new Error(t('fieldMessages.datePicker.startBeforeEnd')));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <DatePicker className="w-full border border-black" />
          </FormItem>
        </div>
        <div className="w-12 h-[0.1rem] bg-grey-2 my-9 mx-6" />
        <div className="flex-1">
          <p className="text-xs mb-1">End</p>
          <FormItem
            name={endName}
            className={className}
            dependencies={[startName]} // re-validate when start changes
            rules={[
              { required: true, message: t('fieldMessages.datePicker.required') },
              ({ getFieldValue }) => ({
                validator(_, end) {
                  const start = getFieldValue(startName);
                  // allow equal dates; only block if end < start
                  if (start && end && end.isBefore(start, 'day')) {
                    return Promise.reject(new Error(t('fieldMessages.datePicker.endAfterStart')));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <DatePicker className="w-full border border-black" />
          </FormItem>
        </div>
      </div>
    </div>
  );
};
