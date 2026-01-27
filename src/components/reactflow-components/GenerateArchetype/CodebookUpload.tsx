import { Button, Input, message, Upload, UploadFile } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, Edge } from '@xyflow/react';
import { useDropzone } from 'react-dropzone';
import { CloseOutlined, FileOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { uploadArchetypeCodebook } from '@app/api/archetypes.api';
import { getUploadJobStatus } from '@app/api/job.api';

type CodebookUploadProps = {
  onBack: () => void;
  projectId: string;
  onGraphGenerated?: (nodes: Node[], edges: Edge[]) => void;
  setShowCodebookUpload: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CodebookUpload: React.FC<CodebookUploadProps> = ({
  onBack,
  projectId,
  onGraphGenerated,
  setShowCodebookUpload,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const isPdf = file.type === 'application/pdf';
      if (!isPdf) {
        message.error('You can only upload PDF files!');
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const handleGenerateFromCodebook = () => {
    setShowCodebookUpload(true);
  };

  // Poll job status using React Query
  const { data: jobStatus, isError } = useQuery({
    queryKey: ['codebookJobStatus', jobId],
    queryFn: () => getUploadJobStatus(jobId!),
    enabled: !!jobId && isProcessing,
    refetchInterval: 3000, // Poll every 3 seconds
    retry: 3,
  });

  // Handle job status updates
  useEffect(() => {
    if (jobStatus) {
      console.log('Job status update:', jobStatus);

      if (jobStatus.status === 'completed' && jobStatus.result) {
        setIsProcessing(false);
        console.log('Job completed! Result:', jobStatus.result);
        message.success('Archetype structure generated from codebook!');

        // Update the graph
        if (onGraphGenerated) {
          console.log('setting the nodes in the graph into the ones from the llm');
          onGraphGenerated(jobStatus.result.nodes, jobStatus.result.edges);
        }

        // Reset state
        setJobId(null);
        setSelectedFile(null);
        setAdditionalContext('');
        setShowCodebookUpload(false);
      } else if (jobStatus.status === 'failed') {
        setIsProcessing(false);
        console.error('Job failed:', jobStatus.error);
        message.error(jobStatus.error || 'Failed to process codebook.');
        setJobId(null);
      } else if (jobStatus.status === 'processing') {
        console.log('Job still processing...');
      }
    }
  }, [jobStatus, onGraphGenerated, setShowCodebookUpload]);

  // Handle polling errors
  useEffect(() => {
    if (isError) {
      setIsProcessing(false);
      console.error('Failed to check job status');
      message.error('Failed to check processing status');
      setJobId(null);
    }
  }, [isError]);

  const handleCodebookSubmit = async () => {
    console.log('Codebook file:', selectedFile);
    console.log('Additional context:', additionalContext);

    try {
      setIsProcessing(true);

      // Upload file and get jobId
      const { jobId: newJobId } = await uploadArchetypeCodebook(projectId, selectedFile, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log('Upload progress:', percentCompleted, '%');
      });

      console.log('Upload successful! Job ID:', newJobId);
      setJobId(newJobId);
      // React Query will start polling automatically when jobId is set
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('Failed to upload codebook. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCancelCodebook = () => {
    setSelectedFile(null);
    setAdditionalContext('');
    setJobId(null);
    setIsProcessing(false);
    setShowCodebookUpload(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
      <div className="mb-6">
        <h3 className="text-lg font-medium font-inter text-black mb-2">
          {t('project.createTemplate.form.step2.generateFromCodebook.title')}
        </h3>
        <p className="text-sm font-light font-inter text-gray-600">
          {t('project.createTemplate.form.step2.generateFromCodebook.description')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="mb-6">
          <label className="block text-sm font-medium font-inter text-black mb-2">
            {t('project.createTemplate.form.step2.generateFromCodebook.upload.label')}
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive || dragActive
                ? 'border-blue-500 bg-blue-50'
                : selectedFile
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
                    handleRemoveFile();
                  }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <InboxOutlined className="text-5xl text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium font-inter text-black">
                    {isDragActive ? 'Drop your file here' : 'Upload a file'}
                  </p>
                  <p className="text-sm text-gray-500 font-inter">
                    {t('project.createTemplate.form.step2.generateFromCodebook.upload.instructions')}
                  </p>
                  <p className="text-xs text-gray-400 font-inter mt-1">
                    {t('project.createTemplate.form.step2.generateFromCodebook.upload.fileSize')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium font-inter text-black mb-2">
            {t('project.createTemplate.form.step2.generateFromCodebook.additionalContext.title')}
          </label>
          <Input.TextArea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder={t('project.createTemplate.form.step2.generateFromCodebook.additionalContext.placeholder')}
            rows={6}
            className="font-inter"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button onClick={handleCancelCodebook} className="flex items-center h-9 text-xs font-medium font-inter">
          {t('project.createTemplate.form.step2.generateFromCodebook.cancel')}
        </Button>
        <Button
          type="primary"
          onClick={handleCodebookSubmit}
          disabled={!selectedFile || isProcessing}
          loading={isProcessing}
          icon={<UploadOutlined />}
          className="flex items-center h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
        >
          {isProcessing
            ? t('project.createTemplate.form.step2.generateFromCodebook.processing')
            : t('project.createTemplate.form.step2.generateFromCodebook.submit')}
        </Button>
      </div>
    </div>
  );
};
