export function InsightsWelcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Insights
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Data analytics and business intelligence micro-frontend
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">Data Analytics</h3>
                <p className="text-sm text-gray-600">Advanced data processing</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">Visualizations</h3>
                <p className="text-sm text-gray-600">Interactive charts & graphs</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">Real-time Metrics</h3>
                <p className="text-sm text-gray-600">Live data monitoring</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">Business Intelligence</h3>
                <p className="text-sm text-gray-600">Strategic insights</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            Module Federation Remote
          </h3>
          <p className="text-purple-700">
            This insights application is designed to work as a micro-frontend 
            within the Talkinglands ecosystem, providing data analytics and 
            business intelligence capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
