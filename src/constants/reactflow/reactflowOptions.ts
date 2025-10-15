import { BackgroundVariant } from '@xyflow/react';

export const BG_VARIANT = BackgroundVariant.Dots;

export const REACT_FLOW_OPTIONS = {
  fitView: true,
  fitViewOptions: { maxZoom: 1 },
  nodeOrigin: [0.5, 0.5],
};

export function getColors(level: number) {
  const MAX_LEVEL = 10;
  const l = Math.max(0, Math.min(MAX_LEVEL, level));

  const hueStart = 200;
  const hueEnd = 280;

  const hue = hueStart + ((hueEnd - hueStart) * l) / MAX_LEVEL;

  const saturation = 85 - l * 2;
  const lightness = 92 - l * 6;

  return { levelColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`, textColor: lightness < 70 ? '#fff' : '#000' };
}
