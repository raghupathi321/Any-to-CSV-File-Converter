import React from 'react';
import { FileData } from '../types';

interface DataPreviewProps {
  fileData: FileData;
}

const DataPreview: React.FC<DataPreviewProps> = ({ fileData }) => {
  if (!fileData.previewData.length) {
    return (
      <div className="p-5 text-center text-gray-500">
        No preview data available
      </div>
    );
  }

  return (
    <div className="p-5">
      <h3 className="font-medium text-gray-700 mb-3">Data Preview (First 10 rows)</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {fileData.previewData[0].map((header, index) => (
                <th 
                  key={index}
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header || `Column ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fileData.previewData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap truncate max-w-xs"
                    title={cell}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPreview;