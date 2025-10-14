import { BackgroundVariant } from '@xyflow/react';

export const BG_VARIANT = BackgroundVariant.Dots;

export const REACT_FLOW_OPTIONS = {
  fitView: true,
  fitViewOptions: { maxZoom: 1 },
  nodeOrigin: [0.5, 0.5],
};

export function getLevelColor(level: number) {
  const MAX_LEVEL = 10;
  const l = Math.max(0, Math.min(MAX_LEVEL, level));

  const hueStart = 210;
  const hueEnd = 240;

  const hue = hueStart + ((hueEnd - hueStart) * l) / MAX_LEVEL;
  const saturation = 90;
  const lightness = 85 - l * 4;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
