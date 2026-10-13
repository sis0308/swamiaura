import React, { useState, useEffect } from 'react';
import { Product, CustomerReview } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ProductRollViewerModal } from '../components/ProductRollViewerModal';
import {
  Star,
  ShoppingBag,
  Heart,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  ChevronRight,
  ChevronLeft,
  RotateCw,
  Video,
  Play,
  Layers,
  Info,
  Sparkles,
  Share2,
  CheckCircle2,
  User,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';

const DEFAULT_FABRIC_SPECS = [
  '240 GSM heavy combed single jersey / French Terry knit structure.',
  'Bio-washed with natural organic enzymes to eliminate fuzz and pilling.',
  'Silicone softened for extra handfeel smoothness.',
  'Color-fast reactive dyeing resistant to bleeding or sun fading.',
  'Pre-shrunk treatment ensuring minimal dimensional change after wash.'
];

const DEFAULT_SAMPLE_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Vikram S.',
    rating: 5,
    date: '2 days ago',
    comment: 'The 240 GSM weight is incredible. The drop shoulder fits properly boxy without looking bulky. Will buy other colors!',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Aarav M.',
    rating: 5,
    date: '1 week ago',
    comment: 'Pure luxury. Better than foreign fast-fashion brands that charge ₹3,000 for standard cotton. Highly recommended.',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Rohan K.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Collar retains its shape even after multiple machine washes. Best cotton t-shirt in this price bracket.',
    verified: true
  }
];

interface ProductDetailViewProps {
  productId: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigateTo,
    setSizeGuideOpen,
    showToast
  } = useCart();
  const { products, updateProduct } = useStore();

  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0]?.name : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping' | 'reviews'>('details');

  // Customer Review Submission State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Zoom magnifier state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Amazon/Flipkart Roll & Video State
  const [isRollModalOpen, setIsRollModalOpen] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const getAngleLabel = (idx: number) => {
    const angleNames = [
      'Front View',
      'Left Side Angle',
      'Back View',
      'Right Side Angle',
      'Fabric & Stitch Detail',
      'Model Fit View'
    ];
    return angleNames[idx % angleNames.length] || `Angle ${idx + 1}`;
  };

  const handleRollLeft = () => {
    setIsVideoActive(false);
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleRollRight = () => {
    setIsVideoActive(false);
    setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const hasColors = Boolean(product.colors && product.colors.length > 0);
    const defaultColor = hasColors ? product.colors[0] : null;
    const initialColorName = defaultColor?.name || '';
    setSelectedColor(initialColorName);
    setSelectedSize(product.sizes[0] || 'M');
    setQuantity(1);

    // Initial image index matching the default color
    if (defaultColor?.image && product.images.includes(defaultColor.image)) {
      setSelectedImageIndex(product.images.indexOf(defaultColor.image));
    } else if (defaultColor?.imageIndex !== undefined && product.images[defaultColor.imageIndex]) {
      setSelectedImageIndex(defaultColor.imageIndex);
    } else {
      setSelectedImageIndex(0);
    }
  }, [productId, product]);

  const wishlisted = isWishlisted(product.id);

  // Color-Wise Photo Switching Handler
  const handleColorSelect = (colorName: string, colorIdx: number) => {
    setSelectedColor(colorName);
    if (!product.colors || product.colors.length === 0) return;
    const colorObj = product.colors.find((c) => c.name === colorName);
    if (!colorObj) return;

    // 1. Direct color image URL
    if (colorObj.image) {
      const foundIdx = product.images.indexOf(colorObj.image);
      if (foundIdx !== -1) {
        setSelectedImageIndex(foundIdx);
        return;
      }
    }

    // 2. Explicit imageIndex assigned in product/admin
    if (colorObj.imageIndex !== undefined && product.images[colorObj.imageIndex]) {
      setSelectedImageIndex(colorObj.imageIndex);
      return;
    }

    // 3. Fallback: match color index to product images index if available
    if (colorIdx < product.images.length) {
      setSelectedImageIndex(colorIdx);
    }
  };

  // Thumbnail Click Handler (also syncs active color if linked)
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
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigateTo('/checkout');
  };

  const handleWhatsAppInquiry = () => {
    const colorText = selectedColor ? `, color *${selectedColor}*` : '';
    const message = `Hi TEEZOON! I would like to buy/inquire about the *${product.name}* in size *${selectedSize}*${colorText} (₹${product.price}). Product Link: ${window.location.href}`;
    window.open(`https://wa.me/917756061273?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim()) {
      showToast('Name Required', 'Please provide your name', 'error');
      return;
    }
    if (!newReviewComment.trim()) {
      showToast('Review Required', 'Please share your thoughts on the T-Shirt', 'error');
      return;
    }

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      verified: true
    };

    const currentReviews = product.customerReviews && product.customerReviews.length > 0
      ? product.customerReviews
      : DEFAULT_SAMPLE_REVIEWS;

    const updatedReviews = [newRev, ...currentReviews];
    const newCount = (product.reviewsCount || currentReviews.length) + 1;
    const avgRating = Number(
      (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
    );

    updateProduct({
      ...product,
      customerReviews: updatedReviews,
      reviewsCount: newCount,
      rating: avgRating
    });

    setNewReviewAuthor('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setIsReviewModalOpen(false);
    showToast('Review Submitted', 'Thank you! Your verified review is now live.', 'success');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const relatedProducts = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 text-left">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <button onClick={() => navigateTo('/')} className="hover:text-black">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigateTo('/shop')} className="hover:text-black">
            T-Shirts
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            onClick={() => navigateTo(`/category/${product.categorySlug}`)}
            className="hover:text-black"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-bold truncate max-w-xs">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main Product Presentation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left: Gallery (Thumbnails + Main Image with Roll Arrows & Video) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="flex flex-col-reverse md:flex-row gap-4">
                {/* Thumbnails list (Amazon/Flipkart Style with Angle Labels & Video) */}
                <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0 max-h-[500px]">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsVideoActive(false);
                        handleThumbnailClick(idx);
                      }}
                      className={`group relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        !isVideoActive && selectedImageIndex === idx
                          ? 'border-neutral-950 ring-2 ring-neutral-950/20'
                          : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                      }`}
                      title={getAngleLabel(idx)}
                    >
                      <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[8px] font-mono py-0.5 truncate text-center">
                        {idx === 0 ? 'Front' : idx === 1 ? 'Side' : idx === 2 ? 'Back' : 'Detail'}
                      </span>
                    </button>
                  ))}

                  {/* Product Video Thumbnail (if product has video) */}
                  {product.video && (
                    <button
                      type="button"
                      onClick={() => setIsVideoActive(true)}
                      className={`group relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 flex flex-col items-center justify-center ${
                        isVideoActive
                          ? 'border-rose-600 bg-rose-50 ring-2 ring-rose-600/20'
                          : 'border-rose-200 bg-rose-50/60 hover:border-rose-500'
                      }`}
                      title="Watch Product Video"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                      <span className="mt-1 text-[9px] font-mono font-bold text-rose-700 uppercase tracking-tight">
                        Video
                      </span>
                    </button>
                  )}
                </div>

                {/* Main Media Stage (Image with Zoom & Roll Arrows or Full Video) */}
                <div
                  className="relative flex-1 aspect-4/5 bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 select-none"
                  onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchStartX !== null) {
                      const diff = e.changedTouches[0].clientX - touchStartX;
                      if (diff > 40) handleRollLeft();
                      else if (diff < -40) handleRollRight();
                      setTouchStartX(null);
                    }
                  }}
                >
                  {isVideoActive && product.video ? (
                    /* Video Player View */
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      {isYouTubeUrl(product.video) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(product.video)}
                          title="Product Video"
                          className="w-full h-full"
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
                          className="w-full h-full object-contain bg-black"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setIsVideoActive(false)}
                        className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/20 z-20"
                      >
                        <span>Switch to Photos</span>
                      </button>
                    </div>
                  ) : (
                    /* High-Res Photo with Zoom & Amazon/Flipkart Roll Arrows */
                    <div
                      className="relative w-full h-full cursor-pointer"
                      onClick={() => setIsRollModalOpen(true)}
                      onMouseEnter={() => setIsZooming(true)}
                      onMouseLeave={() => setIsZooming(false)}
                      onMouseMove={handleMouseMove}
                      title="Click photo to open Amazon & Flipkart 360° All-Sides Roll Viewer"
                    >
                      <img
                        src={product.images[selectedImageIndex] || product.images[0]}
                        alt={product.name}
                        className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                          isZooming ? 'scale-150' : 'scale-100'
                        }`}
                        style={
                          isZooming
                            ? {
                                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                              }
                            : undefined
                        }
                      />

                      {/* Floating Discount & New Tags */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                        {product.discount > 0 && (
                          <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                            {product.discount}% OFF
                          </span>
                        )}
                        {product.isNew && (
                          <span className="bg-neutral-950 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                            NEW DROP
                          </span>
                        )}
                        <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-md">
                          {getAngleLabel(selectedImageIndex)}
                        </span>
                      </div>

                      {/* Photo Index Counter & Video Quick Pill */}
                      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        {product.video && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsVideoActive(true);
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 transition-all"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Watch Video</span>
                          </button>
                        )}
                        <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-1 rounded-md">
                          {selectedImageIndex + 1}/{product.images.length}
                        </span>
                      </div>

                      {/* ROLL LEFT ARROW BUTTON (<) */}
                      {product.images.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRollLeft();
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-neutral-950 text-neutral-900 hover:text-white shadow-xl flex items-center justify-center border border-neutral-300 transition-all z-20 hover:scale-110 active:scale-95"
                          title="Roll to Previous Angle (Left)"
                          aria-label="Roll Left"
                        >
                          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      )}

                      {/* ROLL RIGHT ARROW BUTTON (>) */}
                      {product.images.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRollRight();
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-neutral-950 text-neutral-900 hover:text-white shadow-xl flex items-center justify-center border border-neutral-300 transition-all z-20 hover:scale-110 active:scale-95"
                          title="Roll to Next Angle (Right)"
                          aria-label="Roll Right"
                        >
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      )}

                      {/* Hover Zoom Hint */}
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md hidden md:block pointer-events-none">
                        Hover to zoom · Click arrows to roll
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amazon & Flipkart All-Sides Interactive Action Bar */}
              <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200/90 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRollModalOpen(true)}
                  className="bg-neutral-950 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs hover:scale-102"
                  id="btn-360-all-sides-roll"
                >
                  <RotateCw className="w-4 h-4 text-amber-400" />
                  <span>360° All-Sides Roll Viewer</span>
                  <span className="text-[10px] font-mono bg-amber-400 text-black px-1.5 py-0.2 rounded font-extrabold">
                    One-Click
                  </span>
                </button>

                <div className="flex items-center gap-1.5">
                  {product.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handleRollLeft}
                        className="px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-800 rounded-lg border border-neutral-300 text-xs font-bold transition-colors flex items-center gap-1"
                        title="Roll Photo Left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Roll Left</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRollRight}
                        className="px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-800 rounded-lg border border-neutral-300 text-xs font-bold transition-colors flex items-center gap-1"
                        title="Roll Photo Right"
                      >
                        <span>Roll Right</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {product.video && (
                    <button
                      type="button"
                      onClick={() => setIsVideoActive(!isVideoActive)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-300 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5 text-rose-600" />
                      <span>{isVideoActive ? 'Photos' : 'Play Video'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Product Buying Details */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Category & Title */}
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                    {product.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display leading-tight">
                    {product.name}
                  </h1>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                    <span className="text-xs font-bold text-amber-900">{product.rating}</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-medium">
                    {product.reviewsCount} Customer Reviews
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} left)
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black font-display text-neutral-950">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-base text-neutral-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Color Selector - Only shown if product has colors configured */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                        <span>Select Color:</span>
                        <span className="text-neutral-950 font-extrabold bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded shadow-2xs">
                          {selectedColor}
                        </span>
                      </span>
                      <span className="text-[11px] text-emerald-700 font-mono font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Color Photo Active</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {product.colors.map((c, cIdx) => (
                        <button
                          key={c.name}
                          onClick={() => handleColorSelect(c.name, cIdx)}
                          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedColor === c.name
                              ? 'ring-2 ring-neutral-950 ring-offset-2 scale-110 border-white shadow-md'
                              : 'border-neutral-300 hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={`Select ${c.name} - Changes photo view`}
                        >
                          {selectedColor === c.name && (
                            <Check
                              className={`w-4 h-4 ${
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

                {/* Size Selector */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-900">
                      Select Size:{' '}
                      <span className="text-neutral-600 font-normal">{selectedSize}</span>
                    </span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-neutral-950 font-bold underline flex items-center gap-1 hover:text-neutral-700"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-12 h-11 px-3 rounded-xl text-xs font-bold transition-all ${
                          selectedSize === s
                            ? 'bg-neutral-950 text-white shadow-md'
                            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-neutral-900">Quantity:</span>
                  <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-200"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-bold text-neutral-950">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-neutral-900 hover:bg-black text-white py-4 px-6 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                      id="pdp-add-to-cart-btn"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO CART</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md active:scale-98"
                      id="pdp-buy-now-btn"
                    >
                      BUY NOW
                    </button>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-4 rounded-xl border transition-colors ${
                        wishlisted
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Direct WhatsApp Ordering Button */}
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 py-3.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    id="pdp-whatsapp-order-btn"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>ORDER / INQUIRE ON WHATSAPP (+91 77560 61273)</span>
                  </button>
                </div>

                {/* Value Props */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-neutral-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-neutral-900" />
                    <span>Free Shipping ₹999+</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-neutral-900" />
                    <span>7-Day Return</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-neutral-900" />
                    <span>100% Cotton</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Product Tabs: Product Details, Fabric Specs, Delivery & Returns, Customer Reviews */}
          <div className="mt-14 pt-8 border-t border-neutral-200">
            <div className="flex items-center gap-3 border-b border-neutral-200 overflow-x-auto no-scrollbar pb-px">
              {[
                { key: 'details', label: 'Product Details' },
                { key: 'fabric', label: 'Fabric & Specifications' },
                { key: 'shipping', label: 'Delivery & Returns' },
                { key: 'reviews', label: `Customer Reviews (${product.reviewsCount})` }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`pb-3 px-3 text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.key
                      ? 'border-neutral-950 text-neutral-950'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-6 text-sm text-neutral-600 leading-relaxed">
              {/* TAB 1: PRODUCT DETAILS */}
              {activeTab === 'details' && (
                <div className="space-y-4 max-w-3xl">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">Sleeve</span>
                      <p className="text-xs font-bold text-neutral-900 mt-0.5">{product.sleeve}</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">Neck Style</span>
                      <p className="text-xs font-bold text-neutral-900 mt-0.5">{product.neckType}</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">Fit Profile</span>
                      <p className="text-xs font-bold text-neutral-900 mt-0.5">{product.fit}</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">Fabric Weight</span>
                      <p className="text-xs font-bold text-neutral-900 mt-0.5">{product.gsm} GSM</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FABRIC & SPECIFICATIONS */}
              {activeTab === 'fabric' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block mb-0.5">
                      Fabric Grade & Composition
                    </span>
                    <p className="font-bold text-neutral-900 text-sm">
                      {product.fabric}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-neutral-900 block">
                      Fabric Structure & Performance Highlights:
                    </span>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                      {(product.fabricSpecs && product.fabricSpecs.length > 0
                        ? product.fabricSpecs
                        : DEFAULT_FABRIC_SPECS
                      ).map((spec, sIdx) => (
                        <li key={sIdx}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: DELIVERY & RETURNS */}
              {activeTab === 'shipping' && (
                <div className="space-y-3 max-w-3xl text-xs">
                  <p>
                    • <strong>Standard Delivery:</strong>{' '}
                    {product.deliveryDetails?.standardDelivery || '2 to 4 business days across India.'}
                  </p>
                  <p>
                    • <strong>Shipping Policy:</strong>{' '}
                    {product.deliveryDetails?.shippingPolicy || 'Free Shipping on all prepaid & COD orders over ₹999.'}
                  </p>
                  <p>
                    • <strong>Returns & Exchanges:</strong>{' '}
                    {product.deliveryDetails?.returnPolicy ||
                      '7-Day Returns & Exchanges: Instant door-step exchange if you need a different size or fit.'}
                  </p>
                  {product.deliveryDetails?.codAvailable !== false && (
                    <p>
                      • <strong>Cash on Delivery (COD):</strong> Available across 25,000+ Indian postal codes with open-box verification option.
                    </p>
                  )}
                </div>
              )}

              {/* TAB 4: CUSTOMER REVIEWS (240) */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-3xl font-black text-neutral-950 font-display">{product.rating}</span>
                        <p className="text-[10px] text-neutral-400 uppercase font-bold">Out of 5.0</p>
                      </div>
                      <div className="h-10 w-px bg-neutral-200" />
                      <div>
                        <div className="flex items-center gap-1 text-amber-400 mb-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-current'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-neutral-900">98% of customers recommend this T-Shirt</p>
                        <p className="text-[11px] text-neutral-500">Based on {product.reviewsCount} verified reviews</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-950 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Write a Review</span>
                    </button>
                  </div>

                  {/* Customer Reviews List */}
                  <div className="space-y-3">
                    {(product.customerReviews && product.customerReviews.length > 0
                      ? product.customerReviews
                      : DEFAULT_SAMPLE_REVIEWS
                    ).map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 text-[10px] font-bold">
                              {rev.author.charAt(0)}
                            </span>
                            <span className="text-xs font-bold text-neutral-900">{rev.author}</span>
                            {rev.verified && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, sIdx) => (
                            <Star
                              key={sIdx}
                              className={`w-3.5 h-3.5 ${sIdx < rev.rating ? 'fill-current' : 'text-neutral-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Write a Customer Review Modal */}
          {isReviewModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-950">Write a Review</h3>
                    <p className="text-xs text-neutral-500">{product.name}</p>
                  </div>
                  <button
                    onClick={() => setIsReviewModalOpen(false)}
                    className="p-1 text-neutral-400 hover:text-black"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddReview} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Your Rating *</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newReviewRating ? 'fill-current' : 'text-neutral-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="font-bold text-neutral-800 ml-2">{newReviewRating} / 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Your Review & Fit Feedback *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your experience with the 240 GSM fabric weight, sizing drape, color fastness..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(false)}
                      className="px-4 py-2 text-neutral-600 hover:text-black font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-neutral-950 hover:bg-black text-white px-5 py-2 rounded-lg font-bold"
                    >
                      Post Verified Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-extrabold font-display text-neutral-950 mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Amazon & Flipkart 360° All-Sides Roll Viewer Modal */}
        <ProductRollViewerModal
          product={product}
          isOpen={isRollModalOpen}
          onClose={() => setIsRollModalOpen(false)}
          initialIndex={selectedImageIndex}
        />
      </div>
    </div>
  );
};
