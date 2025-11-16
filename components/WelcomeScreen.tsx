import React from 'react';

interface WelcomeScreenProps {
  onUseLocation: () => void;
  onEnterDestination: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onUseLocation, onEnterDestination }) => {
  return (
    <div className="text-center p-8 bg-gray-800/50 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Find Your Next Great Drive</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Search for twisty, enthusiast-focused roads near your current location or anywhere in the world.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onUseLocation}
          className="flex-1 px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Use My Location
        </button>
        <button
          onClick={onEnterDestination}
          className="flex-1 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Enter a Destination
        </button>
      </div>
    </div>
  );
};