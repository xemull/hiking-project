'use client';

import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ track }) {
  // The 'track' data from the database is in a format called GeoJSON.
  // Its coordinates are arrays of [longitude, latitude].
  // The Polyline component needs them as [latitude, longitude], so we swap them.
  const positions = track.coordinates.map(coord => [coord[1], coord[0]]);

  // A simple check to avoid errors if the track is empty.
  if (positions.length === 0) {
    return <p>No map data available.</p>;
  }

  return (
    <MapContainer 
      center={positions[0]} 
      zoom={13} 
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={positions} color="blue" />
    </MapContainer>
  );
}