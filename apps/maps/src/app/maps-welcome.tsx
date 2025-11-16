export function MapsWelcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Maps
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Interactive mapping and location intelligence micro-frontend
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">Interactive Maps</h3>
                <p className="text-sm text-gray-600">Powered by Leaflet.js</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">Heatmap Layers</h3>
                <p className="text-sm text-gray-600">Density visualization</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">Location Markers</h3>
                <p className="text-sm text-gray-600">POI and candidates</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">Real-time Data</h3>
                <p className="text-sm text-gray-600">Mock data integration</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Module Federation Remote
          </h3>
          <p className="text-blue-700">
            This maps application is designed to work as a micro-frontend 
            within the Talkinglands ecosystem, providing location-based services 
            and interactive mapping capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
