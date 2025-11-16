import React from 'react';

interface HeaderProps {
  onShowLibrary: () => void;
  libraryCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onShowLibrary, libraryCount }) => {
  return (
    <header className="w-full max-w-4xl mb-8 text-center relative">
      <div className="flex items-center justify-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.36 3.46c-1.42-1.12-3.3-1.46-5.06-1.46s-3.64.34-5.06 1.46C4.26 6.04 2 10.59 2 12c0 1.41 2.26 5.96 6.24 8.54 1.42 1.12 3.3 1.46 5.06 1.46s3.64-.34 5.06-1.46C21.74 17.96 24 13.41 24 12c0-1.41-2.26-5.96-6.24-8.54zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm-3-5c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"/>
          <path d="M12 14.5c1.38 0 2.5-1.12 2.5-2.5S13.38 9.5 12 9.5 9.5 10.62 9.5 12s1.12 2.5 2.5 2.5z" opacity=".3"/>
        </svg>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Scenic Route Finder
        </h1>
      </div>
       <button 
        onClick={onShowLibrary}
        className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-colors"
        aria-label={`View saved roads. ${libraryCount} items in library.`}
      >
        <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3-5 3V4z" />
        </svg>
        <span>My Library ({libraryCount})</span>
      </button>
      <p className="mt-3 text-lg text-gray-400">Find thrilling, twisty roads for the driving enthusiast.</p>
    </header>
  );
};