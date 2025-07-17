'use client';

import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import the main Leaflet library
import { useEffect } from 'react';

// This is a new helper component that will contain the map's logic
function MapLogic({ track }) {
  const map = useMap(); // Get a reference to the map instance

  useEffect(() => {
    if (track && track.coordinates && track.coordinates.length > 0) {
      // The react-leaflet Polyline component expects an array of [lat, lon] tuples.
      // GeoJSON coordinates are [lon, lat], so we need to map and swap them.
      const positions = track.coordinates.map(coord => [coord[1], coord[0]]);
      
      // Create a LatLngBounds object to encompass all the points of the trail
      const bounds = L.latLngBounds(positions);
      
      // Tell the map to fit itself to these bounds
      map.fitBounds(bounds, { padding: [25, 25] }); // Add a little padding
    }
  }, [track, map]); // Re-run this effect if the track or map changes

  const positions = track.coordinates.map(coord => [coord[1], coord[0]]);
  return <Polyline positions={positions} color="blue" />;
}


export default function Map({ track }) {
  // A simple check to avoid errors if the track is empty.
  if (!track || !track.coordinates || track.coordinates.length === 0) {
    return <p>No map data available.</p>;
  }

  // Use the first point as an initial, temporary center
  const initialCenter = [track.coordinates[0][1], track.coordinates[0][0]];

  return (
    <MapContainer 
      center={initialCenter} 
      zoom={13} 
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Use the new helper component to handle the logic */}
      <MapLogic track={track} />
    </MapContainer>
  );
}