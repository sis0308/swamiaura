import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SizeGuideModal } from './components/SizeGuideModal';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { ServicesView } from './views/ServicesView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';

const MainAppLayout: React.FC = () => {
  const { currentRoute } = useCart();

  // Route Dispatcher
  const renderCurrentView = () => {
    if (currentRoute === '/') {
      return <HomeView />;
    }

    if (currentRoute === '/admin') {
      return <AdminView />;
    }

    if (
      currentRoute === '/shop' ||
      currentRoute.startsWith('/category/') ||
      currentRoute === '/new-arrivals' ||
      currentRoute === '/best-sellers' ||
      currentRoute === '/offers'
    ) {
      return <ShopView />;
    }

    if (currentRoute.startsWith('/product/')) {
      const productId = currentRoute.replace('/product/', '');
      return <ProductDetailView productId={productId} />;
    }

    if (currentRoute === '/cart') {
      return <CartView />;
    }

    if (currentRoute === '/checkout') {
      return <CheckoutView />;
    }

    if (currentRoute === '/services') {
      return <ServicesView />;
    }

    if (currentRoute === '/about') {
      return <AboutView />;
    }

    if (currentRoute === '/contact') {
      return <ContactView />;
    }

    // Default fallback
    return <HomeView />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* 1. Sticky Navigation Header */}
      <Header />

      {/* 2. Main Body Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* 3. Global Luxury Footer */}
      <Footer />

      {/* 4. Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <SizeGuideModal />

      {/* 5. Notification Toast & WhatsApp Floating Trigger */}
      <Toast />
      <WhatsAppFloatingButton />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <MainAppLayout />
      </CartProvider>
    </StoreProvider>
  );
}

export default App;
