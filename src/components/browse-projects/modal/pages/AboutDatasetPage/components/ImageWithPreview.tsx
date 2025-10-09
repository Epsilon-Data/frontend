import { useState } from 'react';
import { Image } from 'antd';
import { RxEnterFullScreen } from 'react-icons/rx';

type ImageWithPreviewProps = {
  src: string;
  alt?: string;
};

export const ImageWithPreview: React.FC<ImageWithPreviewProps> = ({ src, alt }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative w-75 h-48 rounded-lg overflow-hidden bg-[#eee]">
      <Image.PreviewGroup>
        <Image
          src={src}
          alt={alt}
          className="w-full h-full object-cover block pointer-events-none"
          preview={{
            mask: false,
            visible,
            onVisibleChange: (value) => {
              console.log('visible', value);
              setVisible(value);
            },
            src: src,
          }}
        />
      </Image.PreviewGroup>

      <button
        onClick={() => setVisible(true)}
        className="absolute bottom-3 right-3 bg-white rounded-lg border-none padding py-2 px-2 cursor-pointer shadow-button"
      >
        <RxEnterFullScreen />
      </button>
    </div>
  );
};
