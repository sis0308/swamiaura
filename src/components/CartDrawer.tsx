import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartCount,
    subtotal,
    discountAmount,
    shippingFee,
    grandTotal,
    cartDrawerOpen,
    setCartDrawerOpen,
    navigateTo
  } = useCart();

  if (!cartDrawerOpen) return null;

  const freeShippingThreshold = 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    setCartDrawerOpen(false);
    navigateTo('/checkout');
  };

  const handleViewFullCart = () => {
    setCartDrawerOpen(false);
    navigateTo('/cart');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCartDrawerOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between text-left"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neutral-900" />
                <h3 className="font-display font-extrabold text-lg text-neutral-950">
                  Shopping Bag
                </h3>
                <span className="bg-neutral-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="p-4 bg-neutral-900 text-white border-b border-neutral-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Truck className="w-4 h-4" />
                  <span>
                    {amountNeededForFreeShipping === 0
                      ? 'You have unlocked FREE Express Delivery!'
                      : `Add ₹${amountNeededForFreeShipping} more for FREE Delivery`}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {Math.round(freeShippingProgress)}%
                </span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-neutral-100">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-neutral-900">Your bag is empty</p>
                    <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                      Discover our 240 GSM oversized tees, polos, and classic round neck staples.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCartDrawerOpen(false);
                      navigateTo('/shop');
                    }}
                    className="bg-neutral-950 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-3 sm:gap-4">
                    {/* Item Image */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-xl bg-neutral-100 shrink-0 border border-neutral-200"
                    />

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected Variants */}
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500 font-medium">
                          <span className="bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded font-bold">
                            Size: {item.selectedSize}
                          </span>
                          <span>·</span>
                          <span className="truncate max-w-[100px]">
                            Color: {item.selectedColor}
                          </span>
                        </div>
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex items-center justify-between mt-2 pt-2">
                        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="px-2.5 py-1 text-xs font-bold text-neutral-700 hover:bg-neutral-200"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="px-2.5 py-1 text-xs font-bold text-neutral-700 hover:bg-neutral-200"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-extrabold text-neutral-950 font-display">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-neutral-400">
                              (₹{item.product.price} each)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-6 bg-neutral-50 border-t border-neutral-200 space-y-4">
                {/* Cost Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount (Promo AURA30)</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-neutral-900">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold uppercase text-[10px]">
                          FREE
                        </span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-2 border-t border-neutral-200 font-display">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-neutral-950 hover:bg-black text-white py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
                    id="drawer-proceed-checkout-btn"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleViewFullCart}
                    className="w-full text-center text-xs font-bold text-neutral-700 hover:text-black py-2"
                  >
                    View & Edit Full Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
