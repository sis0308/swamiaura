import React from 'react';
import { CATEGORIES } from '../data/categories';
import { useCart } from '../context/CartContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const CategorySection: React.FC = () => {
  const { navigateTo } = useCart();

  return (
    <section className="py-16 sm:py-24 bg-[#F8F8F8] border-b border-neutral-200/60" id="categories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 text-neutral-600 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
              <span>Signature Curation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-display tracking-tight">
              Browse By Category
            </h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-xl">
              Explore 10 bespoke styles crafted for every silhouette, occasion, and lifestyle.
            </p>
          </div>

          <button
            onClick={() => navigateTo('/shop')}
            className="self-start md:self-auto flex items-center gap-2 text-sm font-bold text-neutral-950 hover:text-neutral-700 group transition-colors"
          >
            <span>View All T-Shirts</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 10 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => navigateTo(`/category/${cat.slug}`)}
              className="group relative flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer text-left h-full"
              id={`category-card-${cat.slug}`}
            >
              {/* Category Image with Hover Zoom */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Badge if available */}
                {cat.badge && (
                  <span className="absolute top-3 left-3 bg-white/95 text-neutral-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs backdrop-blur-xs">
                    {cat.badge}
                  </span>
                )}

                <span className="absolute bottom-3 right-3 text-white text-[11px] font-semibold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                  {cat.productCount} Styles
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-950 font-display group-hover:text-neutral-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed line-clamp-2">
                    {cat.shortDescription}
                  </p>
                </div>

                {/* View Collection Button */}
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:text-black group-hover:underline">
                    <span>VIEW COLLECTION</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
