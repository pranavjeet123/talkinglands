import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GeoFeature, Candidate } from '../services/mockDataService';

interface CandidateMarkerProps {
  feature: GeoFeature;
  isFavorite?: boolean;
  onToggleFavorite?: (candidateId: string) => void;
}

const createCandidateIcon = (rentValue: number) => {
  // Color-code based on rent value
  const getColor = (rent: number): string => {
    if (rent >= 80000) return '#EF4444'; // Red for high rent
    if (rent >= 65000) return '#F59E0B'; // Orange for medium-high rent
    if (rent >= 50000) return '#10B981'; // Green for medium rent
    return '#3B82F6'; // Blue for low rent
  };

  const color = getColor(rentValue);
  const html = `
    <div style="
      background: ${color}; 
      border: 2px solid white; 
      border-radius: 50%; 
      width: 25px; 
      height: 25px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 12px;
      font-weight: bold;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      ₹
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-candidate-marker',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -12.5],
  });
};

export function CandidateMarker({ feature, isFavorite = false, onToggleFavorite }: CandidateMarkerProps) {
  const { coordinates } = feature.geometry;
  const properties = feature.properties as Candidate;
  // Convert from GeoJSON [longitude, latitude] to Leaflet [latitude, longitude]
  const position: [number, number] = [coordinates[1], coordinates[0]];

  const getRentCategory = (rent: number): string => {
    if (rent >= 80000) return 'High (₹80K+)';
    if (rent >= 65000) return 'Medium-High (₹65K-80K)';
    if (rent >= 50000) return 'Medium (₹50K-65K)';
    return 'Low (₹50K-)';
  };

  const getRentColor = (rent: number): string => {
    if (rent >= 80000) return '#EF4444';
    if (rent >= 65000) return '#F59E0B';
    if (rent >= 50000) return '#10B981';
    return '#3B82F6';
  };

  return (
    <Marker 
      position={position} 
      icon={createCandidateIcon(properties.estimated_rent)}
    >
      <Popup maxWidth={300}>
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span 
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getRentColor(properties.estimated_rent) }}
              ></span>
              <h3 className="text-lg font-semibold text-gray-800">
                Candidate Location
              </h3>
            </div>
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(properties.id)}
                className={`p-1 rounded-full transition-colors ${
                  isFavorite 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <span 
                  className="text-lg"
                  role="img"
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite ? '❤️' : '🤍'}
                </span>
              </button>
            )}
          </div>
          
          <div className="mb-2">
            <span 
              className="inline-block px-2 py-1 text-xs font-medium rounded text-white"
              style={{ backgroundColor: getRentColor(properties.estimated_rent) }}
            >
              {getRentCategory(properties.estimated_rent)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Estimated Rent:</span>
              <span className="ml-2 text-lg font-bold text-gray-900">
                ₹{properties.estimated_rent.toLocaleString('en-IN')}/month
              </span>
            </div>
            
            <div className="text-sm">
              <span className="font-medium text-gray-700">Location ID:</span>
              <span className="ml-2 text-gray-600">{properties.id}</span>
            </div>

            {properties.notes && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Notes:</span>
                <p className="mt-1 text-gray-600 italic">{properties.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Lat: {coordinates[1].toFixed(4)}, Lng: {coordinates[0].toFixed(4)}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
