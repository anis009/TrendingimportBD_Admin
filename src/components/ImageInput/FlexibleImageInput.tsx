import React, { useState, useEffect } from 'react';
import { Upload, Button, message, Image, Card } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import { media_url } from '../../constants';

interface FlexibleImageInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  uploadText?: string;
  accept?: string;
  maxSize?: number; // in MB
  customRequest?: (file: RcFile) => Promise<string>; // Custom upload function
}

const FlexibleImageInput: React.FC<FlexibleImageInputProps> = ({
  value = '',
  onChange,
  uploadText = 'Click or drag file to upload',
  accept = 'image/*',
  maxSize = 5, // 5MB default
  customRequest, // Custom upload function
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  // Handle initial value - when editing an existing product
  useEffect(() => {
    if (value && fileList.length === 0) {
      const existingFile: UploadFile = {
        uid: 'existing-image',
        name: 'Existing Image',
        status: 'done',
        url: value,
      };
      setFileList([existingFile]);
    } else if (!value && fileList.length > 0) {
      // Clear fileList if value is cleared
      setFileList([]);
    }
  }, [value]); // Remove fileList from dependencies to avoid infinite loop

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

      // Create new file list item
      const newFile: UploadFile = {
        uid: Date.now().toString(),
        name: (file as RcFile).name,
        status: 'done',
        url: uploadedUrl,
      };

      // Update file list
      setFileList([newFile]);

      // Update form value
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

  // Get current image URL for preview
  const getImageUrl = () => {
    return value || fileList[0]?.url || null;
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
      {/* Upload Mode Only */}
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
                message.error('Failed to load image');
              }}
            />
          </div>
        </Card>
      )}

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
