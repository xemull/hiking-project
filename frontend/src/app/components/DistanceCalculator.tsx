// src/app/components/DistanceCalculator.tsx
'use client';

import { useState, useEffect } from 'react';
import { TMBAccommodation } from '../services/api';
import { MapPin, ArrowRight, Mountain, Route, X } from 'lucide-react';

interface DistanceCalculatorProps {
  accommodations: TMBAccommodation[];
  selectedAccommodations?: TMBAccommodation[];
  onSelectionChange?: (accommodations: TMBAccommodation[]) => void;
}

interface DistanceResult {
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  estimatedTime: string;
}

// Haversine formula for calculating distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Estimate hiking time based on distance and elevation
function estimateHikingTime(distance: number, elevationGain: number): string {
  // Naismith's rule: 1 hour per 5km + 1 hour per 600m elevation gain
  const timeForDistance = distance / 5; // hours
  const timeForElevation = elevationGain / 600; // hours
  const totalHours = timeForDistance + timeForElevation;
  
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  
  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}min`;
  }
}

export default function DistanceCalculator({ 
  accommodations, 
  selectedAccommodations = [],
  onSelectionChange 
}: DistanceCalculatorProps) {
  const [selectedPoints, setSelectedPoints] = useState<TMBAccommodation[]>([]);
  const [result, setResult] = useState<DistanceResult | null>(null);

  // Update selected points when external selection changes
  useEffect(() => {
    if (selectedAccommodations.length > 0) {
      setSelectedPoints(selectedAccommodations.slice(0, 2)); // Max 2 points
    }
  }, [selectedAccommodations]);

  // Calculate distance when we have 2 points
  useEffect(() => {
    if (selectedPoints.length === 2) {
      const [point1, point2] = selectedPoints;
      const distance = calculateDistance(
        point1.latitude, point1.longitude,
        point2.latitude, point2.longitude
      );
      
      const elevationDiff = (point2.altitude || 0) - (point1.altitude || 0);
      const elevationGain = Math.max(0, elevationDiff);
      const elevationLoss = Math.max(0, -elevationDiff);
      
      const estimatedTime = estimateHikingTime(distance, elevationGain);
      
      setResult({
        distance,
        elevationGain,
        elevationLoss,
        estimatedTime
      });
    } else {
      setResult(null);
    }
  }, [selectedPoints]);

  const selectAccommodation = (accommodation: TMBAccommodation) => {
    setSelectedPoints(prev => {
      let newSelection;
      
      if (prev.find(p => p.id === accommodation.id)) {
        // Remove if already selected
        newSelection = prev.filter(p => p.id !== accommodation.id);
      } else if (prev.length < 2) {
        // Add if we have less than 2
        newSelection = [...prev, accommodation];
      } else {
        // Replace first selection if we already have 2
        newSelection = [prev[1], accommodation];
      }
      
      // Use setTimeout to avoid calling during render
      setTimeout(() => {
        onSelectionChange?.(newSelection);
      }, 0);
      
      return newSelection;
    });
  };

  const clearSelection = () => {
    setSelectedPoints([]);
    setResult(null);
    setTimeout(() => {
      onSelectionChange?.([]);
    }, 0);
  };

  const getSelectionLabel = (index: number): string => {
    return index === 0 ? 'Starting Point' : 'Destination';
  };

  const getSelectionNumber = (accommodation: TMBAccommodation): number | null => {
    const index = selectedPoints.findIndex(p => p.id === accommodation.id);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="bg-white rounded-lg border p-lg">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-semibold text-lg flex items-center">
          <Route className="w-5 h-5 mr-sm" />
          Distance Calculator
        </h3>
        {selectedPoints.length > 0 && (
          <button
            onClick={clearSelection}
            className="text-gray-500 hover:text-gray-700 p-sm rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-lg">
        Select two accommodations to calculate the direct distance and elevation difference between them.
      </p>

      {/* Selection Status */}
      <div className="space-y-sm mb-lg">
        {selectedPoints.map((point, index) => (
          <div key={point.id} className="flex items-center p-sm bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full mr-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{point.name}</div>
              <div className="text-xs text-gray-600">
                {point.type} • {point.location_type}
                {point.altitude && ` • ${point.altitude}m`}
              </div>
            </div>
            <span className="text-xs text-blue-600 font-medium">
              {getSelectionLabel(index)}
            </span>
          </div>
        ))}
        
        {selectedPoints.length < 2 && (
          <div className="text-sm text-gray-500 text-center py-md">
            {selectedPoints.length === 0 
              ? "Click accommodations below to select starting point"
              : "Select destination to calculate distance"
            }
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-md mb-lg">
          <h4 className="font-medium text-green-800 mb-sm flex items-center">
            <MapPin className="w-4 h-4 mr-xs" />
            Distance & Elevation
          </h4>
          <div className="grid grid-cols-2 gap-md text-sm">
            <div>
              <span className="text-gray-600">Direct Distance:</span>
              <div className="font-semibold text-green-700">{result.distance.toFixed(1)} km</div>
            </div>
            <div>
              <span className="text-gray-600">Est. Hiking Time:</span>
              <div className="font-semibold text-green-700">{result.estimatedTime}</div>
            </div>
            <div>
              <span className="text-gray-600">Elevation Gain:</span>
              <div className="font-semibold text-green-700">{result.elevationGain} m</div>
            </div>
            <div>
              <span className="text-gray-600">Elevation Loss:</span>
              <div className="font-semibold text-green-700">{result.elevationLoss} m</div>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-sm">
            * Direct distance only. Actual trail distance may be longer.
          </p>
        </div>
      )}

      {/* Accommodation Selection Grid */}
      <div className="space-y-xs max-h-96 overflow-y-auto">
        <h4 className="font-medium text-sm text-gray-700 mb-sm">Select Accommodations:</h4>
        {accommodations.map(accommodation => {
          const selectionNumber = getSelectionNumber(accommodation);
          const isSelected = selectionNumber !== null;
          
          return (
            <button
              key={accommodation.id}
              onClick={() => selectAccommodation(accommodation)}
              className={`w-full text-left p-sm rounded-lg border-2 transition-colors ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                {isSelected && (
                  <div className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full mr-sm">
                    {selectionNumber}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-sm">{accommodation.name}</div>
                  <div className="text-xs text-gray-600 flex items-center space-x-sm">
                    <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs ${
                      accommodation.type === 'Refuge' ? 'bg-green-100 text-green-700' :
                      accommodation.type === 'Hotel' ? 'bg-blue-100 text-blue-700' :
                      accommodation.type === 'B&B' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {accommodation.type}
                    </span>
                    <span>{accommodation.location_type}</span>
                    {accommodation.altitude && (
                      <span className="flex items-center">
                        <Mountain className="w-3 h-3 mr-1" />
                        {accommodation.altitude}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}