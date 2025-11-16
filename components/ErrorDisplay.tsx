import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
  onReset: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry, onReset }) => {
  return (
    <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-xl shadow-lg animate-fade-in">
      <div className="flex justify-center items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h3 className="ml-3 text-xl font-semibold text-red-300">An Error Occurred</h3>
      </div>
      <p className="text-red-300/90 mb-6">{message}</p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-colors"
        >
          Start Over
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-400/50 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};