'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export default function ElevationProfile({ track }) {
  // This block checks for elevation data.
  const hasElevationData = track.coordinates[0] && track.coordinates[0].length > 2;

  if (!hasElevationData) {
    // If no data, render nothing.
    return null;
  }
  
  const labels = [];
  const elevationData = [];
  let cumulativeDistance = 0;

  track.coordinates.forEach((coord, index) => {
    const elevation = coord[2];
    if (index > 0) {
      const prevCoord = track.coordinates[index - 1];
      cumulativeDistance += getDistance(prevCoord[1], prevCoord[0], coord[1], coord[0]);
    }
    labels.push(cumulativeDistance.toFixed(1));
    elevationData.push(elevation.toFixed(1));
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Elevation (m)',
        data: elevationData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Distance (km)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Elevation (m)',
        },
      },
    },
  };

  return <Line options={options} data={data} />;
}