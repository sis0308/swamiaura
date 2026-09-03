import React, { useState } from 'react';
import { SERVICES_LIST } from '../data/products';
import { useCart } from '../context/CartContext';
import {
  Sparkles,
  Maximize2,
  Palette,
  Truck,
  RotateCcw,
  Headphones,
  Building2,
  Layers,
  CheckCircle2,
  Calculator,
  MessageCircle,
  Phone,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Maximize2,
  Palette,
  Truck,
  RotateCcw,
  Headphones,
  Building2,
  Layers
};

export const ServicesView: React.FC = () => {
  const { showToast } = useCart();

  // Custom Bulk Quote Calculator state
  const [bulkConfig, setBulkConfig] = useState({
    fabricType: '240 GSM Combed Cotton',
    quantity: 50,
    customization: 'Embroidery + Screen Print',
    neckStyle: 'Round Neck / Oversized',
    contactName: '',
    contactPhone: '',
    companyName: ''
  });

  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const estimatedUnitCost =
    bulkConfig.quantity >= 200
      ? 399
      : bulkConfig.quantity >= 100
      ? 449
      : bulkConfig.quantity >= 50
      ? 499
      : 549;

  const estimatedTotal = estimatedUnitCost * bulkConfig.quantity;

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkConfig.contactName || !bulkConfig.contactPhone) {
      showToast('Please enter your contact details', '', 'error');
      return;
    }
    setQuoteSubmitted(true);
    showToast('Quote Request Received!', 'Our B2B corporate merchandising team will contact you.', 'success');
  };

  const handleWhatsAppBulk = () => {
    const text = `*BULK / CUSTOM ORDER INQUIRY*\n\n*Name:* ${bulkConfig.contactName || 'Valued Customer'}\n*Company/College:* ${bulkConfig.companyName || 'N/A'}\n*Phone:* ${bulkConfig.contactPhone || 'N/A'}\n*Quantity:* ${bulkConfig.quantity} Units\n*Fabric:* ${bulkConfig.fabricType}\n*Customization:* ${bulkConfig.customization}\n*Est. Total:* ₹${estimatedTotal}\n\nPlease share sample catalog and turnaround timeline!`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-24 text-left">
      {/* Header Banner */}
      <div className="bg-neutral-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Our Capabilities & Client Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
            Manufacturing & Retail Services
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl">
            From single bespoke streetwear units to large enterprise workwear runs, discover how SWAMI THREADS delivers uncompromised textile quality.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* 8 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_LIST.map((srv, idx) => {
            const IconComp = ICON_MAP[srv.iconName] || Sparkles;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mb-5">
                    <IconComp className="w-6 h-6" />
                  </div>
                  {srv.highlight && (
                    <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block mb-1">
                      {srv.highlight}
                    </span>
                  )}
                  <h3 className="text-base font-bold font-display text-neutral-950">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-neutral-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Guaranteed Standards</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Bulk & Custom Order Calculator */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-sm" id="bulk-calculator">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Corporate & Event Merchandising
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-950">
                  Instant Bulk Order Estimator
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600">
                  Configure your volume requirements, fabric weight, and branding customization for real-time tier pricing.
                </p>
              </div>

              {quoteSubmitted ? (
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-950">
                    Quote Request Received!
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    We will send digital fabric swatches and a formal PDF estimate to your contact number within 2 hours.
                  </p>
                  <button
                    onClick={() => setQuoteSubmitted(false)}
                    className="text-xs font-bold underline text-neutral-900"
                  >
                    Calculate another configuration
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBulkSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Fabric Grade & Composition
                    </label>
                    <select
                      value={bulkConfig.fabricType}
                      onChange={(e) =>
                        setBulkConfig({ ...bulkConfig, fabricType: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-neutral-50"
                    >
                      <option value="240 GSM Combed Cotton">240 GSM Heavyweight 100% Combed Cotton</option>
                      <option value="280 GSM French Terry">280 GSM French Terry Loopback Knit</option>
                      <option value="220 GSM Micro-Pique">220 GSM Egyptian Cotton Micro-Piqué (Polo)</option>
                      <option value="180 GSM Active Spandex">180 GSM Dry-Fit Poly-Spandex Activewear</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-neutral-700 mb-1">
                      <span>Order Quantity:</span>
                      <span className="text-neutral-950 font-display text-sm font-black">
                        {bulkConfig.quantity} Units
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="500"
                      step="10"
                      value={bulkConfig.quantity}
                      onChange={(e) =>
                        setBulkConfig({ ...bulkConfig, quantity: Number(e.target.value) })
                      }
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-950"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 font-semibold mt-1">
                      <span>20 pcs (Min)</span>
                      <span>100 pcs (10% Tier)</span>
                      <span>200+ pcs (25% Tier)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Custom Branding Method
                    </label>
                    <select
                      value={bulkConfig.customization}
                      onChange={(e) =>
                        setBulkConfig({ ...bulkConfig, customization: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold bg-neutral-50"
                    >
                      <option value="Direct-To-Garment High-Res Print">Direct-To-Garment (DTG) Full Color Print</option>
                      <option value="High-Density Screen Printing">High-Density Plastisol Screen Printing</option>
                      <option value="Japanese Computerized Embroidery">High-Precision Computerized Embroidery</option>
                      <option value="Embossed 3D Puff Print">3D Puff Silicone Print</option>
                      <option value="Blank Plain T-Shirts">Plain Blank Heavyweight T-Shirts</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        value={bulkConfig.contactName}
                        onChange={(e) =>
                          setBulkConfig({ ...bulkConfig, contactName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs bg-neutral-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Contact Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 XXXXX"
                        required
                        value={bulkConfig.contactPhone}
                        onChange={(e) =>
                          setBulkConfig({ ...bulkConfig, contactPhone: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs bg-neutral-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-neutral-950 hover:bg-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                  >
                    <Send className="w-4 h-4" />
                    <span>REQUEST FORMAL ESTIMATE & SAMPLE</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right Summary Box */}
            <div className="lg:col-span-5 bg-neutral-900 text-white rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Calculator className="w-4 h-4" />
                <span>Live Cost Estimate</span>
              </div>

              <div className="space-y-3 pb-6 border-b border-neutral-800">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Selected Volume:</span>
                  <span className="font-bold text-white">{bulkConfig.quantity} Units</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Estimated Unit Rate:</span>
                  <span className="font-bold text-white">₹{estimatedUnitCost} / unit</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Production Turnaround:</span>
                  <span className="font-bold text-emerald-400">4-7 Working Days</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Sample Approval:</span>
                  <span className="font-bold text-white">Free Physical Sample</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-neutral-400">Estimated Total Cost</span>
                <p className="text-3xl font-black font-display text-white">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-neutral-400">Includes taxes, doorstep delivery & setup</p>
              </div>

              <button
                onClick={handleWhatsAppBulk}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Discuss On WhatsApp (+91 98765 43210)</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
