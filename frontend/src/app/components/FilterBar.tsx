// src/app/components/FilterBar.tsx
'use client';

interface LengthRange {
  label: string;
  value: string;
}

interface FilterBarProps {
  countries: string[];
  sceneries: string[];
  difficulties: string[];
  lengthRanges: LengthRange[];
  continents: string[];
  months: string[];
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
}

export default function FilterBar({ 
  countries, 
  sceneries, 
  difficulties,
  lengthRanges,
  continents,
  months,
  onFilterChange,
  onClearFilters
}: FilterBarProps) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-8">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <label className="font-semibold">Filter by:</label>
        
        {/* Country Filter */}
        <select 
          className="p-2 border rounded-md"
          onChange={(e) => onFilterChange('country', e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>

        {/* Continent Filter */}
        <select 
          className="p-2 border rounded-md"
          onChange={(e) => onFilterChange('continent', e.target.value)}
        >
          <option value="">All Continents</option>
          {continents.map((continent, index) => (
            <option key={index} value={continent}>{continent}</option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select 
          className="p-2 border rounded-md"
          onChange={(e) => onFilterChange('difficulty', e.target.value)}
        >
          <option value="">All Difficulties</option>
          {difficulties.map((difficulty, index) => (
            <option key={index} value={difficulty}>{difficulty}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {/* Length Filter */}
        <select 
          className="p-2 border rounded-md"
          onChange={(e) => onFilterChange('length', e.target.value)}
        >
          <option value="">All Lengths</option>
          {lengthRanges.map((range) => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>

        {/* Scenery Filter */}
        <select 
          className="p-2 border rounded-md"
          onChange={(e) => onFilterChange('scenery', e.target.value)}
        >
          <option value="">All Sceneries</option>
          {sceneries.map((scenery, index) => (
            <option key={index} value={scenery}>{scenery}</option>
          ))}
        </select>

        {/* Month Filter */}
        <select 
          className="p-2 border rounded-md"
          onChange={(e) => onFilterChange('month', e.target.value)}
        >
          <option value="">All Months</option>
          {months.map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}