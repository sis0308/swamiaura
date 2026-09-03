import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
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
  MapPin,
  ChevronRight,
  Info,
  Sparkles,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

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
  const { products } = useStore();

  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping' | 'reviews'>('details');
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState<boolean | null>(null);

  // Zoom magnifier state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0]?.name || 'Standard');
    setQuantity(1);
    setPincodeChecked(null);
  }, [productId]);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigateTo('/checkout');
  };

  const handleWhatsAppInquiry = () => {
    const message = `Hi AURA THREADS! I would like to buy/inquire about the *${product.name}* in size *${selectedSize}*, color *${selectedColor}* (₹${product.price}). Product Link: ${window.location.href}`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode)) {
      setPincodeChecked(true);
      showToast('Delivery Available!', `Express shipping to ${pincode} in 2-3 days`, 'success');
    } else {
      setPincodeChecked(false);
      showToast('Invalid PIN Code', 'Please enter a valid 6-digit Indian PIN Code', 'error');
    }
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
            
            {/* Left: Gallery (Thumbnails + Main Image with Zoom) */}
            <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
              
              {/* Thumbnails list */}
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-neutral-950 ring-2 ring-neutral-950/20'
                        : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image with Zoom Magnifier */}
              <div
                className="relative flex-1 aspect-4/5 bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 cursor-crosshair select-none"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
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

                {/* Floating Tag */}
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
                </div>

                {/* Hover hint */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-md hidden md:block pointer-events-none">
                  Hover to zoom
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

                {/* Color Selector */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-900">
                      Select Color:{' '}
                      <span className="text-neutral-600 font-normal">{selectedColor}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                          selectedColor === c.name
                            ? 'ring-2 ring-neutral-950 ring-offset-2 scale-110'
                            : 'border-neutral-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor === c.name && (
                          <Check
                            className={`w-4 h-4 ${
                              c.name.includes('White') ? 'text-black' : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

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
                    <span>ORDER / INQUIRE ON WHATSAPP (+91 98765 43210)</span>
                  </button>
                </div>

                {/* Delivery PIN Code Checker */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <MapPin className="w-4 h-4 text-neutral-700" />
                    <span>Check Delivery Estimate</span>
                  </div>
                  <form onSubmit={handlePincodeCheck} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter 6-digit PIN code (e.g. 560038)"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="submit"
                      className="bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                    >
                      Check
                    </button>
                  </form>
                  {pincodeChecked === true && (
                    <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Free Delivery within 2-3 business days. Cash on Delivery Available.
                    </p>
                  )}
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

          {/* Product Tabs: Description, Fabric Specs, Shipping, Reviews */}
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
              {activeTab === 'details' && (
                <div className="space-y-4 max-w-3xl">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
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
                  </div>
                </div>
              )}

              {activeTab === 'fabric' && (
                <div className="space-y-4 max-w-3xl">
                  <p className="font-semibold text-neutral-900">
                    Fabric Grade: {product.fabric}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                    <li>240 GSM heavy combed single jersey / French Terry knit structure.</li>
                    <li>Bio-washed with natural organic enzymes to eliminate fuzz and pilling.</li>
                    <li>Silicone softened for extra handfeel smoothness.</li>
                    <li>Color-fast reactive dyeing resistant to bleeding or sun fading.</li>
                    <li>Pre-shrunk treatment ensuring minimal dimensional change after wash.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-3 max-w-3xl text-xs">
                  <p>• <strong>Standard Delivery</strong>: 2 to 4 business days across India.</p>
                  <p>• <strong>Free Shipping</strong> on all prepaid & COD orders over ₹999.</p>
                  <p>• <strong>7-Day Returns & Exchanges</strong>: Instant door-step exchange if you need a different size or fit.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
                    <div className="text-center">
                      <span className="text-3xl font-black text-neutral-950 font-display">{product.rating}</span>
                      <p className="text-[10px] text-neutral-400 uppercase font-bold">Out of 5.0</p>
                    </div>
                    <div className="h-10 w-px bg-neutral-200" />
                    <div>
                      <p className="text-xs font-bold text-neutral-900">98% of customers recommend this T-Shirt</p>
                      <p className="text-[11px] text-neutral-500">Based on {product.reviewsCount} verified purchase reviews</p>
                    </div>
                  </div>

                  {/* Sample Customer Reviews */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-neutral-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900">Vikram S.</span>
                        <span className="text-[10px] text-neutral-400">2 days ago · Verified Buyer</span>
                      </div>
                      <div className="flex text-amber-400"><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /></div>
                      <p className="text-xs text-neutral-600">The 240 GSM weight is incredible. The drop shoulder fits properly boxy without looking bulky. Will buy other colors!</p>
                    </div>
                    <div className="p-4 rounded-xl border border-neutral-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900">Aarav M.</span>
                        <span className="text-[10px] text-neutral-400">1 week ago · Verified Buyer</span>
                      </div>
                      <div className="flex text-amber-400"><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /></div>
                      <p className="text-xs text-neutral-600">Pure luxury. Better than foreign fast-fashion brands that charge ₹3,000 for standard cotton. Highly recommended.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

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

      </div>
    </div>
  );
};
