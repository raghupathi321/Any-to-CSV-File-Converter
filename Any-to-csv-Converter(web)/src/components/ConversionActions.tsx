import React from 'react';
import { RefreshCw, Download } from 'lucide-react';

interface ConversionActionsProps {
  onConvert: () => void;
  onDownload: () => void;
  isConverting: boolean;
  isConverted: boolean;
  hasFile: boolean;
}

const ConversionActions: React.FC<ConversionActionsProps> = ({
  onConvert,
  onDownload,
  isConverting,
  isConverted,
  hasFile
}) => {
  return (
    <div className="p-5 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
      <div>
        {isConverted && (
          <div className="text-sm text-green-600 flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Conversion completed successfully
          </div>
        )}
      </div>
      
      <div className="flex space-x-3">
        <button
          className={`px-4 py-2 rounded-md flex items-center justify-center text-sm transition-all duration-200 ${
            !hasFile || isConverting || isConverted
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
          disabled={!hasFile || isConverting || isConverted}
          onClick={onConvert}
        >
          {isConverting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            'Convert to CSV'
          )}
        </button>
        
        <button
          className={`px-4 py-2 rounded-md flex items-center justify-center text-sm transition-all duration-200 ${
            !isConverted
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={!isConverted}
          onClick={onDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default ConversionActions;