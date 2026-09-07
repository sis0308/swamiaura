import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  Check,
  ShieldCheck,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'motion/react';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    shippingFee,
    grandTotal,
    navigateTo,
    showToast
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  const freeShippingThreshold = 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const success = applyCoupon(inputCoupon);
    if (success) {
      setInputCoupon('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAFAFA]">
        <div className="w-20 h-20 bg-white rounded-3xl border border-neutral-200 flex items-center justify-center text-neutral-400 mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-neutral-500 max-w-md text-center mt-2 mb-8">
          Looks like you haven't added any premium 240 GSM T-Shirts to your bag yet. Explore our curated collections.
        </p>
        <button
          onClick={() => navigateTo('/shop')}
          className="bg-neutral-950 hover:bg-black text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
        >
          Explore T-Shirts
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-neutral-200">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Review Bag
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display mt-0.5">
              Shopping Cart ({cart.length} Items)
            </h1>
          </div>
          <button
            onClick={() => navigateTo('/shop')}
            className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Continue Shopping</span>
          </button>
        </div>

        {/* Free Shipping Alert */}
        <div className="bg-neutral-950 text-white rounded-2xl p-4 sm:p-5 mb-8 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Truck className="w-4 h-4" />
              <span>
                {amountNeededForFreeShipping === 0
                  ? 'Congratulations! You have unlocked FREE Express Shipping!'
                  : `Add ₹${amountNeededForFreeShipping} more to unlock FREE Express Delivery!`}
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Cart Items Table/List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="divide-y divide-neutral-100">
              {cart.map((item) => (
                <div key={item.cartItemId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
                  {/* Thumbnail & Info */}
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-2xl bg-neutral-100 border border-neutral-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {item.product.category}
                      </span>
                      <h3
                        onClick={() => navigateTo(`/product/${item.product.id}`)}
                        className="text-sm font-bold text-neutral-950 hover:underline cursor-pointer"
                      >
                        {item.product.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                        <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-bold">
                          Size: {item.selectedSize}
                        </span>
                        <span>·</span>
                        <span>Color: {item.selectedColor}</span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-900 sm:hidden pt-1">
                        ₹{item.product.price} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0">
                    <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-neutral-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <p className="text-base font-extrabold text-neutral-950 font-display">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-neutral-400 hover:text-rose-600 p-2 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
              <h3 className="text-lg font-bold font-display text-neutral-950 pb-4 border-b border-neutral-100">
                Order Summary
              </h3>

              {/* Coupon Form */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Promo Code / Voucher</span>
                </label>
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-emerald-900 font-mono">
                        {couponCode} (-₹{discountAmount})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try 'TEEZOON30'"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 text-xs font-bold uppercase rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="submit"
                      className="bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-3 text-xs pt-2 border-t border-neutral-100">
                <div className="flex justify-between text-neutral-600">
                  <span>Bag Total</span>
                  <span className="font-bold text-neutral-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-neutral-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 uppercase font-bold text-[10px]">
                        FREE
                      </span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-3 border-t border-neutral-200 font-display">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => navigateTo('/checkout')}
                className="w-full bg-neutral-950 hover:bg-black text-white py-4 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
                id="cart-proceed-to-checkout"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200 grid grid-cols-2 gap-3 text-[11px] text-neutral-600 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-900" />
                <span>100% Genuine 240 GSM</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-neutral-900" />
                <span>7 Days Easy Return</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
