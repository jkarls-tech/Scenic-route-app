export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

// FIX: Made properties optional to match the type from the Gemini API response.
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri?: string;
    title?: string;
  };
}

export interface Road {
  name: string;
  description: string[];
  mapEmbedUrl: string;
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
}

export interface RoadResult {
  roads: Road[];
  sources: GroundingChunk[];
}

export type LocationQuery =
  | { type: 'coords'; lat: number; lon: number }
  | { type: 'address'; address: string };
