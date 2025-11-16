import React from 'react';
import { RoadResult, Road, LocationQuery } from '../types';
import { SourceLinks } from './SourceLinks';

interface ResultDisplayProps {
  result: RoadResult;
  lastQuery: LocationQuery;
  onReset: () => void;
  onSave: (road: Road) => void;
  isSaved: (road: Road) => boolean;
}

const RoadCard: React.FC<{ road: Road; lastQuery: LocationQuery, onSave: (road: Road) => void; isSaved: boolean }> = ({ road, lastQuery, onSave, isSaved }) => {
  // Generate a seamless navigation URL.
  // If the user searched for an address, use that as the origin.
  // Otherwise, default to the user's current location.
  let directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${road.endLat},${road.endLon}&waypoints=${road.startLat},${road.startLon}`;
  if (lastQuery.type === 'address') {
    const origin = encodeURIComponent(lastQuery.address);
    directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${road.endLat},${road.endLon}&waypoints=${road.startLat},${road.startLon}`;
  }
  
  return (
    <article className="bg-gray-800/60 p-6 rounded-xl border border-gray-700 shadow-lg transition-transform hover:scale-[1.02] hover:border-cyan-500/50">
      <h3 className="text-xl font-bold text-cyan-300 mb-2">{road.name}</h3>
      <ul className="list-disc list-inside text-gray-400 space-y-1 mb-4">
        {road.description.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      
      <div className="aspect-video w-full bg-gray-700 rounded-lg overflow-hidden">
        <iframe
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={road.mapEmbedUrl}>
        </iframe>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          Get Directions
        </a>
        <button
          onClick={() => onSave(road)}
          disabled={isSaved}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-all duration-300 ease-in-out disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3-5 3V4z" />
          </svg>
          {isSaved ? 'Saved' : 'Save to Library'}
        </button>
      </div>
    </article>
  );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, lastQuery, onReset, onSave, isSaved }) => {
  const getRoadId = (road: Road) => `${road.name}-${road.startLat}-${road.startLon}`;
  return (
    <div className="w-full bg-gray-900/40 rounded-xl shadow-2xl border border-gray-700 p-6 sm:p-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-200 border-b border-gray-600 pb-3">
        Here are some great drives for you:
      </h2>
      
      <div className="space-y-6">
        {result.roads.map((road) => (
          <RoadCard key={getRoadId(road)} road={road} lastQuery={lastQuery} onSave={onSave} isSaved={isSaved(road)} />
        ))}
      </div>

      {result.sources.length > 0 && <SourceLinks sources={result.sources} />}
      
      <div className="mt-8 pt-6 border-t border-gray-700 text-center">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Search Again
        </button>
      </div>
    </div>
  );
};