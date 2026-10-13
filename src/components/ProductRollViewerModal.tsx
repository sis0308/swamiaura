import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCw,
  Video,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductRollViewerModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const ProductRollViewerModal: React.FC<ProductRollViewerModalProps> = ({
  product,
  isOpen,
  onClose,
  initialIndex = 0
}) => {
  const { addToCart, showToast } = useCart();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAutoRolling, setIsAutoRolling] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');

  // Angle labels like Amazon and Flipkart
  const getAngleLabel = (idx: number, total: number) => {
    const angleNames = [
      'Front View',
      'Left Side Angle',
      'Back Architecture',
      'Right Side Angle',
      'Fabric & Collar Detail',
      'Model Fit View'
    ];
    return angleNames[idx % angleNames.length] || `Angle ${idx + 1}`;
  };

  const images = product.images && product.images.length > 0 ? product.images : [];
  const totalMedia = images.length;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setShowVideo(false);
    }
  }, [isOpen, initialIndex]);

  // Auto-roll 360 effect
  useEffect(() => {
    if (!isAutoRolling || totalMedia <= 1 || showVideo) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalMedia);
    }, 1800);
    return () => clearInterval(interval);
  }, [isAutoRolling, totalMedia, showVideo]);

  if (!isOpen) return null;

  const handlePrev = () => {
    if (showVideo) {
      setShowVideo(false);
      return;
    }
    setCurrentIndex((prev) => (prev === 0 ? totalMedia - 1 : prev - 1));
  };

  const handleNext = () => {
    if (showVideo) {
      setShowVideo(false);
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % totalMedia);
  };

  const isYouTubeUrl = (url?: string) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}` : url;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 text-left">
      <div className="relative w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[96vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-800 bg-neutral-900/80 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center">
              <RotateCw className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  360° All-Sides Roll Viewer
                </span>
                <span className="text-[11px] text-neutral-400 hidden sm:inline">
                  Amazon & Flipkart Multi-Angle View
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                {product.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {product.video && (
              <button
                type="button"
                onClick={() => {
                  setShowVideo(!showVideo);
                  setIsAutoRolling(false);
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                  showVideo
                    ? 'bg-rose-600 text-white'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>{showVideo ? 'Viewing Video' : 'Play Video'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Stage: Interactive Media Display */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[340px] sm:min-h-[460px]">
          
          {/* Main Media: Image or Video */}
          {showVideo && product.video ? (
            <div className="w-full h-full max-h-[70vh] flex items-center justify-center p-2 sm:p-4">
              {isYouTubeUrl(product.video) ? (
                <iframe
                  src={getYouTubeEmbedUrl(product.video)}
                  title="Product Video"
                  className="w-full max-w-3xl aspect-video rounded-xl shadow-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={product.video}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-h-[65vh] w-auto max-w-full rounded-xl shadow-2xl bg-black"
                />
              )}
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={images[currentIndex] || images[0]}
                alt={`${product.name} - ${getAngleLabel(currentIndex, totalMedia)}`}
                className="max-h-[62vh] sm:max-h-[68vh] w-auto max-w-full object-contain rounded-xl select-none transition-transform duration-300"
              />

              {/* Floating Angle Badge */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-neutral-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold">
                  {getAngleLabel(currentIndex, totalMedia)}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  ({currentIndex + 1}/{totalMedia})
                </span>
              </div>

              {/* Left Roll Button */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-neutral-800 text-white flex items-center justify-center border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95"
                title="Roll Left"
                aria-label="Roll Left"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {/* Right Roll Button */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/70 hover:bg-neutral-800 text-white flex items-center justify-center border border-white/20 transition-all shadow-xl hover:scale-110 active:scale-95"
                title="Roll Right"
                aria-label="Roll Right"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
          )}

          {/* Auto-Roll Play / Pause Overlay Toggle */}
          {!showVideo && totalMedia > 1 && (
            <button
              type="button"
              onClick={() => setIsAutoRolling(!isAutoRolling)}
              className={`absolute bottom-4 left-4 sm:left-6 text-xs font-bold px-3 py-2 rounded-xl border transition-all flex items-center gap-2 shadow-lg backdrop-blur-md ${
                isAutoRolling
                  ? 'bg-amber-400 text-black border-amber-300'
                  : 'bg-black/80 text-white border-neutral-700 hover:bg-neutral-900'
              }`}
            >
              {isAutoRolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoRolling ? 'Pause 360° Roll' : 'Auto 360° Spin'}</span>
            </button>
          )}
        </div>

        {/* Bottom Interactive Controls & Angle Strip */}
        <div className="bg-neutral-900 border-t border-neutral-800 p-3 sm:p-4 shrink-0 space-y-3">
          
          {/* Angle Strip Thumbnails (Amazon/Flipkart style) */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold shrink-0 hidden sm:inline">
              ROLL SIDES:
            </span>

            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowVideo(false);
                }}
                className={`relative flex items-center gap-2 px-2 py-1 rounded-xl border transition-all shrink-0 ${
                  !showVideo && currentIndex === idx
                    ? 'bg-neutral-800 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-600'
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
                <div className="text-left pr-2">
                  <p className="text-[11px] font-bold text-white leading-tight">
                    {getAngleLabel(idx, totalMedia)}
                  </p>
                  <p className="text-[9px] font-mono text-neutral-400">
                    Side #{idx + 1}
                  </p>
                </div>
              </button>
            ))}

            {/* Video Option Thumbnail if available */}
            {product.video && (
              <button
                type="button"
                onClick={() => {
                  setShowVideo(true);
                  setIsAutoRolling(false);
                }}
                className={`relative flex items-center gap-2 px-2.5 py-1 rounded-xl border transition-all shrink-0 ${
                  showVideo
                    ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/30'
                    : 'bg-neutral-950/80 border-neutral-800 hover:border-rose-400'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-rose-600/30 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5 text-rose-400" />
                </div>
                <div className="text-left pr-2">
                  <p className="text-[11px] font-bold text-rose-300 leading-tight">
                    Product Video
                  </p>
                  <p className="text-[9px] font-mono text-rose-400">
                    Model & Texture
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* Quick Buying Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs line-through text-neutral-500 ml-2 font-mono">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Size Pill Select */}
              <div className="flex items-center gap-1">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      selectedSize === s
                        ? 'bg-white text-black'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const defaultCol = product.colors && product.colors.length > 0 ? product.colors[0]?.name : '';
                  addToCart(product, selectedSize, defaultCol, 1);
                  showToast('Added to Bag', `${product.name} (${selectedSize}) added!`, 'success');
                }}
                className="bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add To Bag</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const msg = `Hi TEEZOON, I am viewing the 360° All-Sides Roll for ${product.name} (Size: ${selectedSize}, Price: ₹${product.price}) and would like to order!`;
                  window.open(`https://wa.me/917756061273?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Order on WhatsApp</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
