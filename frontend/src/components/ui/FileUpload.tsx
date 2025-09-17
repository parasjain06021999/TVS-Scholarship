'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '@/lib/api';
import { Button } from './Button';
import { XMarkIcon, DocumentIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// MANDATORY: File upload component with progress
interface FileUploadProps {
  acceptedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  onUpload: (files: any[]) => void;
  onError?: (error: string) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  acceptedTypes = ['image/*', 'application/pdf'],
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  onUpload,
  onError,
  multiple = true,
  disabled = false,
  className = "",
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // MANDATORY: File validation
  const validateFile = useCallback((file: File): string[] => {
    const errors: string[] = [];
    
    // File type validation
    if (acceptedTypes.length > 0) {
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });
      
      if (!isValidType) {
        errors.push(`File type ${file.type} is not allowed`);
      }
    }
    
    // File size validation
    if (maxSize && file.size > maxSize) {
      errors.push(`File size exceeds ${formatFileSize(maxSize)} limit`);
    }
    
    return errors;
  }, [acceptedTypes, maxSize]);

  // MANDATORY: Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // MANDATORY: Handle file selection
  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    if (disabled) return;

    const validFiles: UploadFile[] = [];
    const fileErrors: string[] = [];

    selectedFiles.forEach((file) => {
      const validationErrors = validateFile(file);
      if (validationErrors.length > 0) {
        fileErrors.push(`${file.name}: ${validationErrors.join(', ')}`);
      } else {
        validFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          progress: 0,
          status: 'pending'
        });
      }
    });

    if (fileErrors.length > 0) {
      onError?.(fileErrors.join('; '));
    }

    if (validFiles.length > 0) {
      setFiles(prev => {
        const newFiles = multiple ? [...prev, ...validFiles] : validFiles;
        return newFiles.slice(0, maxFiles);
      });
    }
  }, [disabled, validateFile, onError, multiple, maxFiles]);

  // MANDATORY: Upload file with progress
  const uploadFile = useCallback(async (uploadFile: UploadFile): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', uploadFile.file);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress: percentComplete, status: 'uploading' }
              : f
          ));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'completed', url: response.url }
              : f
          ));
          resolve(response);
        } else {
          const error = `Upload failed: ${xhr.statusText}`;
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, status: 'error', error }
              : f
          ));
          reject(new Error(error));
        }
      };

      xhr.onerror = () => {
        const error = 'Upload failed';
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'error', error }
            : f
        ));
        reject(new Error(error));
      };
      
      xhr.open('POST', '/api/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      xhr.send(formData);
    });
  }, []);

  // MANDATORY: Handle upload
  const handleUpload = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setUploading(true);
    
    try {
      const uploadPromises = pendingFiles.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      onUpload(results);
      
      // Clear completed files
      setFiles(prev => prev.filter(f => f.status !== 'completed'));
    } catch (error) {
      onError?.((error as any)?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [files, uploadFile, onUpload, onError]);

  // MANDATORY: Remove file
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // MANDATORY: Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelect,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    maxFiles,
    multiple,
    disabled,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <div className={`file-upload-container ${className}`}>
      {/* MANDATORY: Drop zone */}
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragActive || dragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="text-gray-600">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm">
            <span className="font-medium text-primary-600 hover:text-primary-500">
              Click to upload
            </span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {acceptedTypes.join(', ').toUpperCase()} up to {formatFileSize(maxSize)}
            {maxFiles > 1 && ` (max ${maxFiles} files)`}
          </p>
        </div>
      </div>

      {/* MANDATORY: File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center flex-1 min-w-0">
                <DocumentIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Progress bar */}
                {file.status === 'uploading' && (
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {/* Status icon */}
                {file.status === 'completed' && (
                  <CheckCircleIcon className="h-5 w-5 text-success-500" />
                )}

                {file.status === 'error' && (
                  <div className="text-error-500 text-xs">
                    {file.error}
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={file.status === 'uploading'}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {/* Upload button */}
          {files.some(f => f.status === 'pending') && (
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : `Upload ${files.filter(f => f.status === 'pending').length} file(s)`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// MANDATORY: File preview component
interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onRemove,
  className = "",
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div className={`file-preview ${className}`}>
      <div className="relative bg-gray-100 rounded-lg p-4">
        {preview ? (
          <img
            src={preview}
            alt={file.name}
            className="w-full h-32 object-cover rounded"
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center bg-gray-200 rounded">
            <DocumentIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-50"
          >
            <XMarkIcon className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};
