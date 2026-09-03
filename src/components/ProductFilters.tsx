import React from 'react';
import { FilterState } from '../types';
import { CATEGORIES } from '../data/categories';
import { X, RotateCcw, SlidersHorizontal, Check, Star } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

const AVAILABLE_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Olive', hex: '#3F6212' },
  { name: 'Terracotta', hex: '#C2410C' },
  { name: 'Burgundy', hex: '#881337' },
  { name: 'Teal', hex: '#0F766E' },
  { name: 'Sage', hex: '#65A30D' }
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  const handleCategorySelect = (slug: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === slug ? 'all' : slug
    });
  };

  const handleSizeToggle = (size: string) => {
    const nextSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: nextSizes });
  };

  const handleColorToggle = (colorName: string) => {
    const nextColors = filters.colors.includes(colorName)
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onFilterChange({ ...filters, colors: nextColors });
  };

  const handlePriceChange = (maxPrice: number) => {
    onFilterChange({
      ...filters,
      priceRange: [0, maxPrice]
    });
  };

  const handleRatingSelect = (rating: number | null) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? null : rating
    });
  };

  return (
    <div className={`space-y-6 text-left ${isMobileDrawer ? 'p-6' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-black" />
          <span className="font-bold text-xs uppercase tracking-widest text-black">
            Filters
          </span>
          <span className="text-[10px] font-mono font-semibold bg-neutral-100 text-neutral-600 px-1.5 py-0.5">
            {totalResults} items
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {isMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="p-1 text-neutral-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2 pb-4 border-b border-gray-200">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 font-mono">
          Special Curation
        </p>
        <label className="flex items-center gap-2.5 text-xs font-medium text-neutral-800 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.onlyNew}
            onChange={(e) => onFilterChange({ ...filters, onlyNew: e.target.checked })}
            className="w-3.5 h-3.5 rounded-none text-black focus:ring-black border-gray-300 accent-black"
          />
          <span>New Arrivals Only</span>
        </label>
        <label className="flex items-center gap-2.5 text-xs font-medium text-neutral-800 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.onlyBestSeller}
            onChange={(e) => onFilterChange({ ...filters, onlyBestSeller: e.target.checked })}
            className="w-3.5 h-3.5 rounded-none text-black focus:ring-black border-gray-300 accent-black"
          />
          <span>Best Sellers Only</span>
        </label>
        <label className="flex items-center gap-2.5 text-xs font-medium text-neutral-800 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.onlyOffers}
            onChange={(e) => onFilterChange({ ...filters, onlyOffers: e.target.checked })}
            className="w-3.5 h-3.5 rounded-none text-black focus:ring-black border-gray-300 accent-black"
          />
          <span className="text-neutral-900 font-semibold">Special Offers & Sale</span>
        </label>
      </div>

      {/* Categories */}
      <div className="space-y-2.5 pb-4 border-b border-gray-200">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 font-mono">
          Categories
        </p>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`w-full flex items-center justify-between py-1.5 px-2 text-xs transition-colors ${
              filters.category === 'all' || !filters.category
                ? 'bg-black text-white font-bold'
                : 'text-neutral-700 hover:bg-neutral-100 font-medium'
            }`}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`w-full flex items-center justify-between py-1.5 px-2 text-xs transition-colors ${
                filters.category === cat.slug
                  ? 'bg-black text-white font-bold'
                  : 'text-neutral-700 hover:bg-neutral-100 font-medium'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] font-mono opacity-70">({cat.productCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
            Max Price
          </p>
          <span className="text-xs font-bold text-neutral-950 font-mono">
            ₹{filters.priceRange[1].toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="400"
          max="1500"
          step="50"
          value={filters.priceRange[1]}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full h-1 bg-neutral-200 appearance-none cursor-pointer accent-black"
        />
        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
          <span>₹400</span>
          <span>₹900</span>
          <span>₹1,500+</span>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-2.5 pb-4 border-b border-gray-200">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 font-mono">
          Sizes
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`py-1.5 text-center text-[10px] font-mono border transition-all ${
                  isSelected
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 text-neutral-800 hover:border-black'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-2.5 pb-4 border-b border-gray-200">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 font-mono">
          Colors
        </p>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COLORS.map((col) => {
            const isSelected = filters.colors.includes(col.name);
            return (
              <button
                key={col.name}
                onClick={() => handleColorToggle(col.name)}
                title={col.name}
                className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-black ring-offset-2 scale-110'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                aria-label={`Filter by ${col.name}`}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 ${
                      col.name === 'White' ? 'text-black' : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 font-mono">
          Minimum Rating
        </p>
        <div className="flex items-center gap-2">
          {[4, 4.5, 4.8].map((rate) => (
            <button
              key={rate}
              onClick={() => handleRatingSelect(rate)}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono border transition-colors ${
                filters.rating === rate
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 text-neutral-800 hover:border-black'
              }`}
            >
              <Star className="w-2.5 h-2.5 fill-current" />
              <span>{rate}★+</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
