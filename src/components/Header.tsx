import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingBag,
  Heart,
  Phone,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../data/categories';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setCartDrawerOpen,
    setSearchModalOpen,
    currentRoute,
    navigateTo
  } = useCart();
  const { adminSession } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', route: '/' },
    {
      label: 'T-Shirts',
      route: '/shop',
      hasDropdown: true
    },
    { label: 'New Arrivals', route: '/new-arrivals', badge: 'New' },
    { label: 'Best Sellers', route: '/best-sellers', badge: 'Hot' },
    { label: 'Offers', route: '/offers', highlight: true },
    { label: 'Services', route: '/services' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' }
  ];

  const handleNavClick = (route: string) => {
    navigateTo(route);
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
  };

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#111111] text-[#E5E5E5] text-[11px] py-2 px-4 sm:px-8 border-b border-neutral-800 tracking-wider uppercase font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto md:mx-0">
            <span className="inline-block bg-white text-black text-[9px] font-bold px-1.5 py-0.5 tracking-widest">
              PROMO
            </span>
            <span className="text-neutral-300 text-[11px]">
              Flat 30% Off With Code <strong className="text-white font-mono bg-neutral-900 px-1 py-0.5 border border-neutral-700">TEEZOON30</strong> · Free Delivery Over ₹999
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-neutral-400 text-[10px] font-mono tracking-wider">
            <a
              href="tel:+917756061273"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              id="header-top-call"
            >
              <Phone className="w-3 h-3 text-neutral-400" />
              <span>CALL: +91 77560 61273</span>
            </a>
            <span className="text-neutral-700">|</span>
            <button
              onClick={() => handleNavClick('/services')}
              className="hover:text-white transition-colors uppercase tracking-widest text-[10px]"
            >
              Custom Production
            </button>
            <span className="text-neutral-700">|</span>
            <button
              onClick={() => handleNavClick('/admin')}
              className={`hover:text-white transition-colors uppercase tracking-widest text-[10px] flex items-center gap-1.5 ${
                adminSession?.isAuthenticated ? 'text-amber-400 font-bold' : 'text-neutral-400'
              }`}
              id="header-top-admin-link"
              title="Admin Panel: Orders & Product Management"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{adminSession?.isAuthenticated ? 'Admin Dashboard (Active)' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-200'
            : 'bg-white border-b border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-neutral-900 hover:text-black transition-colors"
                aria-label="Open navigation menu"
                id="mobile-menu-toggle-btn"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo & Name */}
            <div className="flex items-center">
              <button
                onClick={() => handleNavClick('/')}
                className="flex items-center gap-2.5 sm:gap-3 text-left group transition-opacity hover:opacity-85 py-1"
                id="brand-logo-btn"
                aria-label="Teezoon Home"
              >
                {/* Left Side Logo Icon Emblem */}
                <img
                  src="/teezoon-logo.jpg"
                  alt="TEEZOON Emblem"
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain rounded-md border border-neutral-200 bg-white shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                
                {/* Brand Name & Typography */}
                <img
                  src="/teezoon-logo-black-transparent.png"
                  alt="Teezoon - m group of company"
                  className="h-8 sm:h-10 md:h-11 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-[11px] font-semibold uppercase tracking-widest">
              {navLinks.map((link) => {
                const isActive =
                  link.route === '/'
                    ? currentRoute === '/'
                    : currentRoute.startsWith(link.route);

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setCategoriesDropdownOpen(true)}
                      onMouseLeave={() => setCategoriesDropdownOpen(false)}
                    >
                      <button
                        onClick={() => handleNavClick(link.route)}
                        className={`flex items-center gap-1 py-1 transition-colors ${
                          isActive
                            ? 'text-black border-b-2 border-black font-bold'
                            : 'text-gray-400 hover:text-black'
                        }`}
                        id="nav-tshirts-dropdown-btn"
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>

                      {/* Dropdown Menu for Categories */}
                      <AnimatePresence>
                        {categoriesDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 w-80 bg-white border border-gray-200 shadow-xl p-3 z-50 mt-2"
                          >
                            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Categories (10)
                              </span>
                              <button
                                onClick={() => handleNavClick('/shop')}
                                className="text-[10px] font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
                              >
                                View All <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-1 max-h-[380px] overflow-y-auto pr-1">
                              {CATEGORIES.map((cat) => (
                                <button
                                  key={cat.id}
                                  onClick={() => handleNavClick(`/category/${cat.slug}`)}
                                  className="flex items-center justify-between p-2 hover:bg-neutral-50 text-left group transition-colors"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 overflow-hidden bg-neutral-100 shrink-0">
                                      <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-neutral-900 group-hover:text-black">
                                        {cat.name}
                                      </p>
                                      <p className="text-[9px] uppercase tracking-wider text-gray-400">
                                        {cat.productCount} Items
                                      </p>
                                    </div>
                                  </div>
                                  {cat.badge && (
                                    <span className="text-[9px] font-mono font-bold bg-neutral-100 text-neutral-800 px-1.5 py-0.5">
                                      {cat.badge}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.route)}
                    className={`relative py-1 transition-colors flex items-center gap-1 ${
                      isActive
                        ? 'text-black border-b-2 border-black font-bold'
                        : link.highlight
                        ? 'text-rose-600 hover:text-black'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[8px] uppercase font-bold bg-black text-white px-1 py-0.2">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons & Contact Number */}
            <div className="flex items-center space-x-6">
              <span className="text-[10px] font-mono font-medium hidden xl:block text-neutral-700 tracking-wider">
                CALL: +91 98765 43210
              </span>

              <div className="flex items-center space-x-4">
                {/* Search Icon */}
                <button
                  onClick={() => setSearchModalOpen(true)}
                  className="text-neutral-700 hover:text-black transition-colors"
                  aria-label="Search T-Shirts"
                  id="header-search-btn"
                >
                  <Search className="w-5 h-5 stroke-[1.5]" />
                </button>

                {/* Wishlist Icon */}
                <button
                  onClick={() => handleNavClick('/shop')}
                  className="text-neutral-700 hover:text-black transition-colors relative"
                  aria-label="Wishlist"
                  id="header-wishlist-btn"
                  title="Favorites"
                >
                  <Heart className="w-5 h-5 stroke-[1.5]" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-mono">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Admin Portal Gateway Icon */}
                <button
                  onClick={() => handleNavClick('/admin')}
                  className={`flex items-center gap-1.5 transition-colors p-1 ${
                    adminSession?.isAuthenticated
                      ? 'bg-black text-white text-[10px] font-mono font-bold px-2.5 py-1'
                      : 'text-neutral-700 hover:text-black'
                  }`}
                  aria-label="Admin Portal"
                  id="header-admin-btn"
                  title={
                    adminSession?.isAuthenticated
                      ? 'Admin Dashboard Active - Manage Orders & Products'
                      : 'Admin Portal (Protected by ID/Password & OTP)'
                  }
                >
                  <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
                  {adminSession?.isAuthenticated && (
                    <span className="hidden md:inline text-[10px] tracking-widest uppercase">Admin</span>
                  )}
                </button>

                {/* Shopping Cart Icon */}
                <button
                  onClick={() => setCartDrawerOpen(true)}
                  className="relative text-neutral-700 hover:text-black transition-colors"
                  aria-label="Open cart drawer"
                  id="header-cart-btn"
                >
                  <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-mono">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Menu Slide-Over */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Mobile Header Top */}
                <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/teezoon-logo.jpg"
                      alt="TEEZOON Emblem"
                      className="w-8 h-8 object-contain rounded-md border border-neutral-200 bg-white shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <img
                      src="/teezoon-logo-black-transparent.png"
                      alt="Teezoon - m group of company"
                      className="h-7 w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-neutral-500 hover:text-black rounded-lg"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Contact Quick Bar */}
                <div className="p-4 bg-neutral-900 text-white">
                  <p className="text-[11px] text-neutral-400 uppercase font-semibold tracking-wider mb-1">
                    Direct Customer Support
                  </p>
                  <a
                    href="tel:+917756061273"
                    className="flex items-center gap-2 text-base font-bold text-emerald-400 hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+91 77560 61273</span>
                  </a>
                </div>

                {/* Navigation Links */}
                <div className="p-4 space-y-1">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link.route)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left text-sm font-semibold transition-colors ${
                        currentRoute === link.route
                          ? 'bg-neutral-900 text-white'
                          : link.highlight
                          ? 'text-rose-600 bg-rose-50'
                          : 'text-neutral-800 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="text-[10px] font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Category Quick Links */}
                <div className="px-4 pt-2 pb-4 border-t border-neutral-100">
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                    Shop Categories
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.slice(0, 6).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleNavClick(`/category/${cat.slug}`)}
                        className="text-left text-xs font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-100 p-2.5 rounded-lg truncate border border-neutral-200/60"
                      >
                        {cat.name.replace(' T-Shirts', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Drawer Bottom Actions */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-2">
                <a
                  href="https://wa.me/917756061273?text=Hi%20TEEZOON!%20I%20would%20like%20to%20order%20T-Shirts."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-sm font-semibold transition-colors"
                >
                  <span>Order on WhatsApp</span>
                </a>
                <button
                  onClick={() => handleNavClick('/admin')}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-neutral-300 hover:text-white py-2.5 text-xs font-mono tracking-wider transition-colors border border-neutral-800"
                  id="mobile-admin-portal-link"
                >
                  <ShieldCheck className="w-4 h-4 text-neutral-400" />
                  <span>{adminSession?.isAuthenticated ? 'Admin Dashboard (Active)' : 'Admin Portal (Login / OTP)'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
