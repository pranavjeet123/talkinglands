export interface POI {
  id: string;
  type: string;
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

export interface Candidate {
  id: string;
  type: 'candidate';
  estimated_rent: number;
  notes: string;
}

export interface GeoFeature {
  type: 'Feature';
  properties: POI | Candidate;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface MockDataResponse {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

export const fetchMockData = async (): Promise<MockDataResponse> => {
  try {
    console.log('Fetching mock data from /mock-data.json');
    const response = await fetch('/mock-data.json');
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Mock data loaded:', data);
    console.log('Features count:', data.features?.length);
    
    return data;
  } catch (error) {
    console.error('Error fetching mock data:', error);
    
    // Return fallback data with some sample features
    console.log('Using fallback data');
    const fallbackData: MockDataResponse = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'poi-001',
            type: 'cafe',
            name: 'Bean & Brew',
            rating: 4.3,
            visitors_per_day: 140,
            tags: ['coffee', 'breakfast']
          },
          geometry: { type: 'Point', coordinates: [77.6245, 12.9352] }
        },
        {
          type: 'Feature',
          properties: {
            id: 'cand-001',
            type: 'candidate',
            estimated_rent: 85000,
            notes: 'near TechPark A, good office density'
          },
          geometry: { type: 'Point', coordinates: [77.5958, 12.9718] }
        }
      ]
    };
    
    return fallbackData;
  }
};

export const getPOIs = (data: MockDataResponse): GeoFeature[] => {
  return data.features.filter(feature => feature.properties.type !== 'candidate');
};

export const getCandidates = (data: MockDataResponse): GeoFeature[] => {
  return data.features.filter(feature => feature.properties.type === 'candidate');
};

export const getPOIIcon = (poiType: string): string => {
  const iconMap: { [key: string]: string } = {
    cafe: '☕',
    office: '🏢',
    transit: '🚇',
    university: '🎓',
    mall: '🛒',
    residential: '🏠'
  };
  
  return iconMap[poiType] || '📍';
};
