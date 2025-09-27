import React from 'react'

import TravelMap from './TravelMap';

interface TravelLocation {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  visitDate: string;
  photos?: string[];
  rating: number;
  category: 'domestic' | 'international';
  createdAt: string;
}

interface TravelMapSectionProps {
  travelLocations: TravelLocation[];
  setShowAddTravelModal: (show: boolean) => void;
  isGoogleMapsLoaded: boolean;
  removeTravelLocation: (id: number) => void;
}

const TravelMapSection: React.FC<TravelMapSectionProps> = ({
    travelLocations,
    setShowAddTravelModal,
    isGoogleMapsLoaded,
    removeTravelLocation
}) => {
  return (
    <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    แผนที่ท่องเที่ยว
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    สถานที่ที่คุณเคยไปเที่ยว
                  </p>
                </div>
              </div>
              
              {/* Travel Stats */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {travelLocations.filter(loc => loc.category === 'domestic').length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ในประเทศ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {travelLocations.filter(loc => loc.category === 'international').length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ต่างประเทศ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {travelLocations.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">รวม</div>
                </div>
              </div>
            </div>

            {/* Travel Map */}
            <TravelMap
              locations={travelLocations}
              onAddLocation={() => setShowAddTravelModal(true)}
              isLoaded={isGoogleMapsLoaded}
            />

            {/* Mobile Stats */}
            <div className="md:hidden mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {travelLocations.filter(loc => loc.category === 'domestic').length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">ในประเทศ</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {travelLocations.filter(loc => loc.category === 'international').length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">ต่างประเทศ</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {travelLocations.length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">รวม</div>
              </div>
            </div>

            {/* Recent Locations */}
            {travelLocations.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  สถานที่ล่าสุด
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {travelLocations
                    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
                    .slice(0, 6)
                    .map((location) => (
                      <div
                        key={location.id}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 dark:text-white truncate">
                              {location.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {location.description || 'ไม่มีรายละเอียด'}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(location.visitDate).toLocaleDateString('th-TH')}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < location.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                  ))}
                                </div>
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    location.category === 'international'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  }`}
                                >
                                  {location.category === 'international' ? 'ต่างประเทศ' : 'ในประเทศ'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTravelLocation(location.id)}
                            className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="ลบสถานที่"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
  )
}

export default TravelMapSection