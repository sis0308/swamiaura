import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const HERO_SLIDES = [
  {
    tagline: 'AUTUMN / SUMMER 2026 DROP',
    headline: 'WEAR YOUR STYLE',
    subheadline: 'Premium Heavyweight 240 GSM T-Shirts Engineered For The Perfect Streetwear & Tailored Silhouette.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1400&q=85',
    categoryTarget: '/category/oversized',
    badgeText: '240 GSM French Terry'
  },
  {
    tagline: 'CONTEMPORARY LUXURY ESSENTIALS',
    headline: 'EFFORTLESS ELEGANCE',
    subheadline: 'Egyptian Giza & Micro-Piqué Cotton Polos That Define Smart Casual Mastery.',
    image: 'https://images.unsplash.com/photo-1625910513413-56254c46fdf7?auto=format&fit=crop&w=1400&q=85',
    categoryTarget: '/category/polo',
    badgeText: '100% Egyptian Giza Cotton'
  },
  {
    tagline: 'NEO-TOKYO GRAPHIC ART DROP',
    headline: 'STATEMENT GRAPHICS',
    subheadline: 'High-Density Discharge Prints on Bio-Washed Ring-Spun Organic Cotton.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=85',
    categoryTarget: '/category/printed',
    badgeText: 'Zero-Crack Ink Art'
  }
];

export const Hero: React.FC = () => {
  const { navigateTo } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative bg-[#111111] text-white overflow-hidden border-b border-neutral-800">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 border-b border-neutral-700 pb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
              <span className="w-1.5 h-1.5 bg-white rounded-none" />
              <span>{slide.tagline}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif italic tracking-tight text-white leading-[1.05]">
                Wear Your <br />
                <span className="not-italic font-normal uppercase tracking-tight text-white">
                  Signature Silhouette
                </span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
                240 GSM Combed Cotton · Zero-Pill Bio-Wash · Engineered Drop-Shoulder & Tailored Piqué Architecture.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigateTo('/shop')}
                className="bg-white hover:bg-neutral-200 text-black font-bold px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase transition-all flex items-center gap-2 rounded-none"
                id="hero-shop-now-btn"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigateTo('/category/oversized')}
                className="bg-transparent hover:bg-white/10 text-white border border-neutral-600 font-semibold px-7 py-3.5 text-[11px] tracking-[0.2em] uppercase transition-all rounded-none"
                id="hero-explore-collection-btn"
              >
                <span>OVERSIZED (240 GSM)</span>
              </button>
            </div>

            {/* Quick Metrics / Guarantees */}
            <div className="pt-6 border-t border-neutral-800 grid grid-cols-3 gap-4 text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span>240 GSM Combed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span>Express Pan-India</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span>7-Day Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Image Feature with Smooth Slide Transitions */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative aspect-3/4 w-full bg-[#1A1A1A] overflow-hidden border border-neutral-800 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.headline}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Floating Product Callout Card on Image */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/85 backdrop-blur-md p-4 border-t border-neutral-800 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-amber-400 tracking-widest block font-mono">
                      {slide.badgeText}
                    </span>
                    <p className="text-xs font-serif italic text-white mt-0.5">
                      Summer 2026 Editorial Drop
                    </p>
                    <p className="text-[10px] text-neutral-400 font-mono">From ₹599</p>
                  </div>
                  <button
                    onClick={() => navigateTo(slide.categoryTarget)}
                    className="bg-white text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 hover:bg-neutral-200 transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {HERO_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1 transition-all ${
                      currentSlide === index
                        ? 'w-6 bg-white'
                        : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
