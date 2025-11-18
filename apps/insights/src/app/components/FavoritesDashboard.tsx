import React, { useState, useEffect } from 'react';
import { Feature, CandidateLocation } from '../../types';
import { getCommunicationService } from '../../services/communication';

const FavoritesDashboard: React.FC = () => {
  const [favorites, setFavorites] = useState<Feature[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Feature | null>(null);

  useEffect(() => {
    console.log('📊 [Insights] Setting up communication subscriptions');
    const communication = getCommunicationService();
    
    // Subscribe to favorites updates
    const favoritesSubscription = communication.favoriteCandidates$.subscribe((newFavorites: Feature[]) => {
      console.log('📊 [Insights] Received favorites update:', newFavorites.length);
      setFavorites(newFavorites);
    });
    
    const selectedSubscription = communication.selectedCandidate$.subscribe(setSelectedLocation);

    return () => {
      favoritesSubscription.unsubscribe();
      selectedSubscription.unsubscribe();
      console.log('📊 [Insights] Unsubscribed from communication services');
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotalRent = () => {
    return favorites.reduce((total, favorite) => {
      const props = favorite.properties as CandidateLocation;
      return total + props.estimated_rent;
    }, 0);
  };

  const getAverageRent = () => {
    if (favorites.length === 0) return 0;
    return calculateTotalRent() / favorites.length;
  };

  const handleRemoveFromFavorites = (candidateId: string) => {
    const communication = getCommunicationService();
    communication.removeFavoriteCandidate(candidateId, 'insights');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Location Insights Dashboard
        </h2>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No favorite locations yet</h3>
            <p className="text-gray-500">Add some locations to favorites from the Maps app to see insights here.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Total Favorites</p>
                    <p className="text-2xl font-semibold text-gray-900">{favorites.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Average Rent</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(getAverageRent())}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">Total Investment</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(calculateTotalRent())}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites List */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Favorite Locations</h3>
              <div className="grid gap-4">
                {favorites.map((favorite, index) => {
                  const props = favorite.properties as CandidateLocation;
                  return (
                    <div key={props.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                              #{index + 1}
                            </span>
                            <span className="font-semibold text-lg text-gray-800">
                              {props.id}
                            </span>
                            <span className="text-sm text-gray-500">
                              [{favorite.geometry.coordinates[1].toFixed(4)}, {favorite.geometry.coordinates[0].toFixed(4)}]
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{props.notes}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-green-600">
                              {formatCurrency(props.estimated_rent)}
                              <span className="text-sm text-gray-500 font-normal">/month</span>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveFromFavorites(props.id)}
                              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Selected Location Details</h3>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-indigo-800">
                  {(selectedLocation.properties as CandidateLocation).id}
                </p>
                <p className="text-indigo-600 mt-1">
                  {(selectedLocation.properties as CandidateLocation).notes}
                </p>
                <p className="text-2xl font-bold text-indigo-800 mt-2">
                  {formatCurrency((selectedLocation.properties as CandidateLocation).estimated_rent)}
                  <span className="text-sm font-normal">/month</span>
                </p>
              </div>
              <button
                onClick={() => getCommunicationService().selectCandidate(null, 'insights')}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesDashboard;
