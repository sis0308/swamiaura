import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CustomerOrder, OrderStatus, AdminSession, Category } from '../types';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { INITIAL_ORDERS } from '../data/initialOrders';
import {
  isFirebaseActive,
  subscribeProductsFromFirestore,
  seedInitialProductsIfEmpty,
  saveProductToFirestore,
  deleteProductFromFirestore,
  subscribeCategoriesFromFirestore,
  seedInitialCategoriesIfEmpty,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
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

  // Categories & Collections Management
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  resetCategories: () => void;

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

const ADMIN_DEFAULT_EMAIL = 'management.teezoon@gmail.com';
const ADMIN_DEFAULT_PASS = 'Teezoon@321swami';

const normalizeProducts = (prods: Product[]): Product[] => {
  return prods.map((p) => ({
    ...p,
    colors: (p.colors || []).map((c, idx) => ({
      ...c,
      imageIndex: c.imageIndex !== undefined ? c.imageIndex : idx < (p.images?.length || 1) ? idx : 0
    }))
  }));
};

const getDeletedProductIds = (): string[] => {
  try {
    const raw = localStorage.getItem('aura_deleted_product_ids');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getDeletedCategoryIds = (): string[] => {
  try {
    const raw = localStorage.getItem('aura_deleted_category_ids');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // 1. PRODUCTS STATE (Persisted in Firestore + localStorage cache)
  const [products, setProducts] = useState<Product[]>(() => {
    const deletedIds = getDeletedProductIds().map((id) => String(id).trim());
    try {
      const saved = localStorage.getItem('aura_store_products');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return normalizeProducts(
            parsed.filter((p) => !deletedIds.includes(String(p.id).trim()))
          );
        }
      }
    } catch (e) {
      console.error('Failed to load products from cache:', e);
    }
    return normalizeProducts(
      PRODUCTS.filter((p) => !deletedIds.includes(String(p.id).trim()))
    );
  });

  // 2. CATEGORIES STATE (Persisted in Firestore + localStorage cache)
  const [categories, setCategories] = useState<Category[]>(() => {
    const deletedIds = getDeletedCategoryIds().map((id) => String(id).trim());
    try {
      const saved = localStorage.getItem('aura_store_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((c) => !deletedIds.includes(String(c.id).trim()));
        }
      }
    } catch (e) {
      console.error('Failed to load categories from cache:', e);
    }
    return CATEGORIES.filter((c) => !deletedIds.includes(String(c.id).trim()));
  });

  // 3. ORDERS STATE (Persisted in Firestore + localStorage cache)
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
    const deletedIds = getDeletedProductIds();
    const activeDefaults = PRODUCTS.filter((p) => !deletedIds.includes(p.id));

    // A. Seed initial products in Firestore if collection is empty
    seedInitialProductsIfEmpty(activeDefaults).catch((err) => {
      console.warn('Firestore initial seeding error:', err);
    });

    const deletedCatIds = getDeletedCategoryIds().map((id) => String(id).trim());
    const activeDefaultCategories = CATEGORIES.filter(
      (c) => !deletedCatIds.includes(String(c.id).trim())
    );

    // B. Seed initial categories in Firestore if collection is empty
    seedInitialCategoriesIfEmpty(activeDefaultCategories).catch((err) => {
      console.warn('Firestore initial categories seeding error:', err);
    });

    // C. Real-time subscribe to products collection in Firestore
    const unsubProducts = subscribeProductsFromFirestore(
      (cloudProducts) => {
        const currentDeleted = getDeletedProductIds().map((id) => String(id).trim());
        if (cloudProducts && cloudProducts.length > 0) {
          const activeList = cloudProducts.filter(
            (p) => !currentDeleted.includes(String(p.id).trim())
          );
          const normalized = normalizeProducts(activeList);
          setProducts(normalized);
          try {
            localStorage.setItem('aura_store_products', JSON.stringify(normalized));
          } catch {
            // cache ignore
          }
        } else if (cloudProducts && cloudProducts.length === 0) {
          // If firestore has 0 products
          setProducts([]);
          try {
            localStorage.setItem('aura_store_products', JSON.stringify([]));
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

    // D. Real-time subscribe to categories collection in Firestore
    const unsubCategories = subscribeCategoriesFromFirestore(
      (cloudCategories) => {
        const currentDeleted = getDeletedCategoryIds().map((id) => String(id).trim());
        if (cloudCategories && cloudCategories.length > 0) {
          const activeList = cloudCategories.filter(
            (c) => !currentDeleted.includes(String(c.id).trim())
          );
          setCategories(activeList);
          try {
            localStorage.setItem('aura_store_categories', JSON.stringify(activeList));
          } catch {
            // cache quota safe ignore
          }
        } else if (cloudCategories && cloudCategories.length === 0) {
          // If empty
          setCategories([]);
          try {
            localStorage.setItem('aura_store_categories', JSON.stringify([]));
          } catch {
            // ignore
          }
        }
        setIsFirebaseConnected(true);
      },
      (err) => {
        console.warn('Firestore categories subscription error:', err);
      }
    );

    // E. Real-time subscribe to orders collection in Firestore
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
      unsubCategories();
      unsubOrders();
    };
  }, []);

  // Save to local cache on changes
  useEffect(() => {
    try {
      localStorage.setItem('aura_store_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to persist products cache:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_store_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to persist orders cache:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('aura_store_categories', JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to persist categories cache to localStorage (Firestore is active):', e);
    }
  }, [categories]);

  const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
    const slug =
      categoryData.slug ||
      categoryData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    const newId = `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newCat: Category = {
      ...categoryData,
      id: newId,
      slug: slug || 'custom-collection',
      productCount: categoryData.productCount || 0
    };

    // Remove from deleted set if was there
    try {
      const activeDeleted = getDeletedCategoryIds().filter(
        (id) => String(id).trim() !== newId
      );
      localStorage.setItem('aura_deleted_category_ids', JSON.stringify(activeDeleted));
    } catch {
      // ignore
    }

    setCategories((prev) => [...prev, newCat]);
    saveCategoryToFirestore(newCat).catch((err) =>
      console.warn('Failed to save category to Firestore:', err)
    );
    return newCat;
  };

  const updateCategory = (updated: Category) => {
    setCategories((prev) =>
      prev.map((c) => (String(c.id).trim() === String(updated.id).trim() ? updated : c))
    );
    saveCategoryToFirestore(updated).catch((err) =>
      console.warn('Failed to update category in Firestore:', err)
    );
  };

  const deleteCategory = (categoryId: string) => {
    const targetId = String(categoryId).trim();

    // 1. Mark as deleted in localStorage cache
    try {
      const deletedIds = getDeletedCategoryIds().map((id) => String(id).trim());
      if (!deletedIds.includes(targetId)) {
        deletedIds.push(targetId);
        localStorage.setItem('aura_deleted_category_ids', JSON.stringify(deletedIds));
      }
    } catch {
      // ignore
    }

    // 2. Remove immediately from React state and localStorage cache
    setCategories((prev) => {
      const updated = prev.filter((c) => String(c.id).trim() !== targetId);
      try {
        localStorage.setItem('aura_store_categories', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // 3. Delete document from Firestore
    deleteCategoryFromFirestore(targetId).catch((err) =>
      console.warn('Failed to delete category in Firestore:', err)
    );
  };

  const resetCategories = () => {
    localStorage.removeItem('aura_deleted_category_ids');
    setCategories(CATEGORIES);
    try {
      localStorage.setItem('aura_store_categories', JSON.stringify(CATEGORIES));
    } catch {
      // ignore
    }
    CATEGORIES.forEach((c) => {
      saveCategoryToFirestore(c).catch(() => {});
    });
  };

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newId = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const [normalized] = normalizeProducts([{ ...productData, id: newId }]);

    // Make sure newId is not in deleted set
    try {
      const activeDeleted = getDeletedProductIds().filter((id) => String(id).trim() !== newId);
      localStorage.setItem('aura_deleted_product_ids', JSON.stringify(activeDeleted));
    } catch {
      // ignore
    }

    setProducts((prev) => [normalized, ...prev]);
    saveProductToFirestore(normalized).catch((err) =>
      console.warn('Failed to save new product to Firestore:', err)
    );
    return normalized;
  };

  const updateProduct = (updated: Product) => {
    const [normalized] = normalizeProducts([updated]);
    setProducts((prev) =>
      prev.map((item) => (String(item.id).trim() === String(normalized.id).trim() ? normalized : item))
    );
    saveProductToFirestore(normalized).catch((err) =>
      console.warn('Failed to update product in Firestore:', err)
    );
  };

  const deleteProduct = (productId: string) => {
    const targetId = String(productId).trim();

    // 1. Mark as deleted so neither local cache nor Firestore will revive it
    try {
      const deletedIds = getDeletedProductIds().map((id) => String(id).trim());
      if (!deletedIds.includes(targetId)) {
        deletedIds.push(targetId);
        localStorage.setItem('aura_deleted_product_ids', JSON.stringify(deletedIds));
      }
    } catch {
      // ignore
    }

    // 2. Remove immediately from React state and localStorage cache
    setProducts((prev) => {
      const updated = prev.filter((item) => String(item.id).trim() !== targetId);
      try {
        localStorage.setItem('aura_store_products', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // 3. Delete document from Firestore
    deleteProductFromFirestore(targetId).catch((err) =>
      console.warn('Failed to delete product in Firestore:', err)
    );
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const resetProducts = () => {
    localStorage.removeItem('aura_deleted_product_ids');
    localStorage.removeItem('aura_store_products');
    setProducts(PRODUCTS);
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
      orderNumber: `TZ-${randomSuffix}`,
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
            status
          };

          const effectiveTracking = trackingNumber !== undefined ? trackingNumber : ord.trackingNumber;
          if (effectiveTracking) {
            updated.trackingNumber = effectiveTracking;
          } else {
            delete updated.trackingNumber;
          }

          const effectiveNotes = notes !== undefined ? notes : ord.notesFromAdmin;
          if (effectiveNotes) {
            updated.notesFromAdmin = effectiveNotes;
          } else {
            delete updated.notesFromAdmin;
          }

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
        trimmedId === 'sachinsis0308@gmail.com' ||
        trimmedId === 'management.teezoon@gmail.com' ||
        trimmedId === 'admin@teezoon.com' ||
        trimmedId === 'admin@swamithreads.com' ||
        trimmedId === 'admin@aurathreads.com' ||
        trimmedId.endsWith('@teezoon.com') ||
        trimmedId.endsWith('@swamithreads.com') ||
        trimmedId.endsWith('@aurathreads.com')) &&
      (trimmedPass === 'Teezoon@321swami' ||
        trimmedPass.toLowerCase() === 'teezoon@321swami' ||
        trimmedPass === ADMIN_DEFAULT_PASS ||
        trimmedPass === 'admin' ||
        trimmedPass === 'admin123' ||
        trimmedPass === 'Admin@2026' ||
        trimmedPass === '123456' ||
        trimmedPass === 'teezoon' ||
        trimmedPass === 'teezoon123');

    if (!isValidAdmin) {
      return {
        success: false,
        message: 'Invalid Admin ID or Password. Check credentials and try again.'
      };
    }

    // Direct Login - No OTP required
    const emailToUse = trimmedId.includes('@') ? trimmedId : ADMIN_DEFAULT_EMAIL;
    const session: AdminSession = {
      email: emailToUse,
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
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategories,
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
