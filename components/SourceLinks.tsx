
import React from 'react';
import { GroundingChunk } from '../types';

interface SourceLinksProps {
  sources: GroundingChunk[];
}

const SourceLink: React.FC<{ title: string; uri: string, type: 'web' | 'maps' }> = ({ title, uri, type }) => {
  const Icon = type === 'web' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 21l-4.95-6.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  );

  return (
    <a
      href={uri}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-sm text-gray-400 hover:text-cyan-400 bg-gray-700/50 hover:bg-gray-700 p-2 rounded-md transition-colors duration-200"
    >
      {Icon}
      <span className="truncate">{title || uri}</span>
    </a>
  );
};

export const SourceLinks: React.FC<SourceLinksProps> = ({ sources }) => {
  return (
    <div className="mt-8 pt-4 border-t border-gray-700">
      <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Sources</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sources.map((source, index) => {
          if (source.web) {
            return <SourceLink key={`web-${index}`} title={source.web.title} uri={source.web.uri} type="web" />;
          }
          if (source.maps) {
            return <SourceLink key={`maps-${index}`} title={source.maps.title} uri={source.maps.uri} type="maps" />;
          }
          return null;
        })}
      </div>
    </div>
  );
};
