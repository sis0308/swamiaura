import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, CustomerOrder, Category } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with ignoreUndefinedProperties: true so undefined fields never cause errors
export const db = (() => {
  try {
    return firebaseConfig.firestoreDatabaseId
      ? initializeFirestore(app, { ignoreUndefinedProperties: true }, firebaseConfig.firestoreDatabaseId)
      : initializeFirestore(app, { ignoreUndefinedProperties: true });
  } catch {
    return firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
})();

export const isFirebaseActive = true;

/**
 * Deeply sanitizes data before writing to Firestore.
 * Recursively strips keys whose values are `undefined` to guarantee
 * "Function setDoc() called with invalid data. Unsupported field value: undefined"
 * will never occur.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

/**
 * Real-time subscription to Products collection in Firestore
 */
export const subscribeProductsFromFirestore = (
  onData: (products: Product[]) => void,
  onError?: (err: unknown) => void
) => {
  try {
    const productsCol = collection(db, 'products');
    return onSnapshot(
      productsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product;
            list.push({ ...data, id: docSnap.id });
          });
          onData(list);
        } else {
          onData([]);
        }
      },
      (err) => {
        console.warn('Firestore products onSnapshot warning:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to Firestore products:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Seed initial products into Firestore if the collection is empty
 */
export const seedInitialProductsIfEmpty = async (defaultProducts: Product[]) => {
  try {
    const productsCol = collection(db, 'products');
    const existing = await getDocs(productsCol);
    if (existing.empty && defaultProducts.length > 0) {
      console.log(`Seeding ${defaultProducts.length} default products to Firestore...`);
      const batch = writeBatch(db);
      for (const prod of defaultProducts) {
        const docRef = doc(db, 'products', prod.id);
        batch.set(docRef, sanitizeForFirestore(prod));
      }
      await batch.commit();
      console.log('Seeding products to Firestore completed successfully.');
    }
  } catch (err) {
    console.warn('Failed to seed initial products to Firestore:', err);
  }
};

/**
 * Save / Update a product in Firestore
 */
export const saveProductToFirestore = async (product: Product) => {
  try {
    const docRef = doc(db, 'products', product.id);
    const cleaned = sanitizeForFirestore(product);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Failed to save product to Firestore:', err);
    throw err;
  }
};

/**
 * Delete a product from Firestore
 */
export const deleteProductFromFirestore = async (productId: string) => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
    throw err;
  }
};

/**
 * Real-time subscription to Categories collection in Firestore
 */
export const subscribeCategoriesFromFirestore = (
  onData: (categories: Category[]) => void,
  onError?: (err: unknown) => void
) => {
  try {
    const categoriesCol = collection(db, 'categories');
    return onSnapshot(
      categoriesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Category[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Category;
            list.push({ ...data, id: docSnap.id });
          });
          onData(list);
        } else {
          onData([]);
        }
      },
      (err) => {
        console.warn('Firestore categories onSnapshot warning:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to Firestore categories:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Seed initial categories into Firestore if the collection is empty
 */
export const seedInitialCategoriesIfEmpty = async (defaultCategories: Category[]) => {
  try {
    const categoriesCol = collection(db, 'categories');
    const existing = await getDocs(categoriesCol);
    if (existing.empty && defaultCategories.length > 0) {
      console.log(`Seeding ${defaultCategories.length} default categories to Firestore...`);
      const batch = writeBatch(db);
      for (const cat of defaultCategories) {
        const docRef = doc(db, 'categories', cat.id);
        batch.set(docRef, sanitizeForFirestore(cat));
      }
      await batch.commit();
      console.log('Seeding categories to Firestore completed successfully.');
    }
  } catch (err) {
    console.warn('Failed to seed initial categories to Firestore:', err);
  }
};

/**
 * Save / Update a category in Firestore
 */
export const saveCategoryToFirestore = async (category: Category) => {
  try {
    const docRef = doc(db, 'categories', category.id);
    const cleaned = sanitizeForFirestore(category);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Failed to save category to Firestore:', err);
    throw err;
  }
};

/**
 * Delete a category from Firestore
 */
export const deleteCategoryFromFirestore = async (categoryId: string) => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete category from Firestore:', err);
    throw err;
  }
};

/**
 * Real-time subscription to Orders collection in Firestore
 */
export const subscribeOrdersFromFirestore = (
  onData: (orders: CustomerOrder[]) => void,
  onError?: (err: unknown) => void
) => {
  try {
    const ordersCol = collection(db, 'orders');
    return onSnapshot(
      ordersCol,
      (snapshot) => {
        const list: CustomerOrder[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as CustomerOrder;
          list.push({ ...data, id: docSnap.id });
        });
        // Sort newest first
        list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        onData(list);
      },
      (err) => {
        console.warn('Firestore orders onSnapshot warning:', err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn('Error subscribing to Firestore orders:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Save / Update an order in Firestore
 */
export const saveOrderToFirestore = async (order: CustomerOrder) => {
  try {
    const docRef = doc(db, 'orders', order.id);
    const cleaned = sanitizeForFirestore(order);
    await setDoc(docRef, cleaned, { merge: true });
  } catch (err) {
    console.error('Failed to save order to Firestore:', err);
    throw err;
  }
};

/**
 * Delete an order from Firestore
 */
export const deleteOrderFromFirestore = async (orderId: string) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete order from Firestore:', err);
    throw err;
  }
};
