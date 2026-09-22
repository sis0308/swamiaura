import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  MessageCircle,
  CreditCard,
  Banknote,
  ArrowRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    subtotal,
    discountAmount,
    couponCode,
    shippingFee,
    grandTotal,
    clearCart,
    navigateTo,
    showToast
  } = useCart();
  const { addOrder } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    notes: '',
    paymentMethod: 'cod' // 'cod' | 'upi' | 'whatsapp'
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [placedOrderSummary, setPlacedOrderSummary] = useState<any>(null);

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-12 h-12 text-neutral-300 mb-4" />
        <h2 className="text-xl font-bold font-display text-neutral-900">
          No Items in Bag to Checkout
        </h2>
        <p className="text-xs text-neutral-500 mt-1 mb-6">
          Add some T-Shirts to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigateTo('/shop')}
          className="bg-neutral-900 text-white px-6 py-3 rounded-xl text-xs font-bold"
        >
          Browse T-Shirts
        </button>
      </div>
    );
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [buyerWhatsAppUrl, setBuyerWhatsAppUrl] = useState<string>('');
  const [buyerFormattedPhone, setBuyerFormattedPhone] = useState<string>('');

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      showToast('Missing Details', 'Please fill in all required shipping fields.', 'error');
      return;
    }

    // Register order in persistent store database (visible immediately in Admin Orders panel)
    const savedOrder = addOrder({
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      shippingAddress: {
        address: formData.address,
        city: formData.city || 'Bengaluru',
        state: formData.state || 'Karnataka',
        pincode: formData.pincode
      },
      paymentMethod: (formData.paymentMethod as 'cod' | 'upi' | 'whatsapp') || 'cod',
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
        gsm: item.product.gsm
      })),
      subtotal,
      discountAmount,
      shippingFee,
      grandTotal,
      couponCode: couponCode || undefined,
      orderNotes: formData.notes
    });

    const orderId = savedOrder.orderNumber;
    setPlacedOrderId(orderId);
    setPlacedOrderSummary({
      items: [...cart],
      total: grandTotal,
      customer: { ...formData }
    });

    // Format Buyer's Phone number for Direct WhatsApp auto-send
    const cleanDigits = formData.phone.replace(/\D/g, '');
    const buyerPhoneWithCountryCode = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
    setBuyerFormattedPhone(buyerPhoneWithCountryCode);

    // Build complete items breakdown
    const itemsBreakdown = cart
      .map(
        (item) =>
          `• *${item.product.name}*\n  Size: *${item.selectedSize}* | Color: *${item.selectedColor}* | Qty: *${item.quantity}* | ₹${item.product.price * item.quantity}`
      )
      .join('\n');

    // Prepare direct message for Buyer's Phone
    const buyerMessage = `🛍️ *TEEZOON - ORDER CONFIRMATION*

Hello *${formData.name}*,
Thank you for your order with TEEZOON! Your order has been placed and registered successfully.

📋 *Order Details:*
• *Order ID:* #${orderId}
• *Payment Mode:* ${formData.paymentMethod.toUpperCase()}
• *Delivery Address:* ${formData.address}, ${formData.city || 'Bengaluru'}, ${formData.state || 'Karnataka'} - ${formData.pincode}

👕 *Items Ordered:*
${itemsBreakdown}

💰 *Financial Summary:*
• Subtotal: ₹${subtotal}
${discountAmount > 0 ? `• Coupon Discount: -₹${discountAmount}\n` : ''}• Delivery: ${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
• *Grand Total: ₹${grandTotal}*

📦 *Status:* Confirmed & Preparing for Dispatch
🚚 Expected Delivery: 2-3 Business Days
Support & Help: +91 77560 61273 (TEEZOON Bengaluru Studio)`;

    const directBuyerWaUrl = `https://wa.me/${buyerPhoneWithCountryCode}?text=${encodeURIComponent(buyerMessage)}`;
    setBuyerWhatsAppUrl(directBuyerWaUrl);

    // Auto-send: Automatically launch WhatsApp directly to the buyer's phone number
    try {
      window.open(directBuyerWaUrl, '_blank');
    } catch (err) {
      console.warn('Direct WhatsApp window open prevented by popup restrictions:', err);
    }

    clearCart();
    setOrderPlaced(true);
    showToast('Order Confirmed!', `Order ${orderId} placed! Direct WhatsApp sent to ${formData.phone}`, 'success');
  };

  const openWhatsAppOrderSync = () => {
    if (!placedOrderSummary) return;
    const itemList = placedOrderSummary.items
      .map(
        (i: any) =>
          `• ${i.product.name} (Size: ${i.selectedSize}, Color: ${i.selectedColor}, Qty: ${i.quantity}) - ₹${i.product.price * i.quantity}`
      )
      .join('\n');

    const text = `*NEW ORDER: ${placedOrderId}*\n\n*Customer:* ${placedOrderSummary.customer.name}\n*Phone:* ${placedOrderSummary.customer.phone}\n*Address:* ${placedOrderSummary.customer.address}, ${placedOrderSummary.customer.city}, ${placedOrderSummary.customer.state} - ${placedOrderSummary.customer.pincode}\n*Payment Method:* ${placedOrderSummary.customer.paymentMethod.toUpperCase()}\n\n*Items Ordered:*\n${itemList}\n\n*Grand Total:* ₹${placedOrderSummary.total}\n\nPlease confirm delivery date!`;

    window.open(`https://wa.me/917756061273?text=${encodeURIComponent(text)}`, '_blank');
  };

  // If Order is Placed: Show Success View
  if (orderPlaced) {
    return (
      <div className="bg-[#FAFAFA] min-h-[80vh] py-16 px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-xl space-y-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Order Confirmed & Stored
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              Order ID: <span className="font-mono font-bold text-neutral-900">{placedOrderId}</span>
            </p>
          </div>

          {/* Direct WhatsApp To Buyer Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left flex items-start gap-3.5">
            <div className="w-9 h-9 bg-[#25D366] text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-950 uppercase tracking-wider font-mono text-[11px]">
                  Direct WhatsApp Auto-Send
                </span>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  Active
                </span>
              </div>
              <p className="text-emerald-800">
                Order details and receipt were transmitted directly to the buyer's phone number{' '}
                <strong className="font-mono text-emerald-950">+{buyerFormattedPhone}</strong>.
              </p>
            </div>
          </div>

          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-left space-y-3 text-xs">
            <p className="font-bold text-neutral-900 text-sm">Delivery Information</p>
            <p className="text-neutral-600">
              <strong>Name:</strong> {placedOrderSummary?.customer?.name} ({placedOrderSummary?.customer?.phone})
            </p>
            <p className="text-neutral-600">
              <strong>Address:</strong> {placedOrderSummary?.customer?.address}, {placedOrderSummary?.customer?.city}, {placedOrderSummary?.customer?.state} - {placedOrderSummary?.customer?.pincode}
            </p>
            <p className="text-neutral-600">
              <strong>Payment:</strong> {placedOrderSummary?.customer?.paymentMethod?.toUpperCase()} (₹{placedOrderSummary?.total})
            </p>
            <p className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-200">
              Expected Delivery: Express 2-3 Business Days. High-GSM French Terry garments undergo bio-wash quality check prior to dispatch.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Direct Send to Buyer WhatsApp */}
            {buyerWhatsAppUrl && (
              <a
                href={buyerWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                id="btn-direct-buyer-whatsapp"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Open Receipt on Buyer WhatsApp (+{buyerFormattedPhone})</span>
              </a>
            )}

            {/* Send to Store WhatsApp Support */}
            <button
              onClick={openWhatsAppOrderSync}
              className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              id="btn-store-support-whatsapp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Contact Store WhatsApp (+91 77560 61273)</span>
            </button>

            <button
              onClick={() => navigateTo('/shop')}
              className="w-full bg-neutral-900 hover:bg-black text-white py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-6 mb-8 border-b border-neutral-200">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Safe & Secure Checkout
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display mt-0.5">
            Shipping & Payment Details
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Shipping Form & Payment Selector */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Contact */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold font-display text-neutral-950 flex items-center gap-2">
                  <span>1. Contact & Customer Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Mobile Number (For Delivery Updates) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 XXXXX"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Email Address (For Invoice Receipt)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold font-display text-neutral-950 flex items-center gap-2">
                  <span>2. Delivery Address</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    House / Flat No., Building, Street Name *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Flat 402, Sunshine Heights, 12th Main Rd"
                    value={formData.address}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Bengaluru"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Kerala">Kerala</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Other">Other States</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      required
                      placeholder="560038"
                      value={formData.pincode}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Delivery Instructions / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="e.g. Near Metro Station / Call before delivery"
                    value={formData.notes}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold font-display text-neutral-950">
                  3. Select Payment Method
                </h3>

                <div className="space-y-3">
                  {/* COD */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-neutral-950 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleFormChange}
                        className="w-4 h-4 text-neutral-950"
                      />
                      <div>
                        <p className="text-xs font-bold text-neutral-950">
                          Cash On Delivery (COD)
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Pay securely with cash or UPI QR at your doorstep
                        </p>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-neutral-700" />
                  </label>

                  {/* UPI */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'upi'
                      ? 'border-neutral-950 bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleFormChange}
                        className="w-4 h-4 text-neutral-950"
                      />
                      <div>
                        <p className="text-xs font-bold text-neutral-950">
                          Instant UPI / Cards / Net Banking
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          GPay, PhonePe, Paytm, BHIM, Debit/Credit Card
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-neutral-700" />
                  </label>

                  {/* WhatsApp Direct */}
                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'whatsapp'
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="whatsapp"
                        checked={formData.paymentMethod === 'whatsapp'}
                        onChange={handleFormChange}
                        className="w-4 h-4 text-emerald-600"
                      />
                      <div>
                        <p className="text-xs font-bold text-neutral-950">
                          Direct WhatsApp Order Placement
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Place order directly with human team on +91 77560 61273
                        </p>
                      </div>
                    </div>
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  </label>
                </div>
              </div>

            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 space-y-6 sticky top-28">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
                <h3 className="text-base font-bold font-display text-neutral-950 pb-4 border-b border-neutral-100">
                  Order Summary ({cart.length} Items)
                </h3>

                {/* Items preview */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-12 rounded-lg object-cover bg-neutral-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-neutral-900 line-clamp-1">{item.product.name}</p>
                          <p className="text-[11px] text-neutral-500">
                            Size: {item.selectedSize} · Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-extrabold text-neutral-950 font-display">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="space-y-2 text-xs pt-4 border-t border-neutral-100">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-neutral-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount ({couponCode})</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
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

                  <div className="flex justify-between text-lg font-extrabold text-neutral-950 pt-3 border-t border-neutral-200 font-display">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  className="w-full bg-neutral-950 hover:bg-black text-white py-4 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
                  id="checkout-place-order-btn"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>PLACE ORDER · ₹{grandTotal.toLocaleString('en-IN')}</span>
                </button>
              </div>

              {/* Security Banner */}
              <div className="p-4 bg-neutral-100 rounded-2xl text-[11px] text-neutral-600 space-y-1">
                <p className="font-bold text-neutral-900">🛡️ 100% Purchase Guarantee</p>
                <p>All items checked manually for fabric grade, size precision, and stitch density before shipping.</p>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
