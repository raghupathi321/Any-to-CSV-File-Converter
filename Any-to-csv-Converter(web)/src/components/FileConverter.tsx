import React, { useState, useCallback, Suspense } from 'react';
import FileUploader from './FileUploader';
import FileInfo from './FileInfo';
import DataPreview from './DataPreview';
import ConversionOptions from './ConversionOptions';
import ConversionActions from './ConversionActions';
import { FileData } from '../types';
import { convertToCSV } from '../utils/fileUtils';

// Lazy load the DataAnalysis component since it's not needed immediately
const DataAnalysis = React.lazy(() => import('./DataAnalysis'));

const FileConverter: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [options, setOptions] = useState({
    flattenNested: false,
    includeHeaders: true,
    previewLines: 10,
  });

  const handleFileSelected = useCallback((data: FileData) => {
    setFileData(data);
    setIsConverted(false);
  }, []);

  const handleConvert = async () => {
    if (!fileData) return;

    setIsConverting(true);
    try {
      // Simulate processing time with a loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsConverted(true);
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = useCallback(() => {
    if (!fileData || !isConverted || !fileData.previewData?.length) {
      console.warn('Nothing to download. Missing file data or conversion not done.');
      return;
    }

    try {
      const csv = convertToCSV(fileData.previewData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileData.name.split('.')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  }, [fileData, isConverted]);

  const handleOptionChange = useCallback((name: string, value: boolean | number) => {
    setOptions(prev => ({
      ...prev,
      [name]: value
    }));
    setIsConverted(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
        {!fileData ? (
          <FileUploader onFileSelected={handleFileSelected} />
        ) : (
          <div className="divide-y divide-gray-200">
            <FileInfo fileData={fileData} />
            <DataPreview fileData={fileData} />
            {isConverted && (
              <Suspense fallback={
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading analysis...</p>
                </div>
              }>
                <DataAnalysis data={fileData.previewData} />
              </Suspense>
            )}
            <ConversionOptions 
              options={options} 
              onOptionChange={handleOptionChange} 
              fileType={fileData.type}
            />
            <ConversionActions
              onConvert={handleConvert}
              onDownload={handleDownload}
              isConverting={isConverting}
              isConverted={isConverted}
              hasFile={!!fileData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(FileConverter);