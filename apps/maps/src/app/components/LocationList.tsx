import React, { useState, useEffect } from 'react';
import { Feature, FeatureCollection, CandidateLocation } from '../../types';
import { getCommunicationService } from '../../services/communication';

// Import the data directly as a TypeScript object
const mockData: FeatureCollection = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "cand-001",
        "type": "candidate",
        "estimated_rent": 85000,
        "notes": "near TechPark A, good office density"
      },
      "geometry": { "type": "Point", "coordinates": [77.5958, 12.9718] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-002",
        "type": "candidate",
        "estimated_rent": 72000,
        "notes": "close to Metro Station X"
      },
      "geometry": { "type": "Point", "coordinates": [77.5985, 12.9716] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-003",
        "type": "candidate",
        "estimated_rent": 65000,
        "notes": "residential cluster nearby"
      },
      "geometry": { "type": "Point", "coordinates": [77.5965, 12.9640] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-004",
        "type": "candidate",
        "estimated_rent": 90000,
        "notes": "edge of Central Mall catchment"
      },
      "geometry": { "type": "Point", "coordinates": [77.6090, 12.9710] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-005",
        "type": "candidate",
        "estimated_rent": 48000,
        "notes": "near bus interchange, lower rent"
      },
      "geometry": { "type": "Point", "coordinates": [77.5898, 12.9732] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-006",
        "type": "candidate",
        "estimated_rent": 56000,
        "notes": "close to Creative Hub, medium office density"
      },
      "geometry": { "type": "Point", "coordinates": [77.6165, 12.9675] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-007",
        "type": "candidate",
        "estimated_rent": 42000,
        "notes": "residential area with several households"
      },
      "geometry": { "type": "Point", "coordinates": [77.6030, 12.9605] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-008",
        "type": "candidate",
        "estimated_rent": 78000,
        "notes": "near FinTech Tower"
      },
      "geometry": { "type": "Point", "coordinates": [77.6015, 12.9682] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-009",
        "type": "candidate",
        "estimated_rent": 51000,
        "notes": "minor intersection, potential visibility"
      },
      "geometry": { "type": "Point", "coordinates": [77.5995, 12.9668] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-010",
        "type": "candidate",
        "estimated_rent": 64000,
        "notes": "proximate to university student population"
      },
      "geometry": { "type": "Point", "coordinates": [77.5859, 12.9658] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-011",
        "type": "candidate",
        "estimated_rent": 70000,
        "notes": "walkable to multiple offices"
      },
      "geometry": { "type": "Point", "coordinates": [77.6009, 12.9730] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "cand-012",
        "type": "candidate",
        "estimated_rent": 47000,
        "notes": "small local market nearby"
      },
      "geometry": { "type": "Point", "coordinates": [77.5942, 12.9770] }
    }
  ]
};

const LocationList: React.FC = () => {
  const [candidates, setCandidates] = useState<Feature[]>([]);
  const [favorites, setFavorites] = useState<Feature[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Load candidates from mock data
    const featureCollection = mockData as FeatureCollection;
    const candidateFeatures = featureCollection.features.filter(
      (feature): feature is Feature => 
        feature.properties.type === 'candidate'
    );
    setCandidates(candidateFeatures);

    // Always get the fresh communication service instance
    const communication = getCommunicationService();
    
    // Subscribe to favorites
    const favoritesSubscription = communication.favoriteCandidates$.subscribe(setFavorites);

    return () => {
      favoritesSubscription.unsubscribe();
    };
  }, []);

  const handleAddToFavorites = (candidate: Feature) => {
    const communication = getCommunicationService(); // Get fresh instance
    communication.addFavoriteCandidate(candidate, 'maps');
    
    // Send additional message for analytics tracking
    communication.sendMessage('FAVORITE_ANALYTICS', {
      action: 'added',
      candidateId: candidate.properties.id,
      totalFavorites: communication.getFavoriteCandidates().length + 1,
      timestamp: Date.now(),
      location: candidate.geometry.coordinates,
      rent: (candidate.properties as CandidateLocation).estimated_rent
    }, 'maps');

    // Show notification
    setNotification(`${candidate.properties.id} added to favorites`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRemoveFromFavorites = (candidateId: string) => {
    const communication = getCommunicationService(); // Get fresh instance
    communication.removeFavoriteCandidate(candidateId, 'maps');
    
    // Send additional message for analytics tracking
    communication.sendMessage('FAVORITE_ANALYTICS', {
      action: 'removed',
      candidateId,
      totalFavorites: communication.getFavoriteCandidates().length - 1,
      timestamp: Date.now()
    }, 'maps');

    // Show notification  
    setNotification(`${candidateId} removed from favorites`);
    setTimeout(() => setNotification(null), 3000);
  };

  const isFavorite = (candidateId: string) => {
    return favorites.some(fav => fav.properties.id === candidateId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="relative">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {notification}
          </div>
        </div>
      )}
      
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Location Candidates
        </h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {candidates.map((candidate) => {
          const props = candidate.properties as CandidateLocation;
          const isFav = isFavorite(props.id);
          
          return (
            <div
              key={props.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-lg text-gray-800">
                      {props.id}
                    </span>
                    <span className="text-sm text-gray-500">
                      [{candidate.geometry.coordinates[1].toFixed(4)}, {candidate.geometry.coordinates[0].toFixed(4)}]
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{props.notes}</p>
                  
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(props.estimated_rent)}
                    <span className="text-sm text-gray-500 font-normal">/month</span>
                  </div>
                </div>
                
                <button
                  onClick={() => 
                    isFav 
                      ? handleRemoveFromFavorites(props.id)
                      : handleAddToFavorites(candidate)
                  }
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isFav
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg
                    className="w-6 h-6"
                    fill={isFav ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {favorites.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-red-800">
              Favorites ({favorites.length})
            </h3>
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Synced to Insights
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites.map((fav) => {
              const props = fav.properties as CandidateLocation;
              return (
                <span
                  key={props.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                >
                  {props.id}
                  <button
                    onClick={() => handleRemoveFromFavorites(props.id)}
                    className="ml-2 hover:text-red-600"
                    title="Remove from favorites"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default LocationList;
