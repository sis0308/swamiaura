import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, showToast } = useCart();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email', '', 'error');
      return;
    }
    setNewsletterSubscribed(true);
    showToast('Subscribed Successfully!', 'Check your inbox for extra 10% coupon: FIRST10', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#111111] text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      {/* Brand Value Trust Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-neutral-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-neutral-900 flex items-center justify-center text-white shrink-0 border border-neutral-800">
              <Truck className="w-4 h-4 text-neutral-300" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">Free Shipping</p>
              <p className="text-[11px] text-neutral-400 font-mono">Orders Above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-neutral-900 flex items-center justify-center text-white shrink-0 border border-neutral-800">
              <ShieldCheck className="w-4 h-4 text-neutral-300" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">240 GSM Cotton</p>
              <p className="text-[11px] text-neutral-400 font-mono">Bio-Washed Finish</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-neutral-900 flex items-center justify-center text-white shrink-0 border border-neutral-800">
              <RotateCcw className="w-4 h-4 text-neutral-300" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">7-Day Exchange</p>
              <p className="text-[11px] text-neutral-400 font-mono">Doorstep Pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-neutral-900 flex items-center justify-center text-white shrink-0 border border-neutral-800">
              <CreditCard className="w-4 h-4 text-neutral-300" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">Secure Checkout</p>
              <p className="text-[11px] text-neutral-400 font-mono">UPI, Cards & COD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <div>
              <div className="flex items-center gap-3.5">
                <img
                  src="/teezoon-logo.jpg"
                  alt="TEEZOON Emblem"
                  className="w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-md bg-white p-0.5 shrink-0 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="/teezoon-logo-white-transparent.png"
                  alt="Teezoon - m group of company"
                  className="h-10 sm:h-12 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs text-neutral-400 mt-3 leading-relaxed max-w-sm">
                Architectural silhouettes meets premium 240 GSM combed cotton. Redefining modern casualwear with thoughtful cuts, rich saturated dyes, and timeless fit longevity.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white font-mono">
                Join Our Editorial Newsletter
              </p>
              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 p-3 bg-neutral-900 border border-neutral-700 text-white text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Use code <strong className="font-mono bg-black px-1 py-0.5 border border-neutral-700">FIRST10</strong> during checkout!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-800 px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 font-mono"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-neutral-200 text-black px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-neutral-900 hover:bg-white hover:text-black transition-colors flex items-center justify-center text-neutral-300 border border-neutral-800"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-neutral-900 hover:bg-white hover:text-black transition-colors flex items-center justify-center text-neutral-300 border border-neutral-800"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-neutral-900 hover:bg-white hover:text-black transition-colors flex items-center justify-center text-neutral-300 border border-neutral-800"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/917756061273"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-neutral-900 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center text-neutral-300 border border-neutral-800"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* SHOP Column */}
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4 font-mono">
              Collections
            </p>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => navigateTo('/shop')}
                  className="hover:text-white transition-colors text-left"
                >
                  All T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/new-arrivals')}
                  className="hover:text-white transition-colors text-left"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/best-sellers')}
                  className="hover:text-white transition-colors text-left"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/offers')}
                  className="hover:text-white transition-colors text-left font-medium"
                >
                  Special Offers (Flat 30%)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/oversized')}
                  className="hover:text-white transition-colors text-left"
                >
                  Oversized 240 GSM
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/premium')}
                  className="hover:text-white transition-colors text-left"
                >
                  Luxury Egyptian Giza
                </button>
              </li>
            </ul>
          </div>

          {/* CATEGORIES Column */}
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4 font-mono">
              Categories
            </p>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => navigateTo('/category/polo')}
                  className="hover:text-white transition-colors text-left"
                >
                  Polo T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/oversized')}
                  className="hover:text-white transition-colors text-left"
                >
                  Oversized T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/printed')}
                  className="hover:text-white transition-colors text-left"
                >
                  Graphic Printed T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/sports')}
                  className="hover:text-white transition-colors text-left"
                >
                  Sports & Activewear
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/round-neck')}
                  className="hover:text-white transition-colors text-left"
                >
                  Round Neck Basics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/category/full-sleeve')}
                  className="hover:text-white transition-colors text-left"
                >
                  Full Sleeve T-Shirts
                </button>
              </li>
            </ul>
          </div>

          {/* CONTACT & COMPANY Column */}
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4 font-mono">
              Direct Contact
            </p>
            <ul className="space-y-3 text-xs text-neutral-400 font-mono">
              <li className="flex items-start gap-2.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider">Phone</p>
                  <a href="tel:+917756061273" className="text-white font-medium hover:underline">
                    +91 77560 61273
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-3.5 h-3.5 text-neutral-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider">WhatsApp</p>
                  <a href="https://wa.me/917756061273" target="_blank" rel="noreferrer" className="text-white font-medium hover:underline">
                    +91 77560 61273
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-3.5 h-3.5 text-neutral-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-neutral-500 text-[9px] uppercase font-bold tracking-wider">Email</p>
                  <a href="mailto:management.teezoon@gmail.com" className="text-white hover:underline">
                    management.teezoon@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 mt-0.5 shrink-0" />
                <div className="font-sans text-xs">
                  <p className="text-neutral-500 text-[9px] uppercase font-mono font-bold tracking-wider">Studio</p>
                  <p className="text-neutral-300">
                    Muli Nagar, Behind the Karva Dhrmshla, Maulinagar, Alandi Devachi, PIN: 412105
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-neutral-800 flex gap-3 text-[11px] text-neutral-500 uppercase tracking-wider font-mono">
              <button onClick={() => navigateTo('/about')} className="hover:text-white">
                About
              </button>
              <span>·</span>
              <button onClick={() => navigateTo('/services')} className="hover:text-white">
                Services
              </button>
              <span>·</span>
              <button onClick={() => navigateTo('/contact')} className="hover:text-white">
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-mono">
        <p>© 2026 TEEZOON. All Rights Reserved.</p>
        <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-end">
          <span className="hover:text-neutral-300 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-neutral-300 cursor-pointer">Terms & Conditions</span>
          <span className="hover:text-neutral-300 cursor-pointer">Shipping & Returns</span>
          <span className="text-neutral-700">|</span>
          <button
            onClick={() => navigateTo('/admin')}
            className="hover:text-white flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
            id="footer-admin-portal-link"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
