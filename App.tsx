import React, { useState, useCallback } from 'react';
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

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [result, setResult] = useState<RoadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [lastQuery, setLastQuery] = useState<LocationQuery | null>(null);
  const { roads: library, addRoad, removeRoad, isRoadInLibrary } = useLibrary();

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
      setError(err.message || 'An unknown error occurred while searching for roads.');
      setScreen('error');
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header onShowLibrary={() => setScreen('library')} libraryCount={library.length} />
      <main className="w-full max-w-4xl flex-grow flex flex-col justify-center items-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;