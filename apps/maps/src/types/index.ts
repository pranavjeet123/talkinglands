export interface Feature {
  type: 'Feature';
  properties: POI | CandidateLocation;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface POI {
  id: string;
  type: 'cafe' | 'office' | 'transit' | 'university' | 'mall' | 'residential';
  name: string;
  rating?: number;
  visitors_per_day?: number;
  employees?: number;
  students?: number;
  households?: number;
  daily_entries?: number;
  mode?: string;
  tags: string[];
}

export interface CandidateLocation {
  id: string;
  type: 'candidate';
  estimated_rent: number;
  notes: string;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}
