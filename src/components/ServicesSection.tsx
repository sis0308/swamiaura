import React from 'react';
import { SERVICES_LIST } from '../data/products';
import { useCart } from '../context/CartContext';
import {
  Sparkles,
  Maximize2,
  Palette,
  Truck,
  RotateCcw,
  Headphones,
  Building2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Maximize2,
  Palette,
  Truck,
  RotateCcw,
  Headphones,
  Building2,
  Layers
};

export const ServicesSection: React.FC = () => {
  const { navigateTo } = useCart();

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200/80" id="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Choose TEEZOON</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-display tracking-tight">
            Tailored Excellence In Every Stitch
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            From single bespoke streetwear fits to large-scale corporate merchandise, we combine master craftsmanship with modern logistical speed.
          </p>
        </div>

        {/* 8 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_LIST.map((service, index) => {
            const IconComponent = ICON_MAP[service.iconName] || Sparkles;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-[#FAFAFA] hover:bg-white rounded-2xl p-6 border border-neutral-200/80 hover:border-neutral-300 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 group-hover:bg-black text-white flex items-center justify-center mb-5 transition-colors shadow-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {service.highlight && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 block mb-1">
                      {service.highlight}
                    </span>
                  )}

                  <h3 className="text-base font-bold text-neutral-950 font-display group-hover:text-neutral-700 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-neutral-200/60 flex items-center justify-between">
                  <button
                    onClick={() => navigateTo('/services')}
                    className="text-xs font-bold text-neutral-900 hover:text-black flex items-center gap-1 group-hover:underline"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner for Bulk Inquiry */}
        <div className="mt-12 bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl font-bold font-display">
              Need Bulk Corporate or Custom Event T-Shirts?
            </h4>
            <p className="text-xs text-neutral-400 max-w-xl">
              Get customized embroidery, screen printing, and special volume pricing for colleges, startups, and enterprises.
            </p>
          </div>
          <button
            onClick={() => navigateTo('/services')}
            className="bg-white hover:bg-neutral-200 text-neutral-950 px-6 py-3 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md shrink-0"
          >
            Get Custom Quote
          </button>
        </div>

      </div>
    </section>
  );
};
