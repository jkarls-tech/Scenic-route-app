import React, { useState } from 'react';

interface DestinationInputProps {
  onSubmit: (destination: string) => void;
  onBack: () => void;
}

export const DestinationInput: React.FC<DestinationInputProps> = ({ onSubmit, onBack }) => {
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onSubmit(destination.trim());
    }
  };

  return (
    <div className="w-full max-w-lg text-center p-8 bg-gray-800/50 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-gray-200">Enter a Destination</h2>
      <p className="text-gray-400 mb-6">
        Enter a city, state, or landmark to find roads nearby.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g., Asheville, NC"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          aria-label="Destination Input"
        />
        <div className="flex flex-col sm:flex-row gap-4">
           <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!destination.trim()}
            className="flex-1 px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:bg-gray-500 disabled:scale-100 disabled:cursor-not-allowed"
          >
            Search Roads
          </button>
        </div>
      </form>
    </div>
  );
};