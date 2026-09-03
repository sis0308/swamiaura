import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES } from '../data/categories';
import { FilterState, Product } from '../types';
import { ProductGrid } from '../components/ProductGrid';
import { ProductFilters } from '../components/ProductFilters';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  Sparkles,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ShopView: React.FC = () => {
  const { currentRoute, navigateTo } = useCart();
  const { products } = useStore();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 1500],
    sizes: [],
    colors: [],
    rating: null,
    onlyNew: false,
    onlyBestSeller: false,
    onlyOffers: false,
    sortBy: 'featured',
    searchQuery: ''
  });

  // Sync route params with filter state
  useEffect(() => {
    if (currentRoute.startsWith('/category/')) {
      const slug = currentRoute.replace('/category/', '');
      setFilters((prev) => ({
        ...prev,
        category: slug,
        onlyNew: false,
        onlyBestSeller: false,
        onlyOffers: false
      }));
    } else if (currentRoute === '/new-arrivals') {
      setFilters((prev) => ({
        ...prev,
        category: 'all',
        onlyNew: true,
        onlyBestSeller: false,
        onlyOffers: false
      }));
    } else if (currentRoute === '/best-sellers') {
      setFilters((prev) => ({
        ...prev,
        category: 'all',
        onlyNew: false,
        onlyBestSeller: true,
        onlyOffers: false
      }));
    } else if (currentRoute === '/offers') {
      setFilters((prev) => ({
        ...prev,
        category: 'all',
        onlyNew: false,
        onlyBestSeller: false,
        onlyOffers: true
      }));
    }
  }, [currentRoute]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 1500],
      sizes: [],
      colors: [],
      rating: null,
      onlyNew: false,
      onlyBestSeller: false,
      onlyOffers: false,
      sortBy: 'featured',
      searchQuery: ''
    });
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((p) => p.categorySlug === filters.category);
    }

    // Special toggles
    if (filters.onlyNew) {
      result = result.filter((p) => p.isNew);
    }
    if (filters.onlyBestSeller) {
      result = result.filter((p) => p.isBestSeller);
    }
    if (filters.onlyOffers) {
      result = result.filter((p) => p.discount > 0 || p.isOffer);
    }

    // Price Filter
    result = result.filter((p) => p.price <= filters.priceRange[1]);

    // Size Filter
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        filters.sizes.some((s) => p.sizes.includes(s as any))
      );
    }

    // Color Filter
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        filters.colors.some((col) =>
          p.colors.some((c) => c.name.toLowerCase().includes(col.toLowerCase()))
        )
      );
    }

    // Rating Filter
    if (filters.rating) {
      result = result.filter((p) => p.rating >= (filters.rating || 0));
    }

    // Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.colors.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (filters.sortBy === 'best-selling') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [filters, products]);

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === filters.category);

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24">
      {/* Header Banner */}
      <div className="bg-neutral-950 text-white py-12 px-4 sm:px-6 lg:px-8 text-left border-b border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-neutral-400">
                Official Catalog
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mt-1">
                {activeCategoryObj
                  ? activeCategoryObj.name
                  : filters.onlyNew
                  ? 'New Arrivals'
                  : filters.onlyBestSeller
                  ? 'Best Sellers'
                  : filters.onlyOffers
                  ? 'Discounted & Promotional Offers'
                  : 'All Premium T-Shirts'}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
                {activeCategoryObj
                  ? activeCategoryObj.shortDescription
                  : 'Discover 240 GSM heavy combed cotton streetwear, tailored micro-piqué polos and breathable activewear.'}
              </p>
            </div>

            {/* Quick Horizontal Category Badges */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => {
                  setFilters({ ...filters, category: 'all' });
                  navigateTo('/shop');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  filters.category === 'all'
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                All (24)
              </button>
              {CATEGORIES.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setFilters({ ...filters, category: c.slug });
                    navigateTo(`/category/${c.slug}`);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    filters.category === c.slug
                      ? 'bg-white text-neutral-950 shadow-xs'
                      : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {c.name.replace(' T-Shirts', '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Control Bar: Search input, Sort selector, Mobile filter button */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, color, style..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Mobile Filter Trigger */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium hidden sm:inline">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
                  }
                  className="bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer pr-8 appearance-none"
                >
                  <option value="featured">Featured / Curated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(filters.category !== 'all' ||
          filters.sizes.length > 0 ||
          filters.colors.length > 0 ||
          filters.onlyNew ||
          filters.onlyBestSeller ||
          filters.onlyOffers ||
          filters.searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap mb-6 text-xs">
            <span className="text-neutral-500 font-semibold">Active:</span>
            {filters.category !== 'all' && (
              <span className="bg-neutral-900 text-white px-2.5 py-1 rounded-lg flex items-center gap-1">
                Category: {activeCategoryObj?.name || filters.category}
                <button onClick={() => setFilters({ ...filters, category: 'all' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.sizes.map((s) => (
              <span key={s} className="bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                Size: {s}
                <button
                  onClick={() =>
                    setFilters({ ...filters, sizes: filters.sizes.filter((x) => x !== s) })
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.colors.map((c) => (
              <span key={c} className="bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                Color: {c}
                <button
                  onClick={() =>
                    setFilters({ ...filters, colors: filters.colors.filter((x) => x !== c) })
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.onlyNew && (
              <span className="bg-neutral-900 text-white px-2.5 py-1 rounded-lg flex items-center gap-1">
                New Arrivals
                <button onClick={() => setFilters({ ...filters, onlyNew: false })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.onlyBestSeller && (
              <span className="bg-amber-500 text-neutral-950 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                Best Sellers
                <button onClick={() => setFilters({ ...filters, onlyBestSeller: false })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.onlyOffers && (
              <span className="bg-rose-600 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                On Sale
                <button onClick={() => setFilters({ ...filters, onlyOffers: false })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-neutral-500 hover:text-black underline font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Layout Grid: Desktop Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs sticky top-28">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Right Product Grid */}
          <div className="lg:col-span-9">
            <ProductGrid
              products={filteredProducts}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

      </div>

      {/* Mobile Filters Slide-over Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-screen max-w-sm bg-white shadow-2xl overflow-y-auto"
              >
                <ProductFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={handleResetFilters}
                  totalResults={filteredProducts.length}
                  isMobileDrawer={true}
                  onCloseMobileDrawer={() => setMobileFiltersOpen(false)}
                />
                <div className="p-6 bg-neutral-50 border-t border-neutral-200">
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full bg-neutral-950 text-white font-bold py-3.5 rounded-xl text-xs"
                  >
                    Apply Filters ({filteredProducts.length} Results)
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
