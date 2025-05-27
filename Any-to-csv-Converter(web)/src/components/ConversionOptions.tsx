import React from 'react';
import { Settings } from 'lucide-react';
import { FileType } from '../types';

interface ConversionOptionsProps {
  options: {
    flattenNested: boolean;
  };
  onOptionChange: (name: string, value: boolean) => void;
  fileType: FileType;
}

const ConversionOptions: React.FC<ConversionOptionsProps> = ({ 
  options, 
  onOptionChange,
  fileType
}) => {
  const showFlattenOption = fileType === 'json' || fileType === 'xml';
  
  if (!showFlattenOption) {
    return null;
  }

  return (
    <div className="p-5 bg-gray-50">
      <div className="flex items-center mb-3">
        <Settings className="h-4 w-4 text-gray-500 mr-2" />
        <h3 className="font-medium text-gray-700">Conversion Options</h3>
      </div>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-teal-500 rounded border-gray-300 focus:ring-teal-500 transition duration-150 ease-in-out"
            checked={options.flattenNested}
            onChange={(e) => onOptionChange('flattenNested', e.target.checked)}
          />
          <div>
            <span className="text-gray-700">Flatten nested structures</span>
            <p className="text-xs text-gray-500 mt-1">
              Convert nested objects or arrays to flat CSV structure with dot notation
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ConversionOptions;