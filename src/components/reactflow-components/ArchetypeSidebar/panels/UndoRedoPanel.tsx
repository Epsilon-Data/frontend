import React from 'react';
import { Button } from 'antd';
import { LuRedo, LuUndo } from 'react-icons/lu';

export const UndoRedoPanel: React.FC = () => {
  return (
    <div
      className={[
        'flex flex-col items-center bg-white border border-[#ddd] rounded-lg text-base w-10 shadow-xl',
        'transition-transform duration-500 ease-in-out',
      ].join(' ')}
    >
      <Button className="border-none bg-transparent shadow-none" icon={<LuUndo />} />
      <Button className="border-none bg-transparent shadow-none" icon={<LuRedo />} />
    </div>
  );
};
