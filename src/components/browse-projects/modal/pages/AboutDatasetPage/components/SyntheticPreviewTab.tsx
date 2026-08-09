import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Spin, Tag } from 'antd';
import { getSyntheticDataPreview, SyntheticDataPreview } from '@app/api/archetypes.api';

type SyntheticPreviewTabProps = {
  projectId?: string;
};

// Researcher-facing, read-only preview of the dataset's synthetic data.
// Shows the column headers plus a capped sample of rows — no download.
export const SyntheticPreviewTab = ({ projectId }: SyntheticPreviewTabProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<SyntheticDataPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await getSyntheticDataPreview(projectId);
        if (active) setData(res);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs font-inter text-grey-1 py-4">{t('browse.main.details.synthetic.error')}</div>
    );
  }

  if (!data?.attached || data.columns.length === 0) {
    return (
      <div className="text-xs font-inter text-grey-1 py-4">{t('browse.main.details.synthetic.none')}</div>
    );
  }

  return (
    <div className="font-inter">
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <Tag color="blue" className="text-xs font-normal">
          {t('browse.main.details.synthetic.tag')}
        </Tag>
        <span className="text-xs text-grey-1">
          {t('browse.main.details.synthetic.showing', { count: data.rowCount })}
        </span>
      </div>
      <div className="overflow-x-auto border border-grey-3 rounded-lg max-h-80">
        <table className="min-w-full text-xs text-left border-collapse">
          <thead>
            <tr>
              {data.columns.map((col, i) => (
                <th
                  key={i}
                  className="px-3 py-2 bg-grey-4 font-medium text-grey-1 whitespace-nowrap border-b border-grey-3 sticky top-0"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-3 py-2 whitespace-nowrap border-b border-grey-3 tabular-nums text-black"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
