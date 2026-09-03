import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Search, X, ArrowRight, Tag, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const POPULAR_SEARCHES = [
  'Oversized Black',
  'Polo Collared',
  '240 GSM French Terry',
  'Graphic Printed',
  'Egyptian Giza',
  'Sports Activewear',
  'Full Sleeve',
  'Pure White'
];

export const SearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    navigateTo
  } = useCart();
  const { products } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const searchResults = cleanQuery
    ? products.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(cleanQuery);
        const matchesCategory = p.category.toLowerCase().includes(cleanQuery);
        const matchesFabric = p.fabric.toLowerCase().includes(cleanQuery);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(cleanQuery));
        const matchesColors = p.colors.some((c) => c.name.toLowerCase().includes(cleanQuery));
        const matchesSleeve = p.sleeve.toLowerCase().includes(cleanQuery);
        return matchesName || matchesCategory || matchesFabric || matchesTags || matchesColors || matchesSleeve;
      })
    : [];

  const handleSelectProduct = (product: Product) => {
    setSearchModalOpen(false);
    navigateTo(`/product/${product.id}`);
  };

  const handleSearchTagClick = (tag: string) => {
    setQuery(tag);
  };

  const handleViewAllResults = () => {
    setSearchModalOpen(false);
    navigateTo(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 pb-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSearchModalOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden z-10 border border-neutral-200 text-left"
        >
          {/* Search Input Bar */}
          <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center gap-3">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by T-Shirt name, style, color, category (e.g. Black, Polo, 240 GSM)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm sm:text-base font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSearchModalOpen(false)}
              className="text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1.5 rounded-lg ml-1"
            >
              ESC
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
            {/* When Query is Empty -> Show Popular Searches */}
            {!cleanQuery && (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearchTagClick(term)}
                      className="text-xs font-semibold bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 px-3 py-2 rounded-xl transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* When Query has Results */}
            {cleanQuery && searchResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <span>Found {searchResults.length} Products</span>
                  <button
                    onClick={handleViewAllResults}
                    className="text-neutral-900 hover:underline flex items-center gap-1"
                  >
                    <span>View in Shop</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-neutral-100">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="py-3 flex items-center justify-between gap-4 hover:bg-neutral-50 p-2 rounded-xl cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-lg bg-neutral-100 shrink-0"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                            {product.category}
                          </p>
                          <h4 className="text-sm font-bold text-neutral-900 group-hover:text-neutral-700">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-extrabold text-neutral-950">
                              ₹{product.price}
                            </span>
                            <span className="text-[10px] text-neutral-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                            <div className="flex items-center gap-0.5 text-amber-500 text-[11px] font-semibold">
                              <Star className="w-3 h-3 fill-current" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900 group-hover:underline flex items-center gap-1">
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* When Query Has No Results */}
            {cleanQuery && searchResults.length === 0 && (
              <div className="text-center py-10 space-y-3">
                <p className="text-sm font-bold text-neutral-900">
                  No matching T-Shirts for "{query}"
                </p>
                <p className="text-xs text-neutral-500">
                  Try searching for keywords like "Polo", "Oversized", "Black", "240 GSM", or "Cotton".
                </p>
              </div>
            )}
          </div>

          {/* Footer Action */}
          {cleanQuery && searchResults.length > 0 && (
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
              <button
                onClick={handleViewAllResults}
                className="bg-neutral-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-black transition-colors flex items-center gap-1.5"
              >
                <span>Open Full Catalog with Filters</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
