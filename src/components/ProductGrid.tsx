import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { PackageOpen, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onResetFilters }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center my-8 shadow-xs">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400 mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 font-display">
          No T-Shirts Found
        </h3>
        <p className="text-sm text-neutral-500 max-w-md mx-auto mt-1 mb-6">
          We couldn't find any products matching your active filters or search terms. Try clearing some filters.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatePresence>
    </div>
  );
};
