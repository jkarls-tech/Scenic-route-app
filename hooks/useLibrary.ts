import { useState, useEffect, useCallback } from 'react';
import { Road } from '../types';

const STORAGE_KEY = 'scenic-route-library';

const getRoadId = (road: Road) => `${road.name}-${road.startLat}-${road.startLon}`;

export const useLibrary = () => {
  const [roads, setRoads] = useState<Road[]>([]);
  
  useEffect(() => {
    try {
      const storedRoads = localStorage.getItem(STORAGE_KEY);
      if (storedRoads) {
        setRoads(JSON.parse(storedRoads));
      }
    } catch (error) {
      console.error("Failed to load roads from local storage", error);
    }
  }, []);

  const saveRoadsToStorage = useCallback((newRoads: Road[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRoads));
      setRoads(newRoads);
    } catch (error) {
      console.error("Failed to save roads to local storage", error);
    }
  }, []);

  const addRoad = useCallback((road: Road) => {
    // Prevent adding duplicates
    if (roads.some(r => getRoadId(r) === getRoadId(road))) {
        return;
    }
    const newRoads = [...roads, road];
    saveRoadsToStorage(newRoads);
  }, [roads, saveRoadsToStorage]);

  const removeRoad = useCallback((roadToRemove: Road) => {
    const idToRemove = getRoadId(roadToRemove);
    const newRoads = roads.filter(r => getRoadId(r) !== idToRemove);
    saveRoadsToStorage(newRoads);
  }, [roads, saveRoadsToStorage]);
  
  const isRoadInLibrary = useCallback((road: Road) => {
     return roads.some(r => getRoadId(r) === getRoadId(road));
  }, [roads]);

  return { roads, addRoad, removeRoad, isRoadInLibrary };
};