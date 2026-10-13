import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  ArrowRight,
  ShieldCheck,
  Truck,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Video,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo,
    setSizeGuideOpen
  } = useCart();

  const product = quickViewProduct;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isVideoActive, setIsVideoActive] = useState(false);

  const handleRollLeft = () => {
    if (!product) return;
    setIsVideoActive(false);
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleRollRight = () => {
    if (!product) return;
    setIsVideoActive(false);
    setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'M');
      const hasColors = Boolean(product.colors && product.colors.length > 0);
      const defaultColor = hasColors ? product.colors[0] : null;
      setSelectedColor(defaultColor?.name || '');
      setQuantity(1);

      if (defaultColor?.image && product.images.includes(defaultColor.image)) {
        setSelectedImageIndex(product.images.indexOf(defaultColor.image));
      } else if (defaultColor?.imageIndex !== undefined && product.images[defaultColor.imageIndex]) {
        setSelectedImageIndex(defaultColor.imageIndex);
      } else {
        setSelectedImageIndex(0);
      }
    }
  }, [product]);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);

  const handleColorSelect = (colorName: string, colorIdx: number) => {
    setSelectedColor(colorName);
    if (!product.colors || product.colors.length === 0) return;
    const colorObj = product.colors.find((c) => c.name === colorName);
    if (!colorObj) return;

    if (colorObj.image) {
      const foundIdx = product.images.indexOf(colorObj.image);
      if (foundIdx !== -1) {
        setSelectedImageIndex(foundIdx);
        return;
      }
    }

    if (colorObj.imageIndex !== undefined && product.images[colorObj.imageIndex]) {
      setSelectedImageIndex(colorObj.imageIndex);
      return;
    }

    if (colorIdx < product.images.length) {
      setSelectedImageIndex(colorIdx);
    }
  };

  const handleThumbnailClick = (imgIdx: number) => {
    setSelectedImageIndex(imgIdx);
    if (!product.colors || product.colors.length === 0) return;
    const targetUrl = product.images[imgIdx];
    const matchingColor = product.colors.find((c, cIdx) => 
      (c.image && c.image === targetUrl) ||
      (c.imageIndex !== undefined ? c.imageIndex === imgIdx : cIdx === imgIdx)
    );
    if (matchingColor) {
      setSelectedColor(matchingColor.name);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
  };

  const handleViewFullProduct = () => {
    setQuickViewProduct(null);
    navigateTo(`/product/${product.id}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden z-10 my-auto text-left border border-neutral-200"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Gallery */}
            <div className="p-6 sm:p-8 bg-neutral-50 flex flex-col justify-between space-y-4">
              <div className="relative aspect-4/5 w-full bg-white rounded-2xl overflow-hidden shadow-xs border border-neutral-200 select-none">
                {isVideoActive && product.video ? (
                  <video
                    src={product.video}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <>
                    <img
                      src={product.images[selectedImageIndex] || product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                        {product.discount}% OFF
                      </span>
                    )}

                    {/* Photo Counter */}
                    <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                      {selectedImageIndex + 1}/{product.images.length}
                    </span>

                    {/* Roll Left Arrow (<) */}
                    {product.images.length > 1 && (
                      <button
                        type="button"
                        onClick={handleRollLeft}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-black text-black hover:text-white shadow-md flex items-center justify-center border border-neutral-200 transition-all z-10"
                        title="Roll Left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}

                    {/* Roll Right Arrow (>) */}
                    {product.images.length > 1 && (
                      <button
                        type="button"
                        onClick={handleRollRight}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-black text-black hover:text-white shadow-md flex items-center justify-center border border-neutral-200 transition-all z-10"
                        title="Roll Right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnails + Video Button */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsVideoActive(false);
                      handleThumbnailClick(idx);
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      !isVideoActive && selectedImageIndex === idx
                        ? 'border-neutral-900 ring-2 ring-neutral-900/20'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}

                {product.video && (
                  <button
                    type="button"
                    onClick={() => setIsVideoActive(!isVideoActive)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all flex flex-col items-center justify-center ${
                      isVideoActive
                        ? 'border-rose-600 bg-rose-50 ring-2 ring-rose-600/20 text-rose-600'
                        : 'border-rose-200 bg-rose-50/70 text-rose-500 hover:border-rose-400'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span className="text-[8px] font-mono font-bold uppercase mt-0.5">Video</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Info & Selectors */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Title */}
                <div>
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 font-display mt-0.5 leading-snug">
                    {product.name}
                  </h2>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-neutral-800">
                    {product.rating} / 5.0
                  </span>
                  <span className="text-xs text-neutral-400">
                    ({product.reviewsCount} verified reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 pb-3 border-b border-neutral-100">
                  <span className="text-2xl font-black text-neutral-950 font-display">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-neutral-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Color Selection (Only if product has colors configured) */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                        <span>Color:</span>
                        <span className="text-neutral-900 font-extrabold bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                          {selectedColor}
                        </span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono font-medium">
                        ✓ Changes Photo
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.colors.map((c, cIdx) => (
                        <button
                          key={c.name}
                          onClick={() => handleColorSelect(c.name, cIdx)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedColor === c.name
                              ? 'ring-2 ring-neutral-950 ring-offset-2 scale-110 border-white shadow-xs'
                              : 'border-neutral-300 hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={`Select ${c.name}`}
                        >
                          {selectedColor === c.name && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                c.name.includes('White') || c.hex.toLowerCase() === '#ffffff' || c.hex.toLowerCase() === '#f3f4f6'
                                  ? 'text-black'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800">
                      Select Size: <span className="text-neutral-600 font-normal">{selectedSize}</span>
                    </span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-neutral-900 underline font-semibold hover:text-black"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-10 h-10 px-3 rounded-xl text-xs font-bold transition-all ${
                          selectedSize === sz
                            ? 'bg-neutral-950 text-white shadow-md'
                            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-800">Quantity:</span>
                  <div className="flex items-center border border-neutral-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-neutral-950 hover:bg-black text-white py-3.5 px-4 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART · ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3.5 rounded-xl border transition-colors ${
                      wishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleViewFullProduct}
                  className="w-full text-center text-xs font-bold text-neutral-900 hover:text-black py-2 flex items-center justify-center gap-1.5"
                >
                  <span>View Full Product Details & Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
