/**
 * Gallery Filter Bar (Molecule)
 * Filters and search for gallery
 */

'use client';

import { useState } from 'react';

interface GalleryFilterBarProps {
  onFilterChange: (filters: {
    jewelryType?: string;
    mode?: string;
    sortBy?: 'newest' | 'oldest';
    searchQuery?: string;
  }) => void;
}

const jewelryTypes = [
  { value: '', label: 'All Jewelry' },
  { value: 'ring', label: 'Rings' },
  { value: 'necklace', label: 'Necklaces' },
  { value: 'bracelet', label: 'Bracelets' },
  { value: 'earring', label: 'Earrings' },
];

const modes = [
  { value: '', label: 'All Modes' },
  { value: 'quick', label: 'Quick' },
  { value: 'selective', label: 'Selective' },
  { value: 'advanced', label: 'Advanced' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export function GalleryFilterBar({ onFilterChange }: GalleryFilterBarProps) {
  const [jewelryType, setJewelryType] = useState('');
  const [mode, setMode] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterUpdate = (updates: Partial<typeof filters>) => {
    const newFilters = { ...filters, ...updates };
    onFilterChange({
      jewelryType: newFilters.jewelryType || undefined,
      mode: newFilters.mode || undefined,
      sortBy: newFilters.sortBy,
      searchQuery: newFilters.searchQuery || undefined,
    });
  };

  const filters = { jewelryType, mode, sortBy, searchQuery };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilterUpdate({ searchQuery: e.target.value });
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Jewelry Type */}
        <div>
          <select
            value={jewelryType}
            onChange={(e) => {
              setJewelryType(e.target.value);
              handleFilterUpdate({ jewelryType: e.target.value });
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            {jewelryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mode */}
        <div>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              handleFilterUpdate({ mode: e.target.value });
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            {modes.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort & Stats */}
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
          <span>Sort by:</span>
        </div>

        <div className="flex gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSortBy(option.value as 'newest' | 'oldest');
                handleFilterUpdate({ sortBy: option.value as 'newest' | 'oldest' });
              }}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                sortBy === option.value
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
