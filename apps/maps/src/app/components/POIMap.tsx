import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MockDataResponse, fetchMockData, getPOIs, getCandidates, Candidate } from '../services/mockDataService';
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
  const [favoriteCandidates, setFavoriteCandidates] = useState<Set<string>>(new Set());
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false);

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

  const toggleFavorite = (candidateId: string) => {
    setFavoriteCandidates(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(candidateId)) {
        newFavorites.delete(candidateId);
      } else {
        newFavorites.add(candidateId);
      }
      return newFavorites;
    });
  };

  const getFavoriteCandidates = () => {
    return candidateFeatures.filter(feature => 
      favoriteCandidates.has(feature.properties.id)
    );
  };

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
            <button
              onClick={() => setShowFavoritesPanel(!showFavoritesPanel)}
              className="flex items-center space-x-2 px-3 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
              title="View Favorite Candidates"
            >
              <span 
                className="text-lg"
                role="img"
                aria-label="Favorites"
              >
                ❤️
              </span>
              <span className="text-sm font-medium">Favorites ({favoriteCandidates.size})</span>
            </button>
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
              isFavorite={favoriteCandidates.has(feature.properties.id)}
              onToggleFavorite={toggleFavorite}
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

      {/* Favorites Panel */}
      {showFavoritesPanel && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-800">
              Favorite Candidates ({favoriteCandidates.size})
            </h4>
            <button
              onClick={() => setShowFavoritesPanel(false)}
              className="text-gray-500 hover:text-gray-700"
              title="Close favorites panel"
            >
              ✕
            </button>
          </div>
          
          {favoriteCandidates.size === 0 ? (
            <div className="text-center py-8">
              <span 
                className="text-4xl mb-2 block"
                role="img"
                aria-label="No favorites"
              >
                💔
              </span>
              <p className="text-gray-500">No favorite candidates selected yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Click the heart icon on candidate markers to add them to favorites.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {getFavoriteCandidates().map((candidate) => {
                const props = candidate.properties as Candidate;
                const getRentColor = (rent: number): string => {
                  if (rent >= 80000) return '#EF4444';
                  if (rent >= 65000) return '#F59E0B';
                  if (rent >= 50000) return '#10B981';
                  return '#3B82F6';
                };
                
                return (
                  <div key={props.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span 
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getRentColor(props.estimated_rent) }}
                        ></span>
                        <span className="font-medium text-gray-800">{props.id}</span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(props.id)}
                        className="text-red-500 hover:text-red-600"
                        title="Remove from favorites"
                      >
                        <span 
                          role="img"
                          aria-label="Remove from favorites"
                        >
                          ❤️
                        </span>
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="font-semibold">
                        ₹{props.estimated_rent.toLocaleString('en-IN')}/month
                      </div>
                      <div className="mt-1 italic">{props.notes}</div>
                      <div className="mt-1 text-xs">
                        Lat: {candidate.geometry.coordinates[1].toFixed(4)}, 
                        Lng: {candidate.geometry.coordinates[0].toFixed(4)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
