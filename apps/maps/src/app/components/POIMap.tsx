import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MockDataResponse, fetchMockData, getPOIs, getCandidates } from '../services/mockDataService';
import { POIMarker } from './POIMarker';
import { CandidateMarker } from './CandidateMarker';

// Fix for default markers in React Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function POIMap() {
  const [mockData, setMockData] = useState<MockDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCandidates, setShowCandidates] = useState(true);
  const [showPOIs, setShowPOIs] = useState(true);

  // Bangalore coordinates - center of our POI data
  const bangaloreCenter: [number, number] = [12.9716, 77.5946];

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMockData();
        setMockData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load POI data');
        console.error('Error loading mock data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const poiFeatures = mockData ? getPOIs(mockData) : [];
  const candidateFeatures = mockData ? getCandidates(mockData) : [];

  const getPoiTypeStats = () => {
    const stats: { [key: string]: number } = {};
    poiFeatures.forEach(feature => {
      const type = feature.properties.type;
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  };

  const poiStats = getPoiTypeStats();
  const candidateCount = candidateFeatures.length;

  if (isLoading) {
    return (
      <div className="h-96 w-full rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading POI data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 w-full rounded-lg bg-red-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="font-medium">Error loading map data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* POI Statistics */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Map Overview</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={showPOIs}
                onChange={(e) => setShowPOIs(e.target.checked)}
                className="mr-2"
              />
              Show POIs ({poiFeatures.length})
            </label>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={showCandidates}
                onChange={(e) => setShowCandidates(e.target.checked)}
                className="mr-2"
              />
              Show Candidates ({candidateCount})
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(poiStats).map(([type, count]) => (
            <span 
              key={type} 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              <span className="capitalize">{type}</span>
              <span className="ml-1 bg-blue-200 text-blue-800 rounded-full px-2 py-0.5 text-xs">
                {count}
              </span>
            </span>
          ))}
          {candidateCount > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span>Candidates</span>
              <span className="ml-1 bg-green-200 text-green-800 rounded-full px-2 py-0.5 text-xs">
                {candidateCount}
              </span>
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Click on markers for detailed information | Use checkboxes to toggle layers
        </p>
      </div>

      {/* Interactive Map */}
      <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg border">
        <MapContainer 
          center={bangaloreCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Render POI markers */}
          {showPOIs && poiFeatures.map((feature) => (
            <POIMarker 
              key={feature.properties.id} 
              feature={feature} 
            />
          ))}
          
          {/* Render candidate markers */}
          {showCandidates && candidateFeatures.map((feature) => (
            <CandidateMarker 
              key={feature.properties.id} 
              feature={feature} 
            />
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Map Legend</h4>
        
        {/* POI Legend */}
        <div className="mb-4">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Points of Interest (POIs)</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center">
              <span className="mr-2" role="img" aria-label="cafe">☕</span>
              <span>Cafes</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2" role="img" aria-label="office">🏢</span>
              <span>Offices</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2" role="img" aria-label="transit">🚇</span>
              <span>Transit</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2" role="img" aria-label="university">🎓</span>
              <span>University</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2" role="img" aria-label="mall">🛒</span>
              <span>Mall</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2" role="img" aria-label="residential">🏠</span>
              <span>Residential</span>
            </div>
          </div>
        </div>

        {/* Candidate Legend */}
        <div>
          <h5 className="text-xs font-medium text-gray-700 mb-2">Candidate Locations (Rent Categories)</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span>Low (₹50K-)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Medium (₹50K-65K)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
              <span>Medium-High (₹65K-80K)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span>High (₹80K+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
