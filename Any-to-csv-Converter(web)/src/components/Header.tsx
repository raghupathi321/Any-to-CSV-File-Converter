import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-10 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-xl shadow-lg mr-4 group hover:scale-105 transition-transform duration-200">
              <FileSpreadsheet className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-200" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text">
                File to CSV Converter
              </h1>
              <p className="text-gray-600 text-sm mt-0.5 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Convert your files directly in browser • Fast & Secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);