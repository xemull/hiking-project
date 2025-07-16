'use client';

import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
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

// Register all the necessary components, including the new datalabels plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels // Register the new plugin
);

// Helper function to find the elevation at a specific landmark distance
function getElevationAtDistance(profileData, distance) {
  for (let i = 0; i < profileData.length - 1; i++) {
    const p1 = profileData[i];
    const p2 = profileData[i + 1];
    if (distance >= p1[0] && distance <= p2[0]) {
      // Linear interpolation to find the exact elevation
      const ratio = (distance - p1[0]) / (p2[0] - p1[0]);
      return p1[1] + ratio * (p2[1] - p1[1]);
    }
  }
  return profileData[profileData.length - 1][1]; // Default to last point if out of bounds
}

export default function ElevationProfile({ profileData, landmarks }) {
  if (!profileData || profileData.length < 2) {
    return <p>Simplified profile data is not available.</p>;
  }

  const chartData = profileData.map(p => ({ x: p[0], y: p[1] }));

  // Prepare the landmark data for the second dataset
  const landmarkData = landmarks?.map(landmark => ({
    x: landmark.distance,
    y: getElevationAtDistance(profileData, landmark.distance),
    name: landmark.name
  })) || [];

  const data = {
    datasets: [
      // Dataset 1: The main elevation profile line
      {
        label: 'Elevation (m)',
        data: chartData,
        borderColor: 'rgba(0, 0, 0, 0.6)',
        tension: 0, // Makes lines straight
        pointRadius: 0,
        fill: true,
        // Restore the gradient background
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)');   // Red
          gradient.addColorStop(0.5, 'rgba(234, 179, 8, 0.5)'); // Yellow
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0.5)');  // Green
          return gradient;
        },
      },
      // Dataset 2: An invisible scatter plot for the landmark labels
      {
        label: 'Landmarks',
        data: landmarkData,
        type: 'scatter', // This is important
        pointRadius: 5,
        pointBackgroundColor: 'rgba(0, 0, 0, 0.7)',
        datalabels: {
          align: 'top',
          offset: 8,
          formatter: (value) => value.name, // Display the landmark name
          font: {
            size: 10,
          },
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: 3,
          padding: 4,
        }
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      // The main datalabels plugin is now used instead of annotations
      datalabels: {
        display: (context) => context.dataset.label === 'Landmarks', // Only show labels for the landmark dataset
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Distance (km)',
        },
        // Set the X-axis to end at the last point's distance
        min: 0,
        max: profileData[profileData.length - 1][0],
      },
      y: {
        title: {
          display: true,
          text: 'Elevation (m)',
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: '250px' }}>
      <Line options={options} data={data} />
    </div>
  );
}