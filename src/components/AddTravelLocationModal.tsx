'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Star, Search, Globe, Home } from 'lucide-react';

interface NewTravelLocation {
  name: string;
  description: string;
  lat: number;
  lng: number;
  visitDate: string;
  rating: number;
  category: 'domestic' | 'international';
}

interface AddTravelLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  newLocation: NewTravelLocation;
  setNewLocation: (location: NewTravelLocation) => void;
}

const AddTravelLocationModal: React.FC<AddTravelLocationModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  newLocation,
  setNewLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle place search using Google Places API
  const handleSearch = async () => {
    if (!searchQuery.trim() || !window.google) return;

    setIsSearching(true);
    
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      query: searchQuery,
      fields: ['name', 'geometry', 'formatted_address', 'place_id', 'types']
    };

    service.textSearch(request, (results: any[], status: any) => {
      setIsSearching(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setSearchResults(results.slice(0, 5)); // Show top 5 results
      } else {
        setSearchResults([]);
      }
    });
  };

  // Handle selecting a search result
  const handleSelectPlace = (place: any) => {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    
    // Determine if it's domestic or international based on country
    const isInThailand = place.formatted_address?.includes('Thailand') || 
                        place.formatted_address?.includes('ประเทศไทย');
    
    setNewLocation({
      ...newLocation,
      name: place.name,
      lat: lat,
      lng: lng,
      category: isInThailand ? 'domestic' : 'international'
    });
    
    setSearchResults([]);
    setSearchQuery('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLocation.name.trim() && newLocation.visitDate) {
      onAdd();
      onClose();
    }
  };

  // Handle modal close
  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  // Handle Enter key for search
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                เพิ่มสถานที่ท่องเที่ยว
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                บันทึกสถานที่ที่คุณเคยไปเที่ยว
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Place Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ค้นหาสถานที่
              </label>
              <div className="relative">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      placeholder="ชื่อสถานที่, เมือง, หlandmarks..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    <span>ค้นหา</span>
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {searchResults.map((place, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectPlace(place)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                      >
                        <div className="font-medium text-gray-800 dark:text-white">
                          {place.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {place.formatted_address}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Manual Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ชื่อสถานที่ *
                </label>
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  วันที่เยี่ยมชม *
                </label>
                <input
                  type="date"
                  value={newLocation.visitDate}
                  onChange={(e) => setNewLocation({ ...newLocation, visitDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                รายละเอียด
              </label>
              <textarea
                value={newLocation.description}
                onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                rows={3}
                placeholder="เล่าประสบการณ์การเที่ยวของคุณ..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ละติจูด
                </label>
                <input
                  type="number"
                  step="any"
                  value={newLocation.lat}
                  onChange={(e) => setNewLocation({ ...newLocation, lat: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ลองจิจูด
                </label>
                <input
                  type="number"
                  step="any"
                  value={newLocation.lng}
                  onChange={(e) => setNewLocation({ ...newLocation, lng: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category and Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ประเภท
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLocation({ ...newLocation, category: 'domestic' })}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                      newLocation.category === 'domestic'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-300 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium">ในประเทศ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLocation({ ...newLocation, category: 'international' })}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center space-x-2 ${
                      newLocation.category === 'international'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-red-300 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">ต่างประเทศ</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  คะแนนความประทับใจ
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewLocation({ ...newLocation, rating: star })}
                      className={`p-1 rounded transition-colors ${
                        star <= newLocation.rating
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({newLocation.rating}/5)
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={!newLocation.name.trim() || !newLocation.visitDate}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
          >
            เพิ่มสถานที่
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTravelLocationModal;