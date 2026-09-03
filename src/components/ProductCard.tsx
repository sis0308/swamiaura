import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Heart, Star, Eye, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
    navigateTo
  } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCardClick = () => {
    navigateTo(`/product/${product.id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col bg-white border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden text-left cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
      id={`product-card-${product.id}`}
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-3/4 w-full bg-[#EFEFEF] overflow-hidden">
        {/* Main Product Image */}
        <img
          src={
            isHovered && product.images[1]
              ? product.images[1]
              : product.images[currentImageIndex] || product.images[0]
          }
          alt={product.name}
          className="w-full h-full object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 font-mono">
          {product.discount > 0 && (
            <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
              {product.discount}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-black text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="bg-[#D4AF37] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Action Buttons on Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlist}
            className={`p-1.5 backdrop-blur-sm transition-all ${
              wishlisted
                ? 'bg-black text-white'
                : 'bg-white/85 text-neutral-800 hover:bg-black hover:text-white'
            }`}
            aria-label="Add to wishlist"
            id={`wishlist-btn-${product.id}`}
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleQuickView}
            className="p-1.5 bg-white/85 backdrop-blur-sm text-neutral-800 hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center"
            aria-label="Quick View"
            id={`quickview-btn-${product.id}`}
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fabric GSM Tag on Bottom Left */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="bg-black/70 text-white text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5">
            {product.gsm} GSM · {product.fabric.split(' ')[0]}
          </span>
        </div>

        {/* Hover Quick Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={handleAddToCart}
            className="w-full bg-black hover:bg-neutral-800 text-white py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors"
          >
            Add To Cart
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Category & Title */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-neutral-950 truncate group-hover:text-neutral-600 transition-colors">
                {product.name}
              </h4>
              <p className="text-[11px] text-gray-400 italic mt-0.5">
                {product.category}
              </p>
            </div>

            {/* Price block */}
            <div className="text-right shrink-0">
              <p className="text-[13px] font-bold text-neutral-950 font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
              {product.originalPrice > product.price && (
                <p className="text-[10px] text-gray-400 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>

          {/* Color Variations Circles */}
          <div className="mt-2.5 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-1">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                  className={`w-3 h-3 rounded-full border transition-all ${
                    selectedColor === c.name
                      ? 'ring-1 ring-black ring-offset-1 scale-110 border-transparent'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={`Select ${c.name}`}
                />
              ))}
            </div>

            {/* Rating badge */}
            <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Size Selectors */}
          <div className="mt-2.5 flex items-center gap-1 flex-wrap" onClick={(e) => e.stopPropagation()}>
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`py-0.5 px-2 text-[10px] font-mono border transition-colors ${
                  selectedSize === s
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 text-neutral-700 hover:border-black'
                }`}
                aria-label={`Size ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Details link */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
          <button
            onClick={handleCardClick}
            className="text-neutral-500 hover:text-black flex items-center gap-1 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <span className="text-[9px] text-emerald-700 font-mono">In Stock</span>
        </div>
      </div>
    </motion.div>
  );
};
