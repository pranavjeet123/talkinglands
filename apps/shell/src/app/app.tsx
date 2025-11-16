import * as React from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

const Maps = React.lazy(() => import('maps/Module'));
const Insights = React.lazy(() => import('insights/Module'));

const Home = () => (
  <div className="flex-1 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to TalkingLands</h1>
      <p className="text-lg text-gray-600 mb-8">
        Explore our interactive maps and gain valuable insights from your data.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/maps"
          className="bg-gradient-to-r from-green-400 to-green-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">Maps</h2>
          <p>Interactive geographical data visualization and exploration tools.</p>
        </Link>
        <Link
          to="/insights"
          className="bg-gradient-to-r from-gray-400 to-gray-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h2 className="text-2xl font-semibold mb-2">Insights</h2>
          <p>Data analytics and business intelligence dashboard.</p>
        </Link>
      </div>
    </div>
  </div>
);

export function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-green-600">
                TalkingLands
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === '/'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-green-100 hover:text-green-600'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/maps"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === '/maps'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-green-100 hover:text-green-600'
                  }`}
                >
                  Maps
                </Link>
                <Link
                  to="/insights"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === '/insights'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-green-100 hover:text-green-600'
                  }`}
                >
                  Insights
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <React.Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </React.Suspense>
    </div>
  );
}

export default App;
