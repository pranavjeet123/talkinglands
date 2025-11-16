import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GeoFeature, POI, getPOIIcon } from '../services/mockDataService';

interface POIMarkerProps {
  feature: GeoFeature;
}

const createCustomIcon = (poiType: string) => {
  const emoji = getPOIIcon(poiType);
  const html = `
    <div style="
      background: white; 
      border: 2px solid #3B82F6; 
      border-radius: 50%; 
      width: 30px; 
      height: 30px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">
      ${emoji}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-poi-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

export function POIMarker({ feature }: POIMarkerProps) {
  const { coordinates } = feature.geometry;
  const properties = feature.properties as POI;
  // Convert from GeoJSON [longitude, latitude] to Leaflet [latitude, longitude]
  const position: [number, number] = [coordinates[1], coordinates[0]];

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      cafe: '#8B5CF6',
      office: '#3B82F6',
      transit: '#10B981',
      university: '#F59E0B',
      mall: '#EF4444',
      residential: '#6B7280'
    };
    return colors[type] || '#6B7280';
  };

  const renderPropertyInfo = () => {
    const items = [];
    
    if (properties.rating) {
      items.push(`Rating: ${properties.rating} ⭐`);
    }
    if (properties.visitors_per_day) {
      items.push(`Daily Visitors: ${properties.visitors_per_day.toLocaleString()}`);
    }
    if (properties.employees) {
      items.push(`Employees: ${properties.employees.toLocaleString()}`);
    }
    if (properties.students) {
      items.push(`Students: ${properties.students.toLocaleString()}`);
    }
    if (properties.households) {
      items.push(`Households: ${properties.households.toLocaleString()}`);
    }
    if (properties.daily_entries) {
      items.push(`Daily Entries: ${properties.daily_entries.toLocaleString()}`);
    }
    if (properties.mode) {
      items.push(`Mode: ${properties.mode}`);
    }

    return items;
  };

  return (
    <Marker 
      position={position} 
      icon={createCustomIcon(properties.type)}
    >
      <Popup maxWidth={300}>
        <div className="p-2">
          <div className="flex items-center mb-2">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: getTypeColor(properties.type) }}
            ></span>
            <h3 className="text-lg font-semibold text-gray-800 capitalize">
              {properties.name}
            </h3>
          </div>
          
          <div className="mb-2">
            <span 
              className="inline-block px-2 py-1 text-xs font-medium rounded text-white capitalize"
              style={{ backgroundColor: getTypeColor(properties.type) }}
            >
              {properties.type}
            </span>
          </div>

          {renderPropertyInfo().length > 0 && (
            <div className="mb-2">
              {renderPropertyInfo().map((info, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {info}
                </div>
              ))}
            </div>
          )}

          {properties.tags && properties.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {properties.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

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
