import React from 'react';
import { FileData } from '../types';
import { FileJson, FileSpreadsheet, FileText, File, AlertCircle } from 'lucide-react';

interface FileInfoProps {
  fileData: FileData;
}

const FileInfo: React.FC<FileInfoProps> = ({ fileData }) => {
  const getFileIcon = () => {
    switch (fileData.type) {
      case 'json':
        return <FileJson className="h-6 w-6 text-blue-500" />;
      case 'xml':
        return <FileText className="h-6 w-6 text-orange-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-6 w-6 text-green-600" />;
      case 'tsv':
        return <FileText className="h-6 w-6 text-purple-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const getFileTypeLabel = () => {
    switch (fileData.type) {
      case 'json':
        return 'JSON';
      case 'xml':
        return 'XML';
      case 'excel':
        return 'Excel';
      case 'tsv':
        return 'TSV';
      default:
        return 'Unknown';
    }
  };

  const getFileTypeDescription = () => {
    switch (fileData.type) {
      case 'json':
        return 'JavaScript Object Notation';
      case 'xml':
        return 'eXtensible Markup Language';
      case 'excel':
        return 'Microsoft Excel Spreadsheet';
      case 'tsv':
        return 'Tab-Separated Values';
      default:
        return '';
    }
  };

  return (
    <div className="p-5 bg-white flex items-start space-x-4 card-hover">
      <div className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm group hover:shadow-md transition-all duration-200">
        {getFileIcon()}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-gray-900 truncate" title={fileData.name}>
          {fileData.name}
        </h3>
        <div className="flex flex-wrap gap-3 mt-2 text-sm">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {getFileTypeLabel()}
          </span>
          <span className="text-gray-500">{fileData.size}</span>
          <span className="text-gray-400 hidden sm:inline">{getFileTypeDescription()}</span>
        </div>
      </div>
      {fileData.rawSize > 5 * 1024 * 1024 && (
        <div className="flex-shrink-0 flex items-center text-amber-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          Large file
        </div>
      )}
    </div>
  );
};

export default FileInfo;