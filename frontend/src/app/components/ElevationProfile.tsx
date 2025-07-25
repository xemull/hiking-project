// src/app/components/ElevationProfile.tsx
'use client';

import { useEffect, useState } from 'react';

interface ElevationPoint {
  distance: number;
  elevation: number;
}

interface Landmark {
  id: number;
  name: string;
  distance: number;
}

interface ElevationProfileProps {
  data: Array<[number, number]> | ElevationPoint[];
  landmarks?: Landmark[];
  className?: string;
  height?: string;
}

// Helper function to find the elevation at a specific landmark distance
function getElevationAtDistance(profileData: Array<[number, number]>, distance: number): number {
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

export default function ElevationProfile({ 
  data, 
  landmarks, 
  className = '', 
  height = '300px' 
}: ElevationProfileProps) {
  const [chartComponents, setChartComponents] = useState<any>(null);

  // Dynamically import Chart.js components to avoid SSR issues
  useEffect(() => {
    const loadChartComponents = async () => {
      try {
        const [
          { Line },
          ChartJS,
          ChartDataLabels
        ] = await Promise.all([
          import('react-chartjs-2'),
          import('chart.js/auto'), // Auto import includes all necessary components
          import('chartjs-plugin-datalabels')
        ]);

        // Register the datalabels plugin
        ChartJS.Chart.register(ChartDataLabels);

        setChartComponents({
          Line,
          Chart: ChartJS.Chart,
          ChartDataLabels
        });
      } catch (error) {
        console.error('Failed to load chart components:', error);
      }
    };

    loadChartComponents();
  }, []);

  // Validate and process data
  if (!data || data.length < 2) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm font-medium">No elevation data available</p>
          <p className="text-xs text-gray-500">Elevation profile not found</p>
        </div>
      </div>
    );
  }

  // Show loading state while components are loading
  if (!chartComponents) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <svg className="w-8 h-8 mx-auto mb-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="text-sm">Loading elevation chart...</p>
        </div>
      </div>
    );
  }

  // Normalize data to [distance, elevation] format
  const profileData: Array<[number, number]> = Array.isArray(data[0]) 
    ? data as Array<[number, number]>
    : (data as ElevationPoint[]).map(point => [point.distance, point.elevation]);

  // Prepare chart data
  const chartData = profileData.map(([distance, elevation]) => ({ x: distance, y: elevation }));

  // Prepare landmark data if available
  const landmarkData = landmarks?.map(landmark => ({
    x: landmark.distance,
    y: getElevationAtDistance(profileData, landmark.distance),
    name: landmark.name
  })) || [];

  // Calculate elevation statistics
  const elevations = profileData.map(([_, elevation]) => elevation);
  const minElevation = Math.min(...elevations);
  const maxElevation = Math.max(...elevations);
  const totalDistance = profileData[profileData.length - 1][0];

  const data_config = {
    datasets: [
      // Main elevation profile
      {
        label: 'Elevation',
        data: chartData,
        borderColor: 'rgba(59, 130, 246, 1)', // Blue
        borderWidth: 3,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
        fill: true,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
          return gradient;
        },
      },
      // Landmarks (if any)
      ...(landmarkData.length > 0 ? [{
        label: 'Landmarks',
        data: landmarkData,
        type: 'scatter' as const,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)', // Red
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointBorderWidth: 3,
        pointHoverBorderWidth: 4,
        showLine: false,
        datalabels: {
          display: true,
          align: 'top' as const,
          offset: 10,
          formatter: (value: any) => value.name,
          font: {
            size: 11,
            weight: 'bold' as const,
          },
          backgroundColor: 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          borderRadius: 4,
          padding: {
            top: 4,
            bottom: 4,
            left: 8,
            right: 8,
          },
        }
      }] : [])
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'point' as const,
      intersect: true,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'point' as const,
        intersect: true,
        callbacks: {
          title: (context: any) => {
            const datasetIndex = context[0].datasetIndex;
            if (datasetIndex === 1) { // Landmarks dataset
              const point = landmarkData[context[0].dataIndex];
              return point.name; // Show landmark name as title
            } else {
              return `Distance: ${context[0].parsed.x.toFixed(1)} km`;
            }
          },
          label: (context: any) => {
            const datasetIndex = context.datasetIndex;
            if (datasetIndex === 1) { // Landmarks dataset
              return `Elevation: ${context.parsed.y.toFixed(0)} m`;
            } else {
              return `Elevation: ${context.parsed.y.toFixed(0)} m`;
            }
          },
        },
      },
      datalabels: {
        display: (context: any) => context.dataset.label === 'Landmarks',
      }
    },
    onHover: (event: any, elements: any) => {
      if (elements.length > 0) {
        const element = elements[0];
        if (element.datasetIndex === 1) { // Landmarks dataset
          event.native.target.style.cursor = 'pointer';
        } else {
          event.native.target.style.cursor = 'crosshair';
        }
      } else {
        event.native.target.style.cursor = 'default';
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Distance (km)',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        min: 0,
        max: totalDistance,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Elevation (m)',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        min: 0, // Always start Y-axis at 0
        max: maxElevation + (maxElevation - minElevation) * 0.1,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      },
    },
  };

  const { Line } = chartComponents;

  return (
    <div className={`rounded-lg overflow-hidden shadow-sm border ${className}`} style={{ height }}>
      {/* Chart Container - Full height, no header */}
      <div className="p-4 h-full">
        <Line data={data_config} options={options} />
      </div>
    </div>
  );
}