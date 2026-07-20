import { Button, Input, Progress, Segmented, Tag, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { CloseOutlined, FileOutlined, InboxOutlined, LinkOutlined, UploadOutlined } from '@ant-design/icons';
import {
  getSyntheticData,
  removeSyntheticData,
  setSyntheticDataLink,
  uploadSyntheticData,
  SyntheticDataInfo,
} from '@app/api/projects.api';
import { InputLabel } from '@app/components/common/Modal/InputLabel/InputLabel';

type SyntheticDataManagerProps = {
  projectId: string;
};

const isValidUrl = (value: string): boolean => {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
};

export const SyntheticDataManager: React.FC<SyntheticDataManagerProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<SyntheticDataInfo>({ type: 'none' });
  const [mode, setMode] = useState<'link' | 'upload'>('link');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const current = await getSyntheticData(projectId);
        if (!active) return;
        setData(current);
        if (current.type === 'link' && current.url) setUrl(current.url);
        setMode(current.type === 'file' ? 'upload' : 'link');
      } catch {
        if (active) message.error(t('project.main.settings.syntheticData.failed.load'));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [projectId, t]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.csv')) {
        message.error(t('project.main.settings.syntheticData.upload.onlyCsv'));
        return;
      }
      setSelectedFile(file);
    },
    [t],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    maxSize: 100 * 1024 * 1024,
  });

  const handleSaveLink = async () => {
    if (!isValidUrl(url)) {
      message.error(t('project.main.settings.syntheticData.link.invalid'));
      return;
    }
    setSaving(true);
    try {
      const result = await setSyntheticDataLink(projectId, url.trim());
      setData(result);
      message.success(t('project.main.settings.syntheticData.success.saved'));
    } catch {
      message.error(t('project.main.settings.syntheticData.failed.save'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setSaving(true);
    setProgress(0);
    try {
      const result = await uploadSyntheticData(projectId, selectedFile, (e) => {
        setProgress(Math.round((e.loaded * 100) / (e.total || 1)));
      });
      setData(result);
      setSelectedFile(null);
      message.success(t('project.main.settings.syntheticData.success.saved'));
    } catch {
      message.error(t('project.main.settings.syntheticData.failed.save'));
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    try {
      const result = await removeSyntheticData(projectId);
      setData(result);
      setUrl('');
      setSelectedFile(null);
      message.success(t('project.main.settings.syntheticData.success.removed'));
    } catch {
      message.error(t('project.main.settings.syntheticData.failed.remove'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl mt-8 p-8">
      <InputLabel
        inputTitle={t('project.main.settings.syntheticData.title')}
        inputDescription={t('project.main.settings.syntheticData.description')}
      />

      {/* Current state */}
      <div className="mb-6">
        {loading ? (
          <span className="text-sm font-inter text-grey-1">…</span>
        ) : data.type === 'link' ? (
          <div className="flex items-center gap-3">
            <Tag icon={<LinkOutlined />} color="blue">
              {t('project.main.settings.syntheticData.current.linked')}
            </Tag>
            <a
              href={data.url ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-inter text-blueDark truncate max-w-md"
            >
              {data.url}
            </a>
            <Button size="small" danger onClick={handleRemove} disabled={saving}>
              {t('project.main.settings.syntheticData.current.remove')}
            </Button>
          </div>
        ) : data.type === 'file' ? (
          <div className="flex items-center gap-3">
            <Tag icon={<FileOutlined />} color="green">
              {t('project.main.settings.syntheticData.current.uploaded')}
            </Tag>
            <span className="text-sm font-inter text-black">{data.fileName}</span>
            <Button size="small" danger onClick={handleRemove} disabled={saving}>
              {t('project.main.settings.syntheticData.current.remove')}
            </Button>
          </div>
        ) : (
          <span className="text-sm font-inter text-grey-1">
            {t('project.main.settings.syntheticData.current.none')}
          </span>
        )}
      </div>

      {/* Link / Upload toggle */}
      <Segmented
        className="mb-6"
        value={mode}
        onChange={(value) => setMode(value as 'link' | 'upload')}
        options={[
          { label: t('project.main.settings.syntheticData.tabs.link'), value: 'link', icon: <LinkOutlined /> },
          { label: t('project.main.settings.syntheticData.tabs.upload'), value: 'upload', icon: <UploadOutlined /> },
        ]}
      />

      {mode === 'link' ? (
        <div className="max-w-2xl">
          <label className="block text-sm font-medium font-inter text-black mb-2">
            {t('project.main.settings.syntheticData.link.label')}
          </label>
          <div className="flex items-center gap-3">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('project.main.settings.syntheticData.link.placeholder')}
              className="font-inter"
            />
            <Button
              type="primary"
              onClick={handleSaveLink}
              loading={saving}
              disabled={!url}
              className="flex items-center h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
            >
              {t('project.main.settings.syntheticData.link.button')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <label className="block text-sm font-medium font-inter text-black mb-2">
            {t('project.main.settings.syntheticData.upload.label')}
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
                <FileOutlined className="text-3xl text-blue-500" />
                <div className="text-left flex-1">
                  <p className="font-medium font-inter text-black">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500 font-inter">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<CloseOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <InboxOutlined className="text-5xl text-gray-400 mx-auto" />
                <p className="text-base font-medium font-inter text-black">
                  {t('project.main.settings.syntheticData.upload.instructions')}
                </p>
                <p className="text-xs text-gray-400 font-inter">
                  {t('project.main.settings.syntheticData.upload.fileSize')}
                </p>
              </div>
            )}
          </div>
          {saving && progress > 0 && <Progress percent={progress} className="mt-3" />}
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={!selectedFile || saving}
            loading={saving}
            icon={<UploadOutlined />}
            className="flex items-center h-9 mt-4 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
          >
            {t('project.main.settings.syntheticData.upload.button')}
          </Button>
        </div>
      )}
    </div>
  );
};
