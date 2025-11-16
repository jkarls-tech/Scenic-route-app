
import React, { useState, useCallback, useEffect } from 'react';
import { findDrivingRoads } from './services/geminiService';
import { GeolocationPosition, RoadResult, LocationQuery, Road } from './types';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResultDisplay } from './components/ResultDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DestinationInput } from './components/DestinationInput';
import { LibraryScreen } from './components/LibraryScreen';
import { useLibrary } from './hooks/useLibrary';

type Screen = 'welcome' | 'destinationInput' | 'loading' | 'success' | 'error' | 'library';

// Component for the mandatory API key selection
const ApiKeyScreen: React.FC<{ onSelectKey: () => void }> = ({ onSelectKey }) => (
  <div className="text-center p-8 bg-gray-800/50 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
    <h2 className="text-2xl font-bold mb-4 text-gray-200">API Key Required</h2>
    <p className="text-gray-400 mb-6 max-w-md mx-auto">
      This application requires a Google AI API key to function. Please select a key to continue. For more information on billing, visit{' '}
      <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
        Google AI billing documentation
      </a>.
    </p>
    <button
      onClick={onSelectKey}
      className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
    >
      Select API Key
    </button>
  </div>
);


const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [result, setResult] = useState<RoadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [lastQuery, setLastQuery] = useState<LocationQuery | null>(null);
  const { roads: library, addRoad, removeRoad, isRoadInLibrary } = useLibrary();

  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [checkingApiKey, setCheckingApiKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      setCheckingApiKey(true);
      if (await window.aistudio.hasSelectedApiKey()) {
        setApiKeyReady(true);
      }
      setCheckingApiKey(false);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Optimistically assume the user selected a key
      setApiKeyReady(true);
    } catch (e) {
      console.error("Failed to open API key selection:", e);
    }
  };

  const executeSearch = useCallback(async (query: LocationQuery) => {
    setLastQuery(query);
    setError(null);
    setResult(null);
    setScreen('loading');

    try {
      const apiResult = await findDrivingRoads(query);
      if (!apiResult.roads || apiResult.roads.length === 0) {
        setError('The model returned no road suggestions. Try a different, more general location.');
        setScreen('error');
        return;
      }
      setResult(apiResult);
      setScreen('success');
    } catch (err: any) {
      // Handle client-side error when key is missing after optimistic selection
      if (err.message && err.message.includes("API Key must be set")) {
        setError("You must select an API key to proceed. Please try again.");
        setApiKeyReady(false); // Force re-selection
        setScreen('welcome'); // Go back to the start, which will show the ApiKeyScreen
      }
      // Handle server-side invalid API key error
      else if (err.message && err.message.includes("entity was not found")) {
        setError("Your API Key appears to be invalid. Please select a valid key to continue.");
        setApiKeyReady(false); // Force re-selection
        setScreen('welcome'); // Reset screen to avoid showing error page over key selection
      } else {
        setError(err.message || 'An unknown error occurred while searching for roads.');
        setScreen('error');
      }
    }
  }, []);

  const handleUseLocation = useCallback(() => {
    setLoadingMessage('Getting your location...');
    setScreen('loading');

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setLoadingMessage('Searching for roads near you...');
        const query: LocationQuery = {
          type: 'coords',
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        executeSearch(query);
      },
      (geoError: GeolocationPositionError) => {
        let errorMessage = 'Could not get your location.';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable it in your browser settings to use this feature.';
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case geoError.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        }
        setError(errorMessage);
        setScreen('error');
      }
    );
  }, [executeSearch]);
  
  const handleDestinationSubmit = useCallback((destination: string) => {
      setLoadingMessage(`Searching for roads near ${destination}...`);
      const query: LocationQuery = { type: 'address', address: destination };
      executeSearch(query);
    }, [executeSearch]);

  const handleRetry = useCallback(() => {
    if (lastQuery) {
      if (lastQuery.type === 'coords') {
        // Re-request location just to be safe
        handleUseLocation();
      } else {
        handleDestinationSubmit(lastQuery.address);
      }
    }
  }, [lastQuery, handleUseLocation, handleDestinationSubmit]);
  
  const handleReset = useCallback(() => {
    setScreen('welcome');
    setResult(null);
    setError(null);
    setLastQuery(null);
  }, []);

  const renderContent = () => {
    switch (screen) {
      case 'destinationInput':
        return <DestinationInput onSubmit={handleDestinationSubmit} onBack={handleReset} />;
      case 'loading':
        return <LoadingSpinner message={loadingMessage} />;
      case 'success':
        return result && lastQuery ? <ResultDisplay result={result} lastQuery={lastQuery} onReset={handleReset} onSave={addRoad} isSaved={isRoadInLibrary} /> : <ErrorDisplay message="No results found." onRetry={handleRetry} onReset={handleReset} />;
      case 'error':
        return <ErrorDisplay message={error || 'An unexpected error occurred.'} onRetry={handleRetry} onReset={handleReset}/>;
      case 'library':
        return <LibraryScreen roads={library} onRemove={removeRoad} onBack={handleReset} />;
      case 'welcome':
      default:
        return <WelcomeScreen onUseLocation={handleUseLocation} onEnterDestination={() => setScreen('destinationInput')} />;
    }
  };

  const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header onShowLibrary={() => setScreen('library')} libraryCount={library.length} />
      <main className="w-full max-w-4xl flex-grow flex flex-col justify-center items-center">
        {children}
      </main>
    </div>
  );

  if (checkingApiKey) {
    return (
      <PageWrapper>
        <LoadingSpinner message="Initializing..." />
      </PageWrapper>
    );
  }

  if (!apiKeyReady) {
    return (
      <PageWrapper>
        <ApiKeyScreen onSelectKey={handleSelectKey} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {renderContent()}
    </PageWrapper>
  );
};

export default App;
