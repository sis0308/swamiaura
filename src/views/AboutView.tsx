import React from 'react';
import { useCart } from '../context/CartContext';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Leaf,
  HeartHandshake,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { navigateTo } = useCart();

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 text-left">
      {/* Hero Header */}
      <div className="bg-neutral-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            About AURA THREADS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
            Redefining Everyday Luxury In 240 GSM Cotton
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Founded on the conviction that a T-Shirt is not disposable fast fashion, but the foundational anchor of a discerning modern wardrobe.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              The Genesis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-950">
              Crafted For Those Who Feel The Difference
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              In 2024, our founders grew tired of lightweight, thin T-shirts that lost their collar structure after two wash cycles. We spent 14 months testing yarn counts, combings, and weaving tensions across traditional textile mills in Southern India.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              The result: A proprietary 240 GSM single jersey and French Terry knit that holds a clean architectural silhouette, feels buttery soft against bare skin, and stays true for years.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-neutral-200 aspect-4/3">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
              alt="Tailoring craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Pillars of Quality */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold font-display text-neutral-950">
              Our Core Standards
            </h3>
            <p className="text-xs text-neutral-500">
              Every garment carrying the AURA THREADS label undergoes rigorous inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-950">240 GSM Combed Cotton</h4>
              <p className="text-xs text-neutral-600">
                100% extra-long staple combed cotton for superior drape, density and zero transparency.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-950">Bio-Washed Enzymes</h4>
              <p className="text-xs text-neutral-600">
                Treated with natural biological enzymes to eliminate fiber surface fuzz and ensure lifelong anti-pilling.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-950">Reinforced Ribbing</h4>
              <p className="text-xs text-neutral-600">
                Double-needle stitched 1x1 lycra-infused neck ribs that never bacon or stretch out over time.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-950">Ethical Fair Wages</h4>
              <p className="text-xs text-neutral-600">
                Manufactured in certified green facilities with fair wages, safe conditions, and low-water dyes.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
            Experience The Feel of True Craftsmanship
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            Order your first AURA THREADS tee today. If you don't fall in love with the fabric feel, enjoy hassle-free 7-day returns.
          </p>
          <button
            onClick={() => navigateTo('/shop')}
            className="bg-white hover:bg-neutral-200 text-neutral-950 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
