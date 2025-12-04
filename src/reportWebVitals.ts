import type { Metric } from 'web-vitals';

type ReportHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (!onPerfEntry) return;

  import('web-vitals').then((vitals) => {
    vitals.onCLS(onPerfEntry);
    vitals.onINP(onPerfEntry);
    vitals.onFCP(onPerfEntry);
    vitals.onLCP(onPerfEntry);
    vitals.onTTFB(onPerfEntry);
  });
};

export default reportWebVitals;
