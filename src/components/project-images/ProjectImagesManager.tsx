import { DatasetImage, getProjectImages, removeProjectImage, uploadProjectImage } from '@app/api/projects.api';
import { InputLabel } from '@app/components/common/Modal/InputLabel/InputLabel';
import { useProjectOptional } from '@app/hooks/useProjectContext';
import { CloseOutlined, DeleteOutlined, InboxOutlined, PictureOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Image, Input, Progress, Tag, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

type ProjectImagesManagerProps = {
  projectId: string;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ProjectImagesManager: React.FC<ProjectImagesManagerProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const projectContext = useProjectOptional();
  const updateProjectLocally = projectContext?.updateProjectLocally;
  const [images, setImages] = useState<DatasetImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const syncImages = useCallback(
    (nextImages: DatasetImage[]) => {
      setImages(nextImages);
      updateProjectLocally?.((prev) => (prev ? { ...prev, datasetImages: nextImages } : prev));
    },
    [updateProjectLocally],
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const current = await getProjectImages(projectId);
        if (active) syncImages(current);
      } catch {
        if (active) message.error(t('project.main.settings.datasetImages.failed.load'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [projectId, syncImages, t]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        message.error(t('project.main.settings.datasetImages.upload.invalidType'));
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        message.error(t('project.main.settings.datasetImages.upload.tooLarge'));
        return;
      }
      setSelectedFile(file);
    },
    [t],
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      const firstError = fileRejections[0]?.errors[0];
      if (firstError?.code === 'file-too-large') {
        message.error(t('project.main.settings.datasetImages.upload.tooLarge'));
        return;
      }
      message.error(t('project.main.settings.datasetImages.upload.invalidType'));
    },
    [t],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: false,
    maxSize: MAX_IMAGE_SIZE,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    setSaving(true);
    setProgress(0);
    try {
      const result = await uploadProjectImage(projectId, selectedFile, caption.trim(), (event) => {
        setProgress(Math.round((event.loaded * 100) / (event.total || 1)));
      });
      syncImages(result);
      setSelectedFile(null);
      setCaption('');
      message.success(t('project.main.settings.datasetImages.success.saved'));
    } catch {
      message.error(t('project.main.settings.datasetImages.failed.save'));
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  const handleRemove = async (imageId: string) => {
    setSaving(true);
    try {
      const result = await removeProjectImage(projectId, imageId);
      syncImages(result);
      message.success(t('project.main.settings.datasetImages.success.removed'));
    } catch {
      message.error(t('project.main.settings.datasetImages.failed.remove'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl mt-8 p-8">
      <InputLabel
        inputTitle={t('project.main.settings.datasetImages.title')}
        inputDescription={t('project.main.settings.datasetImages.description')}
      />

      <div className="mb-6">
        {loading ? (
          <span className="text-sm font-inter text-grey-1">...</span>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {images
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((image) => (
                <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="h-40 bg-grey-4 overflow-hidden">
                    <Image src={image.url} alt={image.caption ?? image.fileName} className="w-full h-40 object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <Tag icon={<PictureOutlined />} color="blue" className="truncate max-w-[12rem]">
                        {image.fileName}
                      </Tag>
                      <Button
                        size="small"
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(image.id)}
                        disabled={saving}
                        aria-label={t('project.main.settings.datasetImages.current.remove')}
                      />
                    </div>
                    {image.caption && <div className="text-sm font-inter text-black mt-3">{image.caption}</div>}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <span className="text-sm font-inter text-grey-1">
            {t('project.main.settings.datasetImages.current.none')}
          </span>
        )}
      </div>

      <div className="max-w-2xl">
        <label className="block text-sm font-medium font-inter text-black mb-2">
          {t('project.main.settings.datasetImages.upload.label')}
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive || selectedFile
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              <PictureOutlined className="text-3xl text-blue-500" />
              <div className="text-left flex-1 min-w-0">
                <p className="font-medium font-inter text-black truncate">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 font-inter">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button
                type="text"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedFile(null);
                }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <InboxOutlined className="text-5xl text-gray-400 mx-auto" />
              <p className="text-base font-medium font-inter text-black">
                {t('project.main.settings.datasetImages.upload.instructions')}
              </p>
              <p className="text-xs text-gray-400 font-inter">
                {t('project.main.settings.datasetImages.upload.fileSize')}
              </p>
            </div>
          )}
        </div>

        <label className="block text-sm font-medium font-inter text-black mt-4 mb-2">
          {t('project.main.settings.datasetImages.caption.label')}
        </label>
        <Input
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder={t('project.main.settings.datasetImages.caption.placeholder')}
          maxLength={140}
          className="font-inter"
        />

        {saving && progress > 0 && <Progress percent={progress} className="mt-3" />}
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={!selectedFile || saving}
          loading={saving}
          icon={<UploadOutlined />}
          className="flex items-center h-9 mt-4 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
        >
          {t('project.main.settings.datasetImages.upload.button')}
        </Button>
      </div>
    </div>
  );
};
