import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Ruler, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SizeGuideModal: React.FC = () => {
  const { sizeGuideOpen, setSizeGuideOpen } = useCart();
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!sizeGuideOpen) return null;

  const sizeChartInches = [
    { size: 'S', chest: '38"', length: '27.5"', shoulder: '17.5"', sleeve: '8.5"' },
    { size: 'M', chest: '40"', length: '28.5"', shoulder: '18.5"', sleeve: '9.0"' },
    { size: 'L', chest: '42"', length: '29.5"', shoulder: '19.5"', sleeve: '9.5"' },
    { size: 'XL', chest: '44"', length: '30.5"', shoulder: '20.5"', sleeve: '10.0"' },
    { size: 'XXL', chest: '46"', length: '31.5"', shoulder: '21.5"', sleeve: '10.5"' },
    { size: '3XL', chest: '48"', length: '32.5"', shoulder: '22.5"', sleeve: '11.0"' }
  ];

  const sizeChartCm = [
    { size: 'S', chest: '96.5 cm', length: '70.0 cm', shoulder: '44.5 cm', sleeve: '21.5 cm' },
    { size: 'M', chest: '101.6 cm', length: '72.4 cm', shoulder: '47.0 cm', sleeve: '22.8 cm' },
    { size: 'L', chest: '106.7 cm', length: '75.0 cm', shoulder: '49.5 cm', sleeve: '24.1 cm' },
    { size: 'XL', chest: '111.8 cm', length: '77.5 cm', shoulder: '52.0 cm', sleeve: '25.4 cm' },
    { size: 'XXL', chest: '116.8 cm', length: '80.0 cm', shoulder: '54.6 cm', sleeve: '26.7 cm' },
    { size: '3XL', chest: '122.0 cm', length: '82.5 cm', shoulder: '57.1 cm', sleeve: '28.0 cm' }
  ];

  const currentChart = unit === 'in' ? sizeChartInches : sizeChartCm;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSizeGuideOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 text-left border border-neutral-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-neutral-900" />
              <h3 className="text-xl font-bold font-display text-neutral-950">
                Official Size Guide
              </h3>
            </div>
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-between mt-5 mb-4">
            <p className="text-xs text-neutral-500 font-medium">
              Measurements reflect garment dimensions.
            </p>
            <div className="bg-neutral-100 p-1 rounded-lg flex gap-1">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  unit === 'in' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  unit === 'cm' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Measurement Table */}
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-900 text-white font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest</th>
                  <th className="p-3">Length</th>
                  <th className="p-3">Shoulder</th>
                  <th className="p-3">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {currentChart.map((row) => (
                  <tr key={row.size} className="hover:bg-neutral-50">
                    <td className="p-3 font-extrabold text-neutral-950 bg-neutral-50/50">
                      {row.size}
                    </td>
                    <td className="p-3 text-neutral-700">{row.chest}</td>
                    <td className="p-3 text-neutral-700">{row.length}</td>
                    <td className="p-3 text-neutral-700">{row.shoulder}</td>
                    <td className="p-3 text-neutral-700">{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sizing Tips */}
          <div className="mt-5 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <HelpCircle className="w-4 h-4" />
              <span>Fit Recommendations</span>
            </div>
            <p>
              • <strong>Regular Fit</strong>: Buy your standard size.
            </p>
            <p>
              • <strong>Oversized Collection</strong>: Designed intentionally roomy with dropped shoulders. Order your true size for the intended boxy aesthetic.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="bg-neutral-950 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
            >
              Got It
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
