import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

const FEATURED_HIGHLIGHTS = [
  {
    id: 'oversized',
    title: '240 GSM Oversized',
    desc: 'Heavyweight drop-shoulder streetwear cuts with zero sag.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85',
    categoryTarget: '/category/oversized',
    badge: 'Heavyweight 240 GSM',
    price: 'From ₹699'
  },
  {
    id: 'polo',
    title: 'Micro-Piqué Polos',
    desc: 'Egyptian Giza cotton collared knit for smart casual wear.',
    image: 'https://images.unsplash.com/photo-1625910513413-56254c46fdf7?auto=format&fit=crop&w=1200&q=85',
    categoryTarget: '/category/polo',
    badge: '100% Giza Cotton',
    price: 'From ₹799'
  },
  {
    id: 'printed',
    title: 'Graphic Art Tees',
    desc: 'High-density discharge prints on bio-washed organic cotton.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
    categoryTarget: '/category/printed',
    badge: 'Zero-Crack Print',
    price: 'From ₹599'
  }
];

export const Hero: React.FC = () => {
  const { navigateTo } = useCart();
  const [selectedHighlightIndex, setSelectedHighlightIndex] = useState(0);

  const selectedFeature = FEATURED_HIGHLIGHTS[selectedHighlightIndex];

  return (
    <div className="relative bg-neutral-950 text-white overflow-hidden border-b border-neutral-800">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL TEEZOON STORE · 100% COMBED COTTON</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Everyday Luxury <br />
                <span className="text-neutral-400 font-normal">Heavyweight T-Shirts</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed">
                240 GSM Bio-Washed French Terry, Micro-Piqué Polos & Signature Everyday Basics. Engineered for zero shrinkage, colorfastness, and all-day comfort.
              </p>
            </div>

            {/* Direct Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('/shop')}
                className="bg-white hover:bg-neutral-200 text-black font-extrabold px-7 py-3.5 text-xs tracking-wider uppercase transition-all flex items-center gap-2 rounded-xl shadow-lg hover:scale-102"
                id="hero-shop-all-btn"
              >
                <span>SHOP ALL T-SHIRTS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('/new-arrivals')}
                className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-bold px-6 py-3.5 text-xs tracking-wider uppercase transition-all rounded-xl hover:border-neutral-500"
                id="hero-new-arrivals-btn"
              >
                <span>NEW ARRIVALS</span>
              </button>

              <button
                onClick={() => navigateTo('/best-sellers')}
                className="bg-neutral-900 hover:bg-neutral-800 text-rose-300 border border-neutral-700 font-bold px-5 py-3.5 text-xs tracking-wider uppercase transition-all rounded-xl hover:border-neutral-500"
                id="hero-best-sellers-btn"
              >
                <span>BEST SELLERS</span>
              </button>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Bio-Wash</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>240 GSM French Terry</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>7-Day Return/Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Product Showcase - Normal Static Presentation (No Slideshow!) */}
          <div className="lg:col-span-5 text-left">
            <div className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-4 shadow-xl">
              {/* Image Preview */}
              <div className="relative aspect-4/3 sm:aspect-3/4 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                <img
                  src={selectedFeature.image}
                  alt={selectedFeature.title}
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Floating Info Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                      {selectedFeature.badge}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {selectedFeature.title}
                    </h3>
                    <p className="text-xs text-neutral-300 font-mono">
                      {selectedFeature.price}
                    </p>
                  </div>

                  <button
                    onClick={() => navigateTo(selectedFeature.categoryTarget)}
                    className="bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-md"
                  >
                    <span>VIEW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Interactive Tabs to switch between the 3 top highlights on user click (No Auto Slide) */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {FEATURED_HIGHLIGHTS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedHighlightIndex(idx)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      selectedHighlightIndex === idx
                        ? 'bg-neutral-800 border-neutral-500 text-white'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <p className="text-[10px] font-mono font-bold uppercase truncate">
                      {item.title}
                    </p>
                    <p className="text-[9px] text-neutral-400 mt-0.5">
                      {item.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
