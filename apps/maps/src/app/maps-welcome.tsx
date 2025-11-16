import { POIMap } from './components/POIMap';

export function MapsWelcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interactive Map with POIs</h2>
          <POIMap />
        </div>
      </div>
    </div>
  );
}
