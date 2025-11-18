import { POIMap } from './components/POIMap';

export function MapsWelcome() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Maps & Location Data</h1>
        <p className="text-gray-600">Explore Points of Interest and Location Candidates</p>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interactive Map</h2>
        <POIMap />
      </div>
    </div>
  );
}
