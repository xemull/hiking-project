// src/app/components/FilterBar.tsx
"use client";

interface FilterBarProps {
  countries: string[];
  sceneries: string[];
  onFilterChange: (filterType: string, value: string) => void;
}

export default function FilterBar({ countries, sceneries, onFilterChange }: FilterBarProps) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-8 flex flex-wrap gap-4 items-center">
      <label htmlFor="country-filter" className="font-semibold">Filter by:</label>

      <select 
        id="country-filter"
        className="p-2 border rounded-md"
        onChange={(e) => onFilterChange('country', e.target.value)}
      >
        <option value="">All Countries</option>
        {countries.map(country => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>

      <select 
        className="p-2 border rounded-md"
        onChange={(e) => onFilterChange('scenery', e.target.value)}
      >
        <option value="">All Sceneries</option>
        {sceneries.map(scenery => (
          <option key={scenery} value={scenery}>{scenery}</option>
        ))}
      </select>
    </div>
  );
}