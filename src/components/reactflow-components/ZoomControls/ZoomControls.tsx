import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { Panel, useReactFlow } from 'reactflow';

export const ZoomControls = () => {
  const { zoomIn, zoomOut, getZoom } = useReactFlow();
  const [zoomLevel, setZoomLevel] = useState<number>(Math.round(getZoom() * 100));

  useEffect(() => {
    const interval = setInterval(() => {
      setZoomLevel(Math.round(getZoom() * 100));
    }, 200);
    return () => clearInterval(interval);
  }, [getZoom]);

  return (
    <Panel position="bottom-right">
      <div className="flex items-center bg-white border border-[#ddd] rounded-lg text-base p-1">
        <Button icon={<FaPlus />} size="small" onClick={() => zoomIn()} className="border-none bg-transparent mr-2.5" />
        <span className="w-12 text-center inline-block">{zoomLevel}%</span>
        <Button
          icon={<FaMinus />}
          size="small"
          onClick={() => zoomOut()}
          className="border-none bg-transparent ml-2.5"
        />
      </div>
    </Panel>
  );
};
