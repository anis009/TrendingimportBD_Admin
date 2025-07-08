import React, { useState } from 'react';
import { Upload, Input, Button, Switch, message, Image, Card } from 'antd';
import {
  UploadOutlined,
  LinkOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import { media_url } from '../../constants';

interface FlexibleImageInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onModeChange?: (mode: 'upload' | 'url') => void;
  placeholder?: string;
  uploadText?: string;
  accept?: string;
  maxSize?: number; // in MB
  defaultMode?: 'upload' | 'url';
  customRequest?: (file: RcFile) => Promise<string>; // Custom upload function
}
const FlexibleImageInput: React.FC<FlexibleImageInputProps> = ({
  value = '',
  onChange,
  onModeChange,
  placeholder = 'Enter image URL',
  uploadText = 'Click or drag file to upload',
  accept = 'image/*',
  maxSize = 5, // 5MB default
  defaultMode = 'url',
  customRequest, // Custom upload function
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>(defaultMode);
  const [urlValue, setUrlValue] = useState(value);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  // Handle mode toggle
  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? 'upload' : 'url';
    setMode(newMode);
    onModeChange?.(newMode);

    // Clear current value when switching modes
    if (newMode === 'url') {
      setFileList([]);
      setUrlValue('');
      onChange?.('');
    } else {
      setUrlValue('');
      onChange?.('');
    }
  };

  // Handle URL input change  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUrlValue(newValue);
    onChange?.(newValue);
  };

  // Handle file upload
  const handleUpload = async (file: RcFile): Promise<string> => {
    if (customRequest) {
      return await customRequest(file);
    }
    // Default mock implementation
    return new Promise((resolve) => {
      // Mock upload - replace this with your actual upload implementation
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload delay
      setTimeout(() => {
        // For now, create a temporary URL for preview
        const tempUrl = URL.createObjectURL(file);
        resolve(tempUrl);
      }, 1000);
    });
  };
  // Custom upload behavior
  const customUpload: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      setUploading(true);

      // Validate file size
      const fileSize = (file as RcFile).size / 1024 / 1024; // Convert to MB
      if (fileSize > maxSize) {
        message.error(`File size must be smaller than ${maxSize}MB`);
        onError?.(new Error('File too large'));
        return;
      }

      // Validate file type
      if (
        !accept.includes('*') &&
        !(file as RcFile).type.startsWith('image/')
      ) {
        message.error('Please upload an image file');
        onError?.(new Error('Invalid file type'));
        return;
      }

      // Upload file
      const uploadedUrl = await handleUpload(file as RcFile);

      console.log('uploadedUrl~~', uploadedUrl);
      // Update states
      onChange?.(uploadedUrl);
      onSuccess?.(uploadedUrl);
      message.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed');
      onError?.(error as Error);
    } finally {
      setUploading(false);
    }
  };

  // Handle file list change
  const handleFileListChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    // If file is removed, clear the value
    if (newFileList.length === 0) {
      onChange?.('');
    }
  };

  // Remove uploaded file
  const handleRemove = () => {
    setFileList([]);
    onChange?.('');
  };

  // Validate URL format
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  // Get current image URL for preview
  const getImageUrl = () => {
    if (mode === 'url') {
      return urlValue && isValidUrl(urlValue) ? urlValue : null;
    } else {
      return value || fileList[0]?.url || null;
    }
  };

  // Helper function to get the full image URL
  const getFullImageUrl = (url: string) => {
    // If URL is already complete (starts with http/https), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If URL is relative, prepend media_url
    return `${media_url}${url.startsWith('/') ? url : '/' + url}`;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="flexible-image-input">
      {/* Mode Toggle */}
      <div className="mb-4 flex items-center gap-3">
        <LinkOutlined />
        <Switch
          checked={mode === 'upload'}
          onChange={handleModeChange}
          checkedChildren="Upload"
          unCheckedChildren="URL"
        />
        <UploadOutlined />
        <span className="text-sm text-gray-600">
          {mode === 'upload' ? 'Upload file' : 'Enter URL'}
        </span>
      </div>
      {/* URL Input Mode */}
      {mode === 'url' && (
        <div className="space-y-3">
          <Input
            value={urlValue}
            onChange={handleUrlChange}
            placeholder={placeholder}
            prefix={<LinkOutlined />}
            status={urlValue && !isValidUrl(urlValue) ? 'error' : ''}
          />
          {urlValue && !isValidUrl(urlValue) && (
            <div className="text-red-500 text-sm">Please enter a valid URL</div>
          )}
        </div>
      )}
      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-3">
          <Upload.Dragger
            name="file"
            customRequest={customUpload}
            fileList={fileList}
            onChange={handleFileListChange}
            accept={accept}
            maxCount={1}
            showUploadList={false}
            disabled={uploading}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">{uploadText}</p>
            <p className="ant-upload-hint">
              Support for single image upload. Max size: {maxSize}MB
            </p>
          </Upload.Dragger>

          {uploading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2">Uploading...</span>
            </div>
          )}
        </div>
      )}
      {/* Image Preview */}
      {imageUrl && (
        <Card
          className="mt-4"
          size="small"
          title="Image Preview"
          extra={
            <div className="flex gap-2">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => setPreviewVisible(true)}
              >
                View
              </Button>
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          }
        >
          {' '}
          <div className="flex justify-center">
            <Image
              src={getFullImageUrl(imageUrl)}
              alt="Preview"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                objectFit: 'contain',
              }}
              preview={false}
              onError={() => {
                if (mode === 'url') {
                  message.error('Failed to load image from URL');
                }
              }}
            />
          </div>
        </Card>
      )}{' '}
      {/* Full Size Preview Modal */}
      {imageUrl && (
        <Image
          style={{ display: 'none' }}
          src={getFullImageUrl(imageUrl)}
          preview={{
            visible: previewVisible,
            onVisibleChange: setPreviewVisible,
          }}
        />
      )}
    </div>
  );
};

export default FlexibleImageInput;
