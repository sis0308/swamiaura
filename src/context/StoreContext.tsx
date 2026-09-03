import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CustomerOrder, OrderStatus, AdminSession } from '../types';
import { PRODUCTS } from '../data/products';
import { INITIAL_ORDERS } from '../data/initialOrders';
import {
  isFirebaseActive,
  subscribeProductsFromFirestore,
  seedInitialProductsIfEmpty,
  saveProductToFirestore,
  deleteProductFromFirestore,
  subscribeOrdersFromFirestore,
  saveOrderToFirestore,
  deleteOrderFromFirestore
} from '../lib/firebase';

interface StoreContextType {
  // Cloud Database Status
  isFirebaseConnected: boolean;

  // Products Management
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (id: string) => Product | undefined;
  resetProducts: () => void;

  // Orders Management
  orders: CustomerOrder[];
  addOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: {
      address: string;
      landmark?: string;
      city: string;
      state: string;
      pincode: string;
    };
    paymentMethod: 'cod' | 'upi' | 'whatsapp';
    items: Array<{
      productId: string;
      productName: string;
      productImage: string;
      size: string;
      color: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      gsm?: number;
    }>;
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    grandTotal: number;
    couponCode?: string;
    orderNotes?: string;
  }) => CustomerOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, notes?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  deleteOrder: (orderId: string) => void;

  // Admin Authentication & Security
  adminSession: AdminSession | null;
  adminLoginStep: 'credentials' | 'otp';
  pendingAdminEmail: string;
  activeOtp: string | null;
  otpCooldown: number;
  submitAdminCredentials: (idOrEmail: string, password: string) => { success: boolean; message: string; otp?: string };
  verifyAdminOtp: (otp: string) => { success: boolean; message: string };
  resendAdminOtp: () => { success: boolean; otp?: string; message: string };
  cancelAdminLogin: () => void;
  adminLogout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ADMIN_DEFAULT_EMAIL = 'admin@swamithreads.com';
const ADMIN_DEFAULT_PASS = 'admin123';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // 1. PRODUCTS STATE (Persisted in Firestore + localStorage cache)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('aura_store_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load products from cache:', e);
    }
    return PRODUCTS;
  });

  // 2. ORDERS STATE (Persisted in Firestore + localStorage cache)
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('aura_store_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load orders from cache:', e);
    }
    return INITIAL_ORDERS;
  });

  // FIREBASE FIRESTORE SYNC & REALTIME SUBSCRIPTIONS
  useEffect(() => {
    // A. Seed initial products in Firestore if collection is empty
    seedInitialProductsIfEmpty(PRODUCTS).catch((err) => {
      console.warn('Firestore initial seeding error:', err);
    });

    // B. Real-time subscribe to products collection in Firestore
    const unsubProducts = subscribeProductsFromFirestore(
      (cloudProducts) => {
        if (cloudProducts && cloudProducts.length > 0) {
          setProducts(cloudProducts);
          try {
            localStorage.setItem('aura_store_products', JSON.stringify(cloudProducts));
          } catch {
            // cache ignore
          }
        }
        setIsFirebaseConnected(true);
      },
      (err) => {
        console.warn('Firestore products subscription error:', err);
      }
    );

    // C. Real-time subscribe to orders collection in Firestore
    const unsubOrders = subscribeOrdersFromFirestore(
      (cloudOrders) => {
        if (cloudOrders && cloudOrders.length > 0) {
          setOrders(cloudOrders);
          try {
            localStorage.setItem('aura_store_orders', JSON.stringify(cloudOrders));
          } catch {
            // cache ignore
          }
        }
        setIsFirebaseConnected(true);
      },
      (err) => {
        console.warn('Firestore orders subscription error:', err);
      }
    );

    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, []);

  // Save to local cache on changes
  useEffect(() => {
    try {
      localStorage.setItem('aura_store_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to persist products cache:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_store_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders cache:', e);
    }
  }, [orders]);

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newId = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newProduct: Product = {
      ...productData,
      id: newId
    };
    setProducts((prev) => [newProduct, ...prev]);
    saveProductToFirestore(newProduct).catch((err) =>
      console.warn('Failed to save new product to Firestore:', err)
    );
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    saveProductToFirestore(updated).catch((err) =>
      console.warn('Failed to update product in Firestore:', err)
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    deleteProductFromFirestore(productId).catch((err) =>
      console.warn('Failed to delete product in Firestore:', err)
    );
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const resetProducts = () => {
    setProducts(PRODUCTS);
    localStorage.removeItem('aura_store_products');
    PRODUCTS.forEach((p) => {
      saveProductToFirestore(p).catch(() => {});
    });
  };

  const addOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: {
      address: string;
      landmark?: string;
      city: string;
      state: string;
      pincode: string;
    };
    paymentMethod: 'cod' | 'upi' | 'whatsapp';
    items: Array<{
      productId: string;
      productName: string;
      productImage: string;
      size: string;
      color: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      gsm?: number;
    }>;
    subtotal: number;
    discountAmount: number;
    shippingFee: number;
    grandTotal: number;
    couponCode?: string;
    orderNotes?: string;
  }): CustomerOrder => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `SWAMI-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...orderData
    };

    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToFirestore(newOrder).catch((err) =>
      console.warn('Failed to save order to Firestore:', err)
    );
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    notes?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          const updated: CustomerOrder = {
            ...ord,
            status,
            trackingNumber: trackingNumber !== undefined ? trackingNumber : ord.trackingNumber,
            notesFromAdmin: notes !== undefined ? notes : ord.notesFromAdmin
          };
          saveOrderToFirestore(updated).catch((err) =>
            console.warn('Failed to update order in Firestore:', err)
          );
          return updated;
        }
        return ord;
      })
    );
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          const updated: CustomerOrder = {
            ...ord,
            status: 'cancelled' as OrderStatus,
            cancellationReason: reason || 'Cancelled by Admin',
            cancelledAt: new Date().toISOString()
          };
          saveOrderToFirestore(updated).catch((err) =>
            console.warn('Failed to save cancelled order to Firestore:', err)
          );
          return updated;
        }
        return ord;
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId && ord.orderNumber !== orderId));
    deleteOrderFromFirestore(orderId).catch((err) =>
      console.warn('Failed to delete order from Firestore:', err)
    );
  };

  // 3. ADMIN AUTHENTICATION WITH ID, PASSWORD & EMAIL OTP
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const saved = localStorage.getItem('aura_admin_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [adminLoginStep, setAdminLoginStep] = useState<'credentials' | 'otp'>('credentials');
  const [pendingAdminEmail, setPendingAdminEmail] = useState<string>('');
  const [activeOtp, setActiveOtp] = useState<string | null>(null);
  const [otpCooldown, setOtpCooldown] = useState<number>(0);

  // OTP Countdown timer
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const submitAdminCredentials = (
    idOrEmail: string,
    password: string
  ): { success: boolean; message: string; otp?: string } => {
    const trimmedId = idOrEmail.trim().toLowerCase();
    const trimmedPass = password.trim();

    // Verify admin credentials
    const isValidAdmin =
      (trimmedId === ADMIN_DEFAULT_EMAIL ||
        trimmedId === 'admin' ||
        trimmedId === 'admin@swamithreads.com' ||
        trimmedId === 'admin@aurathreads.com' ||
        trimmedId.endsWith('@swamithreads.com') ||
        trimmedId.endsWith('@aurathreads.com')) &&
      (trimmedPass === ADMIN_DEFAULT_PASS ||
        trimmedPass === 'Admin@2026' ||
        trimmedPass === 'admin');

    if (!isValidAdmin) {
      return {
        success: false,
        message: 'Invalid Admin ID or Password. Check credentials and try again.'
      };
    }

    const emailToUse = trimmedId.includes('@') ? trimmedId : ADMIN_DEFAULT_EMAIL;
    const newOtp = generateOtp();

    setPendingAdminEmail(emailToUse);
    setActiveOtp(newOtp);
    setAdminLoginStep('otp');
    setOtpCooldown(60);

    return {
      success: true,
      otp: newOtp,
      message: `Security Code generated and sent to ${emailToUse}`
    };
  };

  const verifyAdminOtp = (otp: string): { success: boolean; message: string } => {
    const cleanOtp = otp.trim();

    if (!activeOtp || cleanOtp !== activeOtp) {
      return {
        success: false,
        message: 'Incorrect OTP code. Please enter the 6-digit code correctly.'
      };
    }

    const session: AdminSession = {
      email: pendingAdminEmail || ADMIN_DEFAULT_EMAIL,
      isAuthenticated: true,
      loginTimestamp: Date.now()
    };

    setAdminSession(session);
    try {
      localStorage.setItem('aura_admin_session', JSON.stringify(session));
    } catch (e) {
      console.error('Failed to store admin session', e);
    }

    setActiveOtp(null);
    setAdminLoginStep('credentials');
    return {
      success: true,
      message: 'Admin access authorized successfully!'
    };
  };

  const resendAdminOtp = (): { success: boolean; otp?: string; message: string } => {
    if (otpCooldown > 0) {
      return {
        success: false,
        message: `Please wait ${otpCooldown}s before requesting a new OTP.`
      };
    }

    const newOtp = generateOtp();
    setActiveOtp(newOtp);
    setOtpCooldown(60);

    return {
      success: true,
      otp: newOtp,
      message: `New security code generated: ${newOtp}`
    };
  };

  const cancelAdminLogin = () => {
    setAdminLoginStep('credentials');
    setActiveOtp(null);
  };

  const adminLogout = () => {
    setAdminSession(null);
    setAdminLoginStep('credentials');
    setActiveOtp(null);
    try {
      localStorage.removeItem('aura_admin_session');
    } catch {
      // ignore
    }
  };

  return (
    <StoreContext.Provider
      value={{
        isFirebaseConnected,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        resetProducts,
        orders,
        addOrder,
        updateOrderStatus,
        cancelOrder,
        deleteOrder,
        adminSession,
        adminLoginStep,
        pendingAdminEmail,
        activeOtp,
        otpCooldown,
        submitAdminCredentials,
        verifyAdminOtp,
        resendAdminOtp,
        cancelAdminLogin,
        adminLogout
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
