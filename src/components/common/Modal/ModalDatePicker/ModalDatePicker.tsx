import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker } from 'antd';

dayjs.extend(customParseFormat);

export const ModalDatePicker: React.FC<{
  startName: string;
  endName: string;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
}> = ({ startName, endName, className, inputTitle, inputDescription }) => {
  //const dateFormat = 'YYYY-MM-DD';
  return (
    <div className="flex flex-col mb-12">
      <div className="mb-8">
        <div className="text-xl font-medium font-sans text-blueDark">{inputTitle}</div>
        <div className="text-xs font-light font-inter">{inputDescription}</div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <p className="text-xs mb-1">Start</p>
          <FormItem name={startName} className={className}>
            <DatePicker className="w-full border border-black" />
          </FormItem>
        </div>
        <div className="w-12 h-[0.1rem] bg-grey-2 my-9 mx-6" />
        <div className="flex-1">
          <p className="text-xs mb-1">End</p>
          <FormItem name={endName} className={className}>
            <DatePicker className="w-full border border-black" />
          </FormItem>
        </div>
      </div>
    </div>
  );
};
