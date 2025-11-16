import React from 'react';
import { Road } from '../types';

interface LibraryScreenProps {
  roads: Road[];
  onRemove: (road: Road) => void;
  onBack: () => void;
}

const LibraryRoadCard: React.FC<{ road: Road; onRemove: (road: Road) => void; }> = ({ road, onRemove }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${road.endLat},${road.endLon}&waypoints=${road.startLat},${road.startLon}`;
  
  return (
  <article className="bg-gray-800/60 p-6 rounded-xl border border-gray-700">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-cyan-300 mb-2">{road.name}</h3>
        <ul className="list-disc list-inside text-gray-400 space-y-1">
          {road.description.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
      <div className="flex-shrink-0 flex flex-row sm:flex-col gap-3 w-full sm:w-auto">
         <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          Directions
        </a>
        <button
          onClick={() => onRemove(road)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-colors"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
          </svg>
          Remove
        </button>
      </div>
    </div>
    <div className="aspect-video w-full bg-gray-700 rounded-lg overflow-hidden mt-4">
      <iframe
        className="w-full h-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={road.mapEmbedUrl}>
      </iframe>
    </div>
  </article>
  );
};


export const LibraryScreen: React.FC<LibraryScreenProps> = ({ roads, onRemove, onBack }) => {
  const getRoadId = (road: Road) => `${road.name}-${road.startLat}-${road.startLon}`;
  return (
    <div className="w-full bg-gray-900/40 rounded-xl shadow-2xl border border-gray-700 p-6 sm:p-8 animate-fade-in">
      <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-200">
          My Saved Roads
        </h2>
        <button 
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-colors"
        >
            &larr; Back to Search
        </button>
      </div>

      {roads.length > 0 ? (
        <div className="space-y-6">
          {roads.map((road) => (
            <LibraryRoadCard key={getRoadId(road)} road={road} onRemove={onRemove} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-300">Your library is empty</h3>
            <p className="mt-1 text-gray-500">Search for roads and save your favorites to see them here.</p>
        </div>
      )}
    </div>
  );
};
