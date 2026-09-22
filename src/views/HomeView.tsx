import React from 'react';
import { Hero } from '../components/Hero';
import { CategorySection } from '../components/CategorySection';
import { ProductCard } from '../components/ProductCard';
import { OffersSection } from '../components/OffersSection';
import { ServicesSection } from '../components/ServicesSection';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const { navigateTo, showToast } = useCart();
  const { products } = useStore();

  // Filter products for sections
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);

  const [contactForm, setContactForm] = React.useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = React.useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      showToast('Please fill all required fields', '', 'error');
      return;
    }
    setContactSubmitted(true);
    showToast('Message Sent Successfully!', 'Our team will contact you within 2 business hours.', 'success');
    setContactForm({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. 10 T-Shirt Categories Showcase */}
      <CategorySection />

      {/* 3. New Arrivals Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-neutral-200/80" id="new-arrivals-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 text-neutral-600 text-xs font-bold uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Fresh Off The Loom</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-display tracking-tight">
                New Arrivals
              </h2>
              <p className="text-sm text-neutral-600 mt-2 max-w-xl">
                The latest 2026 cuts featuring high-density typography, drop-shoulder silhouettes and organic slub weaves.
              </p>
            </div>

            <button
              onClick={() => navigateTo('/new-arrivals')}
              className="self-start md:self-auto flex items-center gap-2 text-sm font-bold text-neutral-950 hover:text-neutral-700 group transition-colors"
            >
              <span>View All New Arrivals ({products.filter((p) => p.isNew).length})</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigateTo('/new-arrivals')}
              className="bg-neutral-950 hover:bg-black text-white px-8 py-4 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md hover:scale-102"
            >
              Explore All New Arrivals
            </button>
          </div>

        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-neutral-200/80" id="best-sellers-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-bold uppercase tracking-widest mb-2">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>Most Loved By Customers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-display tracking-tight">
                Best Sellers
              </h2>
              <p className="text-sm text-neutral-600 mt-2 max-w-xl">
                Time-tested wardrobe staples rated 4.8★+ across thousands of authentic customer reviews.
              </p>
            </div>

            <button
              onClick={() => navigateTo('/best-sellers')}
              className="self-start md:self-auto flex items-center gap-2 text-sm font-bold text-neutral-950 hover:text-neutral-700 group transition-colors"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 5. Special Promotional Offers Section */}
      <OffersSection />

      {/* 6. Fabric Story & Craftsmanship Banner */}
      <section className="py-16 sm:py-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-neutral-500">
                The 240 GSM Philosophy
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-neutral-950 leading-tight">
                Not Just Another Cotton Tee. A Masterpiece of Textile Architecture.
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Most commercial tees use flimsy 140–160 GSM fabrics that collapse after two washes. At TEEZOON, we exclusively spin 240 GSM extra-long staple combed cotton and French Terry knits.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-xl font-black text-neutral-950 font-display">240 GSM</span>
                  <p className="text-xs text-neutral-500 mt-1">Dense, structured, opaque drape that never sags.</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="text-xl font-black text-neutral-950 font-display">Bio-Washed</span>
                  <p className="text-xs text-neutral-500 mt-1">Silicone enzyme softened with zero pilling.</p>
                </div>
              </div>

              <button
                onClick={() => navigateTo('/about')}
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors"
              >
                <span>Read Our Fabric Standards</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
                alt="Fabric craft"
                className="rounded-2xl shadow-lg aspect-4/5 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1625910513413-56254c46fdf7?auto=format&fit=crop&w=600&q=80"
                alt="Polo craft"
                className="rounded-2xl shadow-lg aspect-4/5 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Services Section (8 Services) */}
      <ServicesSection />

      {/* 8. Contact Section */}
      <section className="py-16 sm:py-24 bg-[#F7F7F7]" id="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-display">
              Contact TEEZOON
            </h2>
            <p className="text-sm text-neutral-600">
              Have questions about sizing, custom printing, or corporate bulk orders? We're available 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Direct Contact Details & Action Buttons */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-8 text-left">
              <div>
                <span className="font-display font-extrabold text-2xl text-neutral-950 block">
                  TEEZOON APPAREL
                </span>
                <p className="text-xs text-neutral-500 mt-1">
                  Premium Streetwear & Contemporary T-Shirt Manufacturer
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-semibold uppercase">Direct Phone Hotline</p>
                    <a href="tel:+917756061273" className="text-base font-extrabold text-neutral-950 hover:underline">
                      +91 77560 61273
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-semibold uppercase">WhatsApp Business Order</p>
                    <a href="https://wa.me/917756061273" target="_blank" rel="noreferrer" className="text-base font-extrabold text-emerald-700 hover:underline">
                      +91 77560 61273
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-semibold uppercase">Email Inquiries</p>
                    <a href="mailto:management.teezoon@gmail.com" className="text-base font-bold text-neutral-950 hover:underline">
                      management.teezoon@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-semibold uppercase">Design Studio & HQ</p>
                    <p className="text-sm font-medium text-neutral-800 mt-0.5">
                      42 Fashion Boulevard, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Mobile Quick Buttons */}
              <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-3">
                <a
                  href="tel:+917756061273"
                  className="bg-neutral-900 hover:bg-black text-white text-center py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>CALL NOW</span>
                </a>

                <a
                  href="https://wa.me/917756061273"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Right: Interactive Message Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm text-left">
              <h3 className="text-xl font-bold font-display text-neutral-950 mb-2">
                Send Us A Message
              </h3>
              <p className="text-xs text-neutral-500 mb-6">
                Fill in the form below and our fashion consultant will respond promptly.
              </p>

              {contactSubmitted ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-950">
                    Thank You For Connecting!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Your inquiry has been received. You can also reach our team immediately on WhatsApp or Phone.
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="text-xs font-bold text-neutral-900 underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 XXXXX"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Your Message / Custom Requirement *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about the styles, sizes, or custom printing you are interested in..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900 bg-neutral-50/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-neutral-950 hover:bg-black text-white py-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
