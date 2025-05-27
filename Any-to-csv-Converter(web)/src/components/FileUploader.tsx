import React, { useState, useRef } from 'react';
import { Upload, FileUp } from 'lucide-react';
import { FileData, FileType } from '../types';
import { formatFileSize, detectFileType, generatePreviewData } from '../utils/fileUtils';

interface FileUploaderProps {
  onFileSelected: (fileData: FileData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragError('');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const fileType = detectFileType(file.name);
    
    if (!fileType) {
      setDragError('Unsupported file format. Please upload JSON, XML, Excel, or TSV files.');
      return;
    }

    setIsProcessing(true);
    setDragError('');
    
    try {
      const previewData = await generatePreviewData(file, fileType);
      
      onFileSelected({
        name: file.name,
        size: formatFileSize(file.size),
        type: fileType,
        rawSize: file.size,
        content: '',
        previewData
      });
    } catch (error) {
      setDragError('Error reading file. Please make sure the file is valid and try again.');
      console.error('File processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`p-12 flex flex-col items-center justify-center transition-all duration-500 glass-card rounded-2xl ${
        isDragging 
          ? 'bg-teal-50/80 border-2 border-dashed border-teal-300 scale-102' 
          : ''
      } ${dragError ? 'border-red-300' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ minHeight: '400px' }}
    >
      <div className="text-center animate-float">
        <div className="mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-100 to-teal-50 p-4 inline-flex shadow-lg">
          <Upload 
            className={`h-12 w-12 ${isDragging ? 'text-teal-500' : 'text-teal-400'} transition-colors duration-300 ${
              isProcessing ? 'animate-spin' : ''
            }`} 
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {isProcessing ? 'Processing file...' : isDragging ? 'Drop your file here' : 'Drag & Drop your file'}
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Supports JSON, XML, Excel, or TSV files
        </p>
        
        {dragError && (
          <div className="text-red-500 mb-6 text-sm bg-red-50 px-6 py-3 rounded-lg inline-block">
            {dragError}
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <span className="text-gray-500">or</span>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
        
        <button
          onClick={handleBrowseClick}
          disabled={isProcessing}
          className={`mt-6 btn-primary inline-flex items-center group ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FileUp className="mr-2 h-5 w-5 group-hover:animate-bounce" />
          Browse Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".json,.xml,.xlsx,.xls,.tsv"
          onChange={handleFileInputChange}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default FileUploader;