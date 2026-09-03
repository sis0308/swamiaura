import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'error';
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  appliedCoupon: string | null;
  discountAmount: number;
  shippingFee: number;
  grandTotal: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  sizeGuideOpen: boolean;
  setSizeGuideOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  currentRoute: string;
  navigateTo: (route: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Cart State (Persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Wishlist State (Persisted)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist:', e);
    }
  }, [wishlist]);

  // Modals & Drawers
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('SWAMI30');

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    if (!size) {
      showToast('Please select a size', 'Choose your desired size before adding to cart', 'error');
      return;
    }
    if (!color) {
      showToast('Please select a color', 'Choose your preferred color option', 'error');
      return;
    }

    const cartItemId = `${product.id}-${size}-${color.replace(/\s+/g, '-').toLowerCase()}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity
          }
        ];
      }
    });

    showToast(
      'Added to Cart!',
      `${product.name} (${size} · ${color})`,
      'success'
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed', 'Item was removed from your bag', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', '', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', 'Item saved to your favorites', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SWAMI30' || cleanCode === 'AURA30') {
      setAppliedCoupon('SWAMI30');
      showToast('Coupon Applied!', 'Enjoy 30% OFF on your entire order', 'success');
      return { success: true, message: '30% discount applied successfully!' };
    } else if (cleanCode === 'FIRST10') {
      setAppliedCoupon('FIRST10');
      showToast('Coupon Applied!', '10% discount applied for new customers', 'success');
      return { success: true, message: '10% welcome discount applied!' };
    } else if (cleanCode === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      showToast('Coupon Applied!', 'Free shipping unlocked', 'success');
      return { success: true, message: 'Free standard shipping applied!' };
    } else {
      showToast('Invalid Coupon Code', 'Please try SWAMI30 or FIRST10', 'error');
      return { success: false, message: 'Invalid or expired coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', '', 'info');
  };

  let discountAmount = 0;
  if (appliedCoupon === 'SWAMI30' || appliedCoupon === 'AURA30') {
    discountAmount = Math.round(subtotal * 0.3);
  } else if (appliedCoupon === 'FIRST10') {
    discountAmount = Math.round(subtotal * 0.1);
  }

  const isFreeShipCoupon = appliedCoupon === 'FREESHIP';
  const shippingFee = subtotal >= 999 || isFreeShipCoupon || subtotal === 0 ? 0 : 79;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        appliedCoupon,
        discountAmount,
        shippingFee,
        grandTotal,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isWishlisted,
        cartDrawerOpen,
        setCartDrawerOpen,
        searchModalOpen,
        setSearchModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        sizeGuideOpen,
        setSizeGuideOpen,
        toasts,
        showToast,
        removeToast,
        currentRoute,
        navigateTo
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
