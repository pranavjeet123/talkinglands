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
  console.log('Returning complete mock data with all POIs and candidates');
  const fullMockData: MockDataResponse = {
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
          id: 'poi-002',
          type: 'office',
          name: 'TechPark A',
          employees: 1200,
          tags: ['office', 'corporate']
        },
        geometry: { type: 'Point', coordinates: [77.5950, 12.9725] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'poi-003',
          type: 'transit',
          name: 'Metro Station X',
          mode: 'metro',
          daily_entries: 8000,
          tags: ['metro', 'transit']
        },
        geometry: { type: 'Point', coordinates: [77.5991, 12.9719] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'poi-004',
          type: 'university',
          name: 'City University',
          students: 15000,
          tags: ['education', 'students']
        },
        geometry: { type: 'Point', coordinates: [77.5857, 12.9660] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'poi-005',
          type: 'mall',
          name: 'Central Mall',
          visitors_per_day: 5200,
          tags: ['retail', 'mall']
        },
        geometry: { type: 'Point', coordinates: [77.6102, 12.9712] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'poi-006',
          type: 'cafe',
          name: 'Roast & Relax',
          rating: 4.0,
          visitors_per_day: 90,
          tags: ['coffee', 'work-friendly']
        },
        geometry: { type: 'Point', coordinates: [77.6080, 12.9770] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'poi-007',
          type: 'residential',
          name: 'Highrise Residences',
          households: 420,
          tags: ['residential']
        },
        geometry: { type: 'Point', coordinates: [77.5975, 12.9628] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'poi-008',
          type: 'office',
          name: 'FinTech Tower',
          employees: 600,
          tags: ['office', 'startup']
        },
        geometry: { type: 'Point', coordinates: [77.6018, 12.9684] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'poi-009',
          type: 'transit',
          name: 'Major Bus Interchange',
          mode: 'bus',
          daily_entries: 3000,
          tags: ['bus', 'transit']
        },
        geometry: { type: 'Point', coordinates: [77.5899, 12.9735] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'poi-010',
          type: 'cafe',
          name: 'Corner Cup',
          rating: 3.9,
          visitors_per_day: 60,
          tags: ['coffee', 'takeaway']
        },
        geometry: { type: 'Point', coordinates: [77.5959, 12.9778] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'poi-011',
          type: 'office',
          name: 'Creative Hub',
          employees: 320,
          tags: ['office', 'co-working']
        },
        geometry: { type: 'Point', coordinates: [77.6170, 12.9680] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'poi-012',
          type: 'residential',
          name: 'Gated Villas',
          households: 220,
          tags: ['residential', 'affluent']
        },
        geometry: { type: 'Point', coordinates: [77.6035, 12.9610] }
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
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-002',
          type: 'candidate',
          estimated_rent: 72000,
          notes: 'close to Metro Station X'
        },
        geometry: { type: 'Point', coordinates: [77.5985, 12.9716] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-003',
          type: 'candidate',
          estimated_rent: 65000,
          notes: 'residential cluster nearby'
        },
        geometry: { type: 'Point', coordinates: [77.5965, 12.9640] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-004',
          type: 'candidate',
          estimated_rent: 90000,
          notes: 'edge of Central Mall catchment'
        },
        geometry: { type: 'Point', coordinates: [77.6090, 12.9710] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-005',
          type: 'candidate',
          estimated_rent: 48000,
          notes: 'near bus interchange, lower rent'
        },
        geometry: { type: 'Point', coordinates: [77.5898, 12.9732] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-006',
          type: 'candidate',
          estimated_rent: 56000,
          notes: 'close to Creative Hub, medium office density'
        },
        geometry: { type: 'Point', coordinates: [77.6165, 12.9675] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-007',
          type: 'candidate',
          estimated_rent: 42000,
          notes: 'residential area with several households'
        },
        geometry: { type: 'Point', coordinates: [77.6030, 12.9605] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-008',
          type: 'candidate',
          estimated_rent: 78000,
          notes: 'near FinTech Tower'
        },
        geometry: { type: 'Point', coordinates: [77.6015, 12.9682] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-009',
          type: 'candidate',
          estimated_rent: 51000,
          notes: 'minor intersection, potential visibility'
        },
        geometry: { type: 'Point', coordinates: [77.5995, 12.9668] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-010',
          type: 'candidate',
          estimated_rent: 64000,
          notes: 'proximate to university student population'
        },
        geometry: { type: 'Point', coordinates: [77.5859, 12.9658] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-011',
          type: 'candidate',
          estimated_rent: 70000,
          notes: 'walkable to multiple offices'
        },
        geometry: { type: 'Point', coordinates: [77.6009, 12.9730] }
      },
      {
        type: 'Feature',
        properties: {
          id: 'cand-012',
          type: 'candidate',
          estimated_rent: 47000,
          notes: 'small local market nearby'
        },
        geometry: { type: 'Point', coordinates: [77.5942, 12.9770] }
      }
    ]
  };
  
  console.log('Features count:', fullMockData.features?.length);
  console.log('POIs:', fullMockData.features?.filter((f: GeoFeature) => f.properties.type !== 'candidate')?.length);
  console.log('Candidates:', fullMockData.features?.filter((f: GeoFeature) => f.properties.type === 'candidate')?.length);
  
  return fullMockData;
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
