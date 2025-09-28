'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Plus } from 'lucide-react';

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

interface TravelMapProps {
  locations: TravelLocation[];
  onAddLocation: () => void;
  isLoaded: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const TravelMap: React.FC<TravelMapProps> = ({ locations, onAddLocation, isLoaded }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Initialize Google Map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return;

    // Initialize map centered on Thailand
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 13.7563, lng: 100.5018 }, // Bangkok
      zoom: 6,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry.fill',
          stylers: [{ weight: '2.00' }]
        },
        {
          featureType: 'all',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#9c9c9c' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [{ color: '#f2f2f2' }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry.fill',
          stylers: [{ color: '#ffffff' }]
        },
        {
          featureType: 'landscape.man_made',
          elementType: 'geometry.fill',
          stylers: [{ color: '#ffffff' }]
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'all',
          stylers: [{ saturation: -100 }, { lightness: 45 }]
        },
        {
          featureType: 'road',
          elementType: 'geometry.fill',
          stylers: [{ color: '#eeeeee' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#7b7b7b' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#ffffff' }]
        },
        {
          featureType: 'road.highway',
          elementType: 'all',
          stylers: [{ visibility: 'simplified' }]
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'all',
          stylers: [{ color: '#46bcec' }, { visibility: 'on' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{ color: '#c8d7d4' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#070707' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#ffffff' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Add click listener to map for adding new locations
    map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      // You can add logic here to open add location modal with these coordinates
      console.log('Clicked at:', lat, lng);
    });

  }, [isLoaded]);

  // Add markers for existing locations
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || !locations.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    locations.forEach(location => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapInstanceRef.current,
        title: location.name,
        icon: {
          url: location.category === 'international' 
            ? 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23dc2626"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E'
            : 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2316a34a"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/%3E%3C/svg%3E',
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40)
        }
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-4 max-w-sm">
            <h3 class="font-bold text-lg text-gray-800 mb-2">${location.name}</h3>
            <p class="text-gray-600 mb-2">${location.description}</p>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>วันที่เยี่ยมชม: ${new Date(location.visitDate).toLocaleDateString('th-TH')}</span>
              <div class="flex items-center">
                <span class="mr-1">⭐</span>
                <span>${location.rating}/5</span>
              </div>
            </div>
            <div class="mt-2">
              <span class="inline-block px-2 py-1 rounded-full text-xs font-medium ${
                location.category === 'international' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }">
                ${location.category === 'international' ? 'ต่างประเทศ' : 'ในประเทศ'}
              </span>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    // Adjust map bounds to show all markers
    if (locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      mapInstanceRef.current.fitBounds(bounds);
      
      // Set minimum zoom level
      const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
        if (mapInstanceRef.current.getZoom() > 15) {
          mapInstanceRef.current.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }

  }, [locations, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Add location button */}
      <button
        onClick={onAddLocation}
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">เพิ่มสถานที่</span>
      </button>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
        <h4 className="font-medium text-gray-800 dark:text-white mb-2 text-sm">สัญลักษณ์</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">ในประเทศ</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">ต่างประเทศ</span>
          </div>
        </div>
      </div>

      {/* Location count */}
      {locations.length > 0 && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-800 dark:text-white">
              {locations.length} สถานที่
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelMap;