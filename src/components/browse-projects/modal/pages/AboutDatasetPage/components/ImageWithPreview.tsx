import { useState } from 'react';
import { Image } from 'antd';
import { RxEnterFullScreen } from 'react-icons/rx';

type ImageWithPreviewProps = {
  src: string;
  alt?: string;
};

export const ImageWithPreview: React.FC<ImageWithPreviewProps> = ({ src, alt }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-75 h-48 rounded-lg overflow-hidden bg-[#eee]">
      <Image.PreviewGroup>
        <Image
          src={src}
          alt={alt}
          className="w-full h-full object-cover block pointer-events-none"
          preview={{
            mask: false,
            open,
            onOpenChange: (value) => {
              console.log('visible', value);
              setOpen(value);
            },
            src: src,
          }}
        />
      </Image.PreviewGroup>

      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-3 right-3 bg-white rounded-lg border-none padding py-2 px-2 cursor-pointer shadow-button"
      >
        <RxEnterFullScreen />
      </button>
    </div>
  );
};
