
import React, { useState, useCallback, DragEvent } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(!disabled) setIsDragging(true);
  }, [disabled]);
  
  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if(disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [disabled]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Upload Photo
      </label>
      <div
        className={`relative group flex justify-center items-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-purple-500' : 'border-gray-600'} border-dashed rounded-lg ${disabled ? 'opacity-50' : 'cursor-pointer hover:border-purple-400 transition-colors'}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => !disabled && document.getElementById('file-upload')?.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
        ) : (
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <div className="flex text-sm text-gray-400">
              <p className="pl-1">
                {isDragging ? 'Drop the file here' : 'Drag & drop a photo, or click to upload'}
              </p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          disabled={disabled}
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </div>
    </div>
  );
};

export default FileUpload;
