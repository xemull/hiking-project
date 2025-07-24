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
      
      {/* Country Filter */}
      <select 
        id="country-filter"
        className="p-2 border rounded-md"
        onChange={(e) => onFilterChange('country', e.target.value)}
      >
        <option value="">All Countries</option>
        {/* FIX: Add 'index' and use it as the key */}
        {countries.map((country, index) => (
          <option key={index} value={country}>{country}</option>
        ))}
      </select>

      {/* Scenery Filter */}
      <select 
        className="p-2 border rounded-md"
        onChange={(e) => onFilterChange('scenery', e.target.value)}
      >
        <option value="">All Sceneries</option>
        {/* FIX: Add 'index' and use it as the key */}
        {sceneries.map((scenery, index) => (
          <option key={index} value={scenery}>{scenery}</option>
        ))}
      </select>
    </div>
  );
}