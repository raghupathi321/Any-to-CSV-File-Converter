import React, { Suspense } from 'react';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load the FileConverter component
const FileConverter = React.lazy(() => import('./components/FileConverter'));

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-teal-50/30 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
          }>
            <FileConverter />
          </Suspense>
        </ErrorBoundary>
      </main>
      <footer className="bg-white/80 backdrop-blur-sm py-6 border-t border-gray-200/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 File to CSV Converter - Convert your files directly in browser
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Secure • Fast • Free
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;