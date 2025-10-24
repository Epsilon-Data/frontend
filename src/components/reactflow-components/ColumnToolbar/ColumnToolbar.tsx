import { ColumnInfo } from '@app/api/database.api';
import { Input } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoClose, IoSearch } from 'react-icons/io5';

type ToolbarProps = {
  columns: ColumnInfo[];
  disabled?: boolean;
  disabledMessage?: string;
  style?: React.CSSProperties;
  onPick: (col: ColumnInfo) => void;
  onClose: () => void;
};

export const ColumnToolbar: React.FC<ToolbarProps> = ({
  columns,
  disabled,
  disabledMessage,
  style,
  onPick,
  onClose,
}) => {
  const { t } = useTranslation();
  const [q, setQ] = React.useState('');
  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? columns.filter((c) => c.name.toLowerCase().includes(s)) : columns;
  }, [columns, q]);

  return (
    <div
      style={style}
      className="absolute z-10 w-64 rounded-lg border border-gray-300 bg-white shadow-md p-2"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium">{t('project.createTemplate.form.step3.toolbar.title')}</div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <IoClose className="h-4 w-4" />
        </button>
      </div>

      <Input
        prefix={<IoSearch className="mr-2" />}
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('project.createTemplate.form.step3.toolbar.searchPlaceholder')}
        className="w-full rounded-md border border-gray-300 py-2 text-sm outline-none focus:border-blue-500"
        disabled={disabled}
      />

      <div className="mt-2 max-h-64 overflow-y-auto">
        {disabled ? (
          <div className="px-2 py-1 text-xs text-gray-500">
            {disabledMessage || t('project.createTemplate.form.step3.toolbar.error.disabled')}
          </div>
        ) : filtered.length ? (
          filtered.map((col) => (
            <button
              key={col.id}
              onClick={() => onPick(col)}
              className="mt-2 w-full text-left rounded-md border border-sky-300 hover:bg-sky-50"
            >
              <div className="mx-3 px-2 py-1 flex flex-col items-start justify-between border-x border-sky-300">
                <span className="block text-xs">{col.name}</span>
                <span className="block text-[10px] text-gray-400">{col.table}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="px-2 py-1 text-xs text-gray-500">
            {t('project.createTemplate.form.step3.toolbar.error.noColumns')}
          </div>
        )}
      </div>
    </div>
  );
};
