import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Sparkles, Copy, Check, Clock, ArrowRight, Tag, Flame } from 'lucide-react';
import { motion } from 'motion/react';

export const OffersSection: React.FC = () => {
  const { navigateTo, showToast, applyCoupon } = useCart();
  const [copied, setCopied] = useState(false);

  // Countdown timer state for urgency
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    applyCoupon(code);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="py-16 sm:py-24 bg-neutral-950 text-white relative overflow-hidden" id="offers-section">
      {/* Background Lighting Effects */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-850 rounded-3xl border border-neutral-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 text-rose-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Limited Season Wardrobe Upgrade</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white leading-tight">
                  FLAT 30% OFF
                </h2>
                <p className="text-xl sm:text-2xl font-semibold text-neutral-300">
                  Upgrade Your Wardrobe With 240 GSM Combed Cotton
                </p>
                <p className="text-sm text-neutral-400 max-w-lg leading-relaxed">
                  Experience true heavyweight streetwear drape and breathable piqué knits. Automatically unlocked with code or free shipping on cart values over ₹999.
                </p>
              </div>

              {/* Coupon Code Block */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-700 px-4 py-3 rounded-xl">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-base font-extrabold text-white tracking-widest">
                    SWAMI30
                  </span>
                  <button
                    onClick={() => handleCopyCode('SWAMI30')}
                    className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ml-2"
                    title="Copy & Auto-Apply Code"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Applied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => navigateTo('/offers')}
                  className="bg-white hover:bg-neutral-200 text-neutral-950 font-extrabold px-8 py-3.5 rounded-xl text-sm tracking-wide transition-all shadow-lg hover:scale-102 flex items-center gap-2"
                  id="offers-shop-btn"
                >
                  <span>SHOP OFFER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Countdown & Bundle Card */}
            <div className="lg:col-span-5 bg-neutral-950/70 backdrop-blur-md rounded-2xl border border-neutral-800 p-6 sm:p-8 text-center space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                  <Clock className="w-4 h-4" />
                  <span>Offer Ends In</span>
                </div>
                <p className="text-xs text-neutral-400">Prices return to original shortly</p>
              </div>

              {/* Countdown Numbers */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                  <span className="block font-display font-black text-3xl sm:text-4xl text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Hours
                  </span>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                  <span className="block font-display font-black text-3xl sm:text-4xl text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Mins
                  </span>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                  <span className="block font-display font-black text-3xl sm:text-4xl text-amber-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Secs
                  </span>
                </div>
              </div>

              {/* Bundle Perk */}
              <div className="bg-neutral-900/80 rounded-xl p-4 border border-neutral-800 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Bundle & Save More</span>
                  <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                    BUY 2 GET 10% EXTRA
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Add any 3 T-Shirts to bag to unlock additional stackable savings automatically at checkout.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
