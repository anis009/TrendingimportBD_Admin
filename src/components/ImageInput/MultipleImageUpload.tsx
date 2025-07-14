import React, { useState, useEffect } from 'react';
import { Upload, message, Image, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd/es/upload/interface';
import { RcFile } from 'antd/es/upload';
import { media_url } from '../../constants';

interface MultipleImageUploadProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  maxCount?: number;
  maxSize?: number; // in MB
  customRequest?: (file: RcFile) => Promise<string>;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  value = [],
  onChange,
  maxCount = 8,
  maxSize = 10,
  customRequest,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Helper function to get the full image URL for display
  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${media_url}${url.startsWith('/') ? url : '/' + url}`;
  };

  // Handle initial value - when editing an existing product
  useEffect(() => {
    if (
      value &&
      Array.isArray(value) &&
      value.length > 0 &&
      fileList.length === 0
    ) {
      const existingFiles: UploadFile[] = value.map(
        (url: string, index: number) => ({
          uid: `existing-${index}-${Date.now()}`,
          name: `Image ${index + 1}`,
          status: 'done',
          url: url, // Store path only, but display with full URL
          thumbUrl: getFullImageUrl(url), // For display in upload list
        }),
      );
      setFileList(existingFiles);
    } else if (!value || value.length === 0) {
      setFileList([]);
    }
  }, [value]);

  // Handle file upload
  const handleUpload = async (file: RcFile): Promise<string> => {
    if (customRequest) {
      return await customRequest(file);
    }

    // Default implementation - you should replace this with your actual upload logic
    throw new Error('No upload function provided');
  };

  // Handle multiple file selection
  const handleMultipleUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];

    // Validate all files first
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file type
      if (!file.type.startsWith('image/')) {
        message.error(`${file.name} is not an image file!`);
        continue;
      }

      // Check file size
      if (file.size / 1024 / 1024 > maxSize) {
        message.error(`${file.name} must be smaller than ${maxSize}MB!`);
        continue;
      }

      // Check total count
      if (fileList.length + validFiles.length >= maxCount) {
        message.warning(
          `Maximum ${maxCount} images allowed. Some files were skipped.`,
        );
        break;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      // Upload all valid files
      const uploadPromises = validFiles.map(async (file) => {
        try {
          const uploadedPath = await handleUpload(file as RcFile); // This returns path only
          return {
            uid: `${Date.now()}-${Math.random()}`,
            name: file.name,
            status: 'done' as const,
            url: uploadedPath, // Store path only
            thumbUrl: getFullImageUrl(uploadedPath), // For display
          };
        } catch (error) {
          message.error(`Failed to upload ${file.name}`);
          return null;
        }
      });

      const uploadResults = await Promise.all(uploadPromises);
      const successfulUploads = uploadResults.filter(Boolean) as UploadFile[];

      if (successfulUploads.length > 0) {
        // Update file list
        const newFileList = [...fileList, ...successfulUploads];
        setFileList(newFileList);

        // Update form field with paths only (no domain)
        const imagePaths = newFileList
          .map((img) => img.url)
          .filter(Boolean) as string[];
        onChange?.(imagePaths);

        message.success(
          `${successfulUploads.length} images uploaded successfully!`,
        );
      }
    } catch (error) {
      message.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Upload props
  const uploadProps: UploadProps = {
    name: 'media',
    multiple: true, // Allow multiple file selection
    listType: 'picture-card',
    fileList: fileList.map((file) => ({
      ...file,
      url: getFullImageUrl(file.url || ''), // Ensure full URL for display
    })),
    beforeUpload: () => false, // Always prevent automatic upload
    onChange: async ({ fileList: newFileList }) => {
      // Handle new files that were added
      const newFiles = newFileList.filter(
        (file) =>
          file.originFileObj &&
          !fileList.some((existing) => existing.uid === file.uid),
      );

      if (newFiles.length > 0) {
        const files = newFiles
          .map((file) => file.originFileObj)
          .filter(Boolean) as File[];
        if (files.length > 0) {
          const fileListData = new DataTransfer();
          files.forEach((file) => fileListData.items.add(file));
          await handleMultipleUpload(fileListData.files);
        }
      }
    },
    onRemove: (file) => {
      const newFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(newFileList);

      // Update form field with remaining image paths (no domain)
      const imagePaths = newFileList
        .map((img) => img.url)
        .filter(Boolean) as string[];
      onChange?.(imagePaths);

      message.success('Image removed successfully');
    },
    onPreview: (file) => {
      if (file.url) {
        setPreviewImage(getFullImageUrl(file.url));
        setPreviewVisible(true);
      }
    },
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
    accept: 'image/*',
  };

  return (
    <div className="multiple-image-upload">
      <Upload {...uploadProps}>
        {fileList.length >= maxCount ? null : (
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>
              {uploading ? 'Uploading...' : 'Upload Images'}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
              Select multiple files
            </div>
            {uploading && (
              <div className="ant-upload-loading-icon">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mt-2"></div>
              </div>
            )}
          </div>
        )}
      </Upload>

      {/* Alternative: Add a separate button for multiple upload */}
      {fileList.length < maxCount && (
        <div style={{ marginTop: 8 }}>
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            id="multiple-upload-input"
            onChange={(e) => {
              if (e.target.files) {
                handleMultipleUpload(e.target.files);
                e.target.value = ''; // Reset input
              }
            }}
          />
          <Button
            onClick={() =>
              document.getElementById('multiple-upload-input')?.click()
            }
            loading={uploading}
            disabled={fileList.length >= maxCount}
          >
            Select Multiple Images
          </Button>
        </div>
      )}

      {/* Preview Modal */}
      <Image
        style={{ display: 'none' }}
        src={previewImage}
        preview={{
          visible: previewVisible,
          onVisibleChange: setPreviewVisible,
        }}
      />
    </div>
  );
};

export default MultipleImageUpload;
